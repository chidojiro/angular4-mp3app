import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCounterComponent } from './page-counter.component';

describe('PageCounterComponent', () => {
  let component: PageCounterComponent;
  let fixture: ComponentFixture<PageCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
