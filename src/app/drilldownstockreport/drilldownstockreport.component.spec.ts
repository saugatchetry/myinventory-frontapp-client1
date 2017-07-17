import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrilldownstockreportComponent } from './drilldownstockreport.component';

describe('DrilldownstockreportComponent', () => {
  let component: DrilldownstockreportComponent;
  let fixture: ComponentFixture<DrilldownstockreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrilldownstockreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrilldownstockreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
