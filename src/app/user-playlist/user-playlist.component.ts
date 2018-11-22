import { AuthService } from './../auth.service';
import { FirebaseService } from './../firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-playlist',
  templateUrl: './user-playlist.component.html',
  styleUrls: ['./user-playlist.component.css']
})
export class UserPlaylistComponent implements OnInit {
  nowPlaying = { index: 0 };
  playlist: any[] = [];
  constructor(private firebaseService: FirebaseService, private authService: AuthService) {
    firebaseService.getUserPlaylist(authService.user).subscribe(playlist => {
      console.log(playlist);
      playlist.forEach(songId => {
        this.firebaseService.searchById(songId).subscribe(song => {
          this.playlist.push(song);
        });
      });
    });
  }

  ngOnInit() {
  }

  changeSong(song) {
    this.nowPlaying.index = this.playlist.indexOf(song);
    document.querySelector('audio').load();
  }
}
