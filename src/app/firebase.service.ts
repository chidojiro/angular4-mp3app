import { User } from './user';
import { Song } from './song';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import { standardizeVietnamese, filterNullInArray } from './UtilFunctions';

@Injectable()
export class FirebaseService {
  authState;

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase) {
    this.authState = afAuth.authState;
  }

  signInWithGoogleAuth() {
    localStorage.setItem('isSigningIn', 'true');
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async updateUserInformation(state) {
    await this.afDb.object(`users/${state.uid}`).update({
      displayName: state.displayName,
      email: state.email
    });
    return this.afDb.object(`users/${state.uid}`);
  }

  uploadMp3FileToStorage(mp3File) {
    return new Promise((resolve, reject) => {
      const uploadTask = firebase
        .storage()
        .ref(`mp3/${mp3File.name}`)
        .put(mp3File, { contentType: 'audio/mp3' });
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          //  progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
        },
        error => {
          // switch (error.code) {
          //   case 'storage/unauthorized':
          //     break;
          //   case 'storage/canceled':
          //     break;
          //   case 'storage/unknown':
          //     break;
          // }
        },
        () => resolve(uploadTask.snapshot.ref)
      );
    });
    // const storageRef = firebase.storage().ref();
    // storageRef.put(mp3File, {contentType: });
  }

  async addSongToFirebase(song: Song) {
    const refToSong = await this.afDb.list('songs').push(song);
    const songId = refToSong.path.o[1];
    song.artists.forEach(artist => {
      this.afDb.list(`artists/${artist}`).push(songId);
    });
    song.genres.forEach(genre => {
      this.afDb.list(`genres/${genre}`).push(songId);
    });
  }

  searchByQuery(query: String) {
    query = standardizeVietnamese(query.toLowerCase());
    return this.afDb.object('songs').map(songs => {
      return Object.keys(songs)
        .reduce((arrayOfSongs, songId) => {
          const combinedTitle = standardizeVietnamese(
            (songs[songId].title + ' ')
              .concat(songs[songId].artists.join(' '))
              .toLocaleLowerCase()
          );
          if (combinedTitle.indexOf(query) !== -1) {
            return arrayOfSongs.concat({
              id: songId,
              ...songs[songId]
            });
          } else {
            return arrayOfSongs;
          }
        }, []);
    });
  }

  searchById(id) {
    return this.afDb.object('songs').take(1).map(songs => {
      return Object.keys(songs).reduce((song, songId) => {
        if (id === songId) {
          this.afDb.object(`songs/${id}`).update({
            views: (songs[id].views ? songs[id].views : 0) + 1
          });
          return {
            id: songId,
            ...songs[songId],
            likedUsers: songs[songId].likedUsers ? Object.values(songs[songId].likedUsers) : [],
            likes: songs[songId].likedUsers ? Object.values(songs[songId].likedUsers).length : 0,
          };
        } else {
          return song;
        }
      }, null);
    });
  }

  userLikeThisSong(user, song) {
    this.afDb.list(`songs/${song.id}/likedUsers`).push(user.uid);
  }

  userUnlikeThisSong(user, song) {
    this.afDb.list(`songs/${song.id}/likedUsers`).take(1).subscribe((likedUsers: any[]) => {
      likedUsers.forEach(likedUser => {
        if (likedUser.$value === user.uid) {
          this.afDb.list(`songs/${song.id}/likedUsers/${likedUser.$key}`).remove();
        }
      });
    });
  }

  getAvailableArtists() {
    return this.afDb.object('artists').map(artists => {
      return Object.keys(artists);
    });
  }

  async editSong(song) {
    this.afDb.object(`songs/${song.id}`).update({ ...song, id: null });

    const artists = await this.afDb.object(`artists`).take(1).toPromise();
    await Promise.all(Object.keys(artists).map(async (artist) => {
      const songsOfArtist = await this.afDb.object(`artists/${artist}`).take(1).toPromise();
      Object.keys(songsOfArtist).forEach(async songIdOfArtist => {
        if (songsOfArtist[songIdOfArtist] === song.id) {
          this.afDb.object(`artists/${artist}/${songIdOfArtist}`).remove();
        }
      });
    }));

    song.artists.forEach(artist => {
      this.afDb.list(`artists/${artist}`).push(song.id);
    });

    const genres = await this.afDb.object(`genres`).take(1).toPromise();
    await Promise.all(Object.keys(genres).map(async (genre) => {
      const songsOfGenre = await this.afDb.object(`genres/${genre}`).take(1).toPromise();
      Object.keys(songsOfGenre).forEach(async songIdOfGenre => {
        if (songsOfGenre[songIdOfGenre] === song.id) {
          this.afDb.object(`genres/${genre}/${songIdOfGenre}`).remove();
        }
      });
    }));

    song.genres.forEach(genre => {
      this.afDb.list(`genres/${genre}`).push(song.id);
    });
  }

  deleteSong(song) {
    this.afDb.object(`songs/${song.id}`).remove();

    song.artists.forEach(artist => {
      this.afDb.list(`artists/${artist}`).subscribe(songsOfArtist => {
        songsOfArtist.forEach(songOfArtist => {
          if (songOfArtist.$value === song.id) {
            this.afDb.object(`artists/${artist}/${songOfArtist.$key}`).remove();
          }
        });
        // this.afDb.object(`artists/${artist}/${songsOfArtist}`)
      });
    });
    song.genres.forEach(genre => {
      this.afDb.list(`genres/${genre}`).subscribe(songsOfGenre => {
        songsOfGenre.forEach(songOfGenre => {
          if (songOfGenre.$value === song.id) {
            this.afDb.object(`genres/${genre}/${songOfGenre.$key}`).remove();
          }
        });
        // this.afDb.object(`artists/${artist}/${songsOfArtist}`)
      });
    });
  }

  addSongToPlaylist(song: Song, user: User) {
    this.afDb.list(`users/${user.uid}/playlist`).push(song.id);
  }

  getUserPlaylist(user: User) {
    return this.afDb.object(`users/${user.uid}/playlist`).map(playlist => filterNullInArray(Object.values(playlist)));
  }
}
