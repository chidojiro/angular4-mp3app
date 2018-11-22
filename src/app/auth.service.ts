import { FirebaseService } from './firebase.service';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: User;
  constructor(private firebaseService: FirebaseService) {
    const localUser = localStorage.getItem('localUser');
    if (localUser) {
      this.user = localUser ? JSON.parse(localUser) : null;
    } else {
      this.firebaseService.authState.subscribe(async state => {
        if (state) {
          try {
            const user$ = await firebaseService.updateUserInformation(state);
            console.log('asd');
            user$.subscribe(user => {
              this.user = new User(
                user.displayName,
                user.email,
                user.$key,
                user.isAdmin,
                user.playlist ? Object.values(user.playlist) : null
              );
              localStorage.setItem('localUser', JSON.stringify(this.user));
            });
          } catch {
            alert('Something wrong');
          }
        }
        localStorage.removeItem('isSigningIn');
      });
    }
  }

  logginWithGoogleAuth() {
    this.firebaseService.signInWithGoogleAuth();
  }

  logout() {
    this.user = null;
    localStorage.removeItem('localUser');
    this.firebaseService.logout();
  }

  isLoggedIn() {
    return this.user;
  }
}
