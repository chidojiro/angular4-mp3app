import { Song } from './../song';
import { Component, OnDestroy, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnDestroy, OnInit {
  isPlaying = false;
  isLoop = localStorage.getItem('isLoop') || false;
  isMuted = localStorage.getItem('isMuted') || false;
  playedPercentage = 0;
  interval;

  @Input() playlist;
  @Input() nowPlaying;
  @Input() song: Song;

  ngOnInit() {
    if (this.playlist) {
      this.song = this.playlist[this.nowPlaying.index];
    }
    this.getPlayer().volume = Number(localStorage.getItem('volume')) || 1;
  }

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  getPlayer() {
    return document.querySelector('audio');
  }

  getVolumeAdjuster() {
    return document.querySelector('.volume-adjuster');
  }

  play() {
    this.getPlayer().play();
    this.isPlaying = true;
    this.interval = setInterval(() => {
      this.playedPercentage = this.getPlayer().currentTime / this.getPlayer().duration;
    }, 500);
  }

  stop() {
    this.isPlaying = false;
    if (this.playlist) {
      this.nowPlaying.index++;
      if (this.nowPlaying.index === this.playlist.length) {
        this.nowPlaying.index = 0;
      }
      this.song = this.playlist[this.nowPlaying.index];
      this.isPlaying = true;
      this.getPlayer().load();
    }
  }

  pause() {
    this.getPlayer().pause();
    this.isPlaying = false;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  changeCurrentTime(e) {
    this.getPlayer().currentTime = e.target.value * this.getPlayer().duration;
  }

  changeLikeStatus() {
    if (!this.authService.user) {
      return alert('Vui Lòng Đăng Nhập');
    }

    if (!this.isUserLikedThisSong()) {
      this.song.likes++;
      this.song.likedUsers.push(this.authService.user.uid);
      this.firebaseService.userLikeThisSong(this.authService.user, this.song);
    } else {
      this.song.likes--;
      this.song.likedUsers.splice(this.song.likedUsers.indexOf(this.authService.user.uid), 1);
      this.firebaseService.userUnlikeThisSong(this.authService.user, this.song);
    }
  }

  isUserLikedThisSong() {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    return this.song.likedUsers.indexOf(this.authService.user.uid) !== -1;
  }

  isSongAddedToPlaylist() {
    return this.authService.user ? this.authService.user.playlist.indexOf(this.song.id) !== -1 : false;
  }

  addToPlaylist() {
    if (!this.authService.user) {
      return alert('Vui Lòng Đăng Nhập');
    }
    this.authService.user.playlist.push(this.song.id);
    this.firebaseService.addSongToPlaylist(this.song, this.authService.user);
  }

  changeVolume(newVolume) {
    this.isMuted = false;
    this.getPlayer().volume = newVolume;
    localStorage.setItem('volume', newVolume);
  }

  loop() {
    if (!this.isLoop) {
      this.isLoop = true;
      localStorage.setItem('isLoop', 'true');
    } else {
      this.isLoop = false;
      localStorage.removeItem('isLoop');
    }
  }

  mute() {
    this.isMuted = true;
    (<HTMLInputElement>this.getVolumeAdjuster()).value = '0';
    localStorage.setItem('isMuted', 'true');
  }

  unmute() {
    this.isMuted = false;
    (<HTMLInputElement>this.getVolumeAdjuster()).value = this.getPlayer().volume.toString();
    localStorage.removeItem('isMuted');
  }

  getSong() {
    if (this.playlist) {
      return this.playlist[this.nowPlaying.index];
    }
    return this.song;
  }
}
