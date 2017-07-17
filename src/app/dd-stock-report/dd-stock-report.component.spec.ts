import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdStockReportComponent } from './dd-stock-report.component';

describe('DdStockReportComponent', () => {
  let component: DdStockReportComponent;
  let fixture: ComponentFixture<DdStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
