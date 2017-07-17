import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorwiseInventoryStatusComponent } from './vendorwise-inventory-status.component';

describe('VendorwiseInventoryStatusComponent', () => {
  let component: VendorwiseInventoryStatusComponent;
  let fixture: ComponentFixture<VendorwiseInventoryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorwiseInventoryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorwiseInventoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
