import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-page-counter',
  templateUrl: './page-counter.component.html',
  styleUrls: ['./page-counter.component.css']
})
export class PageCounterComponent implements OnInit {
  @Input() pageConfig;
  @Output() pageChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changePage(page) {
    this.pageChange.emit(page);
  }

}
