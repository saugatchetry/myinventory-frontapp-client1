import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockitemComponent } from './restockitem.component';

describe('RestockitemComponent', () => {
  let component: RestockitemComponent;
  let fixture: ComponentFixture<RestockitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestockitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestockitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
