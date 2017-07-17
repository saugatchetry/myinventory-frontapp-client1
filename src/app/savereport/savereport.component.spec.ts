import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavereportComponent } from './savereport.component';

describe('SavereportComponent', () => {
  let component: SavereportComponent;
  let fixture: ComponentFixture<SavereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
