import { AuthService } from './auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(authService: AuthService) {
  }

  isSigningIn() {
    return localStorage.getItem('isSigningIn');
  }
}
