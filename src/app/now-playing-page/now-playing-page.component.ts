import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from './../firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-now-playing-page',
  templateUrl: './now-playing-page.component.html',
  styleUrls: ['./now-playing-page.component.css']
})
export class NowPlayingPageComponent implements OnInit {
  nowPlaying;
  constructor(firebaseService: FirebaseService, activatedRoute: ActivatedRoute) {
    activatedRoute.paramMap.subscribe(param => {
      firebaseService.searchById(param.get('id')).subscribe(song => {
        this.nowPlaying = song;
      });
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
