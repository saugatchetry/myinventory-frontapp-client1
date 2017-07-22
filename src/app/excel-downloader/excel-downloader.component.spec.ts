import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelDownloaderComponent } from './excel-downloader.component';

describe('ExcelDownloaderComponent', () => {
  let component: ExcelDownloaderComponent;
  let fixture: ComponentFixture<ExcelDownloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelDownloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
