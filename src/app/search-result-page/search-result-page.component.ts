import { AuthService } from './../auth.service';
import { FirebaseService } from './../firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.css']
})
export class SearchResultPageComponent implements OnInit {
  songsInThisPage: any[];
  songsFound: any[];
  query;
  pageConfig = {
    page: 1,
    max: 1
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    activatedRoute.paramMap.subscribe(param => {
      this.query = param.get('query');
      firebaseService.searchByQuery(this.query).subscribe(
        songs => {
          this.songsFound = songs;
          this.pageConfig.max = songs.length === 0 ? 1 : Math.ceil(songs.length / 10);
          activatedRoute.queryParamMap.subscribe(query => {
            this.pageConfig.page = query.get('page') ? Number(query.get('page')) : 1;
            this.songsInThisPage = this.songsFound.slice((this.pageConfig.page - 1) * 10, 10 * this.pageConfig.page);
            window.scrollTo(0, 0);
          });
        });
    });
  }

  ngOnInit() {
  }

  deleteSong(song) {
    this.firebaseService.deleteSong(song);
  }

  changePage(page) {
    this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: { page } });
  }
}
