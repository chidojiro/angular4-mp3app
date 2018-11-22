import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.user.isAdmin) {
      return true;
    } else {
      this.router.navigate(['/']);
      alert('No privilege');
      return false;
    }
  }
}
