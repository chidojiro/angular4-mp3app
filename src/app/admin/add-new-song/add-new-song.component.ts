import { Song } from './../../song';
import { FirebaseService } from './../../firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-song',
  templateUrl: './add-new-song.component.html',
  styleUrls: ['./add-new-song.component.css']
})
export class AddNewSongComponent implements OnInit {
  song: Song;
  genresList = ['Nhạc Trẻ', 'Nhạc Trữ Tình', 'Dance Việt', 'Rock Việt', 'Rap - Hiphop Việt', 'Nhạc Trịnh', 'Nhạc Thiếu Nhi'];
  mp3File;

  constructor(private firebaseService: FirebaseService) {
    this.song = new Song();
  }

  ngOnInit() {
  }

  changeArtists(artists: String) {
    this.song.artists = artists.trim().split(',').map(artist => {
      return artist.trim();
    });
  }

  changeGenres(genre, isChecked) {
    if (isChecked) {
      this.song.genres.push(genre);
    } else {
      this.song.genres.splice(this.song.genres.indexOf(genre), 1);
    }
  }

  async addNewSong() {
    const refToMp3File: any = await this.firebaseService.uploadMp3FileToStorage(this.mp3File);
    const mp3FileDownloadUrl = await refToMp3File.getDownloadURL();
    this.song.downloadURL = mp3FileDownloadUrl;
    this.firebaseService.addSongToFirebase(this.song);
  }

  changeMp3(file) {
    this.mp3File = file;
  }

}
