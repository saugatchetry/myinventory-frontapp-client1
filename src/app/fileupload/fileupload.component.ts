import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  private url:string = "/api/excelUpload"

  constructor(private http:Http) { }

  ngOnInit() {
  }


  // uploadFile: any;
  // hasBaseDropZoneOver: boolean = false;
  // options: Object = {
  //   url: '/api/excelUpload',
    
  //   'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryjjE2fOAXGQFl7GZ2'
     
  // };
  // sizeLimit = 2000000;
 
  // handleUpload(data): void {
  //   console.log("2nd");
  //   if (data && data.response) {
  //     data = JSON.parse(data.response);
  //     console.log("Data = "+data);
  //     this.uploadFile = data;

  //   }
  // }
 
  // fileOverBase(e:any):void {
  //   this.hasBaseDropZoneOver = e;
  // }
 
  // beforeUpload(uploadingFile): void {
  //   console.log("1st");
  //   if (uploadingFile.size > this.sizeLimit) {
  //     uploadingFile.setAbort();
  //     alert('File is too large');
  //   }
  //   else{
  //     alert('File uploaded successfully');
  //   }
  // }


  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('file', file, file.name);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.url, formData, options)
            .map(res => null)
            .catch(error => Observable.throw(error))
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )
    }
}

}
