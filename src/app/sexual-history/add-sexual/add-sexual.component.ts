import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Inject } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AddSexualService } from '../../services/add-sexual.service';
import { Router, NavigationStart } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-sexual',
  templateUrl: './add-sexual.component.html',
  styleUrls: ['./add-sexual.component.css']
})

export class AddSexualComponent implements OnInit {
  sexualActivityForm: FormGroup;

  sexualactivity_list = [[1,"Vaginal"], [2,"Anal"], [3,"Oral"], [4,"Other"]]; //Should we use db or just store it here as a variable? db seems to be a hassle
  sexualactivity_value_list = [1, 2, 3, 4];
  contraceptive_list = [[1,"Condom"], [2,"PrEP"]];
  contraceptive_value_list = [1, 2];

  public contactlist = [];

  activities_performed = [];
  contraceptives_used = [];
  comment: string;
  date = new Date();
  selectedDate: string;

  sexualpartners = [];
  sexualpartnerID = [];

  @Output() 
  dateChange:EventEmitter<MatDatepickerInputEvent<any>>;

  /* Checks for checkbox selection and pushes the selected item to the input array */
  OnCheckboxSelect(item, array, status:boolean) {
    if (array.indexOf(item) === -1 && status) {
      array.push(item);
    }
    else if(!status) {
      let index = array.indexOf(item);
      array.splice(index, 1);
    }

    console.log(array);
  }

  /* Formats the date in YYYY-MM-DD format */
  formatDate(eventdate: MatDatepickerInputEvent<Date>) {
    console.log("date: " + eventdate.value);
    let newdateValue = moment(eventdate.value).format("YYYY-MM-DD");
    console.log("date: " + newdateValue);

    this.selectedDate = newdateValue;
  }

  /* On Submit Functionality */
  OnSubmit() {
    /* Sexual Activity FormBuilder */
    this.sexualActivityForm = this.formBuilder.group({
      contactid: [this.sexualpartnerID], 
      actid: [this.activities_performed],
      protid: [this.contraceptives_used],
      date: this.selectedDate,
      comment: this.comment
    });
    console.log("Activity Form: " + JSON.stringify(this.sexualActivityForm.value));

    /* Calling Add Sexual Activity Service */
    this._addSexualService.addactivity(this.sexualActivityForm.value).subscribe(
      data => console.log('Success!', data),
      error => console.error('Error!', error)
    );

    // Clearing session storage so next submission has a empty form
    for(var contact of this.contactlist) {
      this.storage.remove(contact.contactID);
    }

    // Redirecting to the Sexual History Page
    var url = window.location.origin + "/sexualhistory";
    location.replace(url);    
  }

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private router: Router,
    private formBuilder: FormBuilder, private _addSexualService: AddSexualService, 
    private _contactService: ContactService) {

    this.sexualActivityForm = this.formBuilder.group({
      'date': this.date,
    });
  }

  /* Gets All Items from Session Storage */
  getFromSession() {
    // Get from Session Storage
    var values = Object.values(this.storage);
    var keys = Object.keys(values[0]);
    console.log("keys:"+ keys);

    this.sexualpartners = keys.map(key => this.storage.get(key));
    this.sexualpartnerID = keys;
    console.log("partners below: ");
    console.log(this.sexualpartners);
  }

  ngOnInit() {
    this.getFromSession(); // Retrieve partners from session storage
    this.selectedDate = moment(Date.now()).format("YYYY-MM-DD");  // Format date to YY-MM-DD

    // Calling Contact Service to get all Contacts
    this._contactService.getContactList()
      .subscribe((res: any[]) => {
          console.log(res);
          this.contactlist = this._contactService.filterBy(res);
      });
  }

}
