import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NetworkService } from './../services/network.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {

	public dateFilterOn = false;
  public filterStartDate:string = "";
  public filterEndDate:string = "";
  public today = new Date().toJSON().split('T')[0];
  public dateString:string;

  @Output() clicked=new EventEmitter<{}>(); 

  constructor(private networkService : NetworkService) { }

  ngOnInit() {
  	this.filterStartDate = this.networkService.getPriorDate();
    this.filterEndDate = this.networkService.getTodayDate();
  }

  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
  }

  submitFilters(){

    var startDate:string = this.dateString;
    var endDate:string = this.today;


    if(this.filterStartDate != '' && this.filterEndDate != ''){
      var d1 = Date.parse(this.filterStartDate);
      var d2 = Date.parse(this.filterEndDate);
      if (d1 > d2) {
          alert("End Date cannot be before Start Date");
      }
      else{
        startDate = this.filterStartDate;
        endDate = this.filterEndDate;
      }
    }

    else if(this.filterStartDate != '' && this.filterEndDate == ''){
        startDate = this.filterStartDate;
        endDate = this.today;
    }

    else if(this.filterStartDate == '' && this.filterEndDate !=''){
      startDate = this.dateString;
      endDate = this.filterEndDate;
    }

    else{
      startDate = this.dateString;
      endDate = this.today;
    }

    let data_out = {
    	startDate: this.filterStartDate,
    	endDate: this.filterEndDate
    }
    this.clicked.emit(data_out);
  }
}
