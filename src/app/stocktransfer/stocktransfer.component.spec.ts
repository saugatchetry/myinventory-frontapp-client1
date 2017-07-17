import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktransferComponent } from './stocktransfer.component';

describe('StocktransferComponent', () => {
  let component: StocktransferComponent;
  let fixture: ComponentFixture<StocktransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
