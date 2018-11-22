import { AdminGuardService } from './admin-guard.service';
import { AuthGuardService } from './auth-guard.service';
import { HomePageComponent } from './home-page/home-page.component';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { AddNewSongComponent } from './admin/add-new-song/add-new-song.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { NowPlayingPageComponent } from './now-playing-page/now-playing-page.component';
import { EditSongPageComponent } from './admin/edit-song-page/edit-song-page.component';
import { UserPlaylistComponent } from './user-playlist/user-playlist.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PageCounterComponent } from './page-counter/page-counter.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MusicPlayerComponent,
    MusicPageComponent,
    HomePageComponent,
    AddNewSongComponent,
    SearchResultPageComponent,
    NowPlayingPageComponent,
    EditSongPageComponent,
    UserPlaylistComponent,
    NotFoundPageComponent,
    PageCounterComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'music',
        component: MusicPageComponent,
      },
      {
        path: 'admin/song/add',
        component: AddNewSongComponent,
        canActivate: [AuthGuardService, AdminGuardService]
      },
      {
        path: 'search-result/:query',
        component: SearchResultPageComponent
      },
      {
        path: 'song/:id',
        component: NowPlayingPageComponent
      },
      {
        path: 'song/edit/:id',
        component: EditSongPageComponent,
        canActivate: [AuthGuardService, AdminGuardService]
      },
      {
        path: 'user/playlist',
        component: UserPlaylistComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: '**',
        component: HomePageComponent
      }
    ])
  ],
  providers: [
    AuthService,
    FirebaseService,
    AuthGuardService,
    AdminGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
