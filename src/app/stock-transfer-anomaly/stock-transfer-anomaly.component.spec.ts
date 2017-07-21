import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferAnomalyComponent } from './stock-transfer-anomaly.component';

describe('StockTransferAnomalyComponent', () => {
  let component: StockTransferAnomalyComponent;
  let fixture: ComponentFixture<StockTransferAnomalyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferAnomalyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferAnomalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
