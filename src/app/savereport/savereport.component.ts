import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-savereport',
  templateUrl: './savereport.component.html',
  styleUrls: ['./savereport.component.css']
})
export class SavereportComponent implements OnInit {
@ViewChild('navigation') navigation:ElementRef;
@ViewChild('content') content:ElementRef;
  constructor() { }

  ngOnInit() {
  }

  openNav(){
    this.navigation.nativeElement.style.width = "250px";
    this.content.nativeElement.style.marginLeft = "250px";
  }
  
  closeNav(){
    this.navigation.nativeElement.style.width = "0";
    this.content.nativeElement.style.marginLeft = "0";
  }

}
