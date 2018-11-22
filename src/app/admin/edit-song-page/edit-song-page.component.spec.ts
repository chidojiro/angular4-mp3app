import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSongPageComponent } from './edit-song-page.component';

describe('EditSongPageComponent', () => {
  let component: EditSongPageComponent;
  let fixture: ComponentFixture<EditSongPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSongPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSongPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
