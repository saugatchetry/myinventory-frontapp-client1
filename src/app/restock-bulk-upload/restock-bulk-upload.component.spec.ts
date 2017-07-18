import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockBulkUploadComponent } from './restock-bulk-upload.component';

describe('RestockBulkUploadComponent', () => {
  let component: RestockBulkUploadComponent;
  let fixture: ComponentFixture<RestockBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestockBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestockBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
