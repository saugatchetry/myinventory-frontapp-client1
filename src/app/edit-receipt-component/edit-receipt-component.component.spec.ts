import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceiptComponentComponent } from './edit-receipt-component.component';

describe('EditReceiptComponentComponent', () => {
  let component: EditReceiptComponentComponent;
  let fixture: ComponentFixture<EditReceiptComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReceiptComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReceiptComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
