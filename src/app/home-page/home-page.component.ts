import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  artists: Observable<String[]>;
  constructor(firebaseService: FirebaseService) {
    this.artists = firebaseService.getAvailableArtists();
  }

  ngOnInit() {
  }

}
