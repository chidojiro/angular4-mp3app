import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  shouldShowUserOptions = false;
  constructor( public authService: AuthService, private router: Router ) { }

  ngOnInit() {
  }

  showUserOptions() {
    this.shouldShowUserOptions = true;
  }

  hideUserOptions() {
    this.shouldShowUserOptions = false;
  }

  search(query) {
    this.router.navigate(['search-result', query]);
  }
}
