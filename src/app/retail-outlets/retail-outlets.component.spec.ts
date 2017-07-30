import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailOutletsComponent } from './retail-outlets.component';

describe('RetailOutletsComponent', () => {
  let component: RetailOutletsComponent;
  let fixture: ComponentFixture<RetailOutletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailOutletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
