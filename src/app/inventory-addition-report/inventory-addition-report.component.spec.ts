import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdditionReportComponent } from './inventory-addition-report.component';

describe('InventoryAdditionReportComponent', () => {
  let component: InventoryAdditionReportComponent;
  let fixture: ComponentFixture<InventoryAdditionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAdditionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAdditionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
