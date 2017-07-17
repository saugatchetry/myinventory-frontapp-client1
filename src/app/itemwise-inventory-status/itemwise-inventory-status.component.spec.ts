import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemwiseInventoryStatusComponent } from './itemwise-inventory-status.component';

describe('ItemwiseInventoryStatusComponent', () => {
  let component: ItemwiseInventoryStatusComponent;
  let fixture: ComponentFixture<ItemwiseInventoryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemwiseInventoryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemwiseInventoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
