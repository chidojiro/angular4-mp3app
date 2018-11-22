import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NowPlayingPageComponent } from './now-playing-page.component';

describe('NowPlayingPageComponent', () => {
  let component: NowPlayingPageComponent;
  let fixture: ComponentFixture<NowPlayingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NowPlayingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPlayingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
