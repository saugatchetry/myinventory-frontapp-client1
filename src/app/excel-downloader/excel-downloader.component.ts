import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel-downloader',
  templateUrl: './excel-downloader.component.html',
  styleUrls: ['./excel-downloader.component.css']
})
export class ExcelDownloaderComponent implements OnInit {

	public data;
	public fileName;
  constructor() { }

  ngOnInit() {
  }

  DownloadToExcel(fileName, data) {
  // 		/* generate worksheet */
		// const ws = XLSX.utils.aoa_to_sheet(this.data);

		// /* generate workbook and add the worksheet */
		// const wb = XLSX.utils.book_new();
		// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		// /* save to file */
		// const wbout = XLSX.write(wb, this.wopts);
		// console.log(this.fileName);
		// saveAs(new Blob([s2ab(wbout)]), this.fileName);
  }
}
