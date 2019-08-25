import { Component, OnInit } from '@angular/core';
import { alertPartnersModel } from '../models/alert-partners.model';
import { FormBuilder, FormGroup, Validators , FormArray, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Person } from '../models/person';
import { PERSONS } from '../models/person_mock';
import { ContactService } from '../services/contact.service';

import { DiseaseService} from '../services/disease.service';
import { Disease } from '../models/disease.model';
import { DISEASES } from '../models/disease_mock';
import { AlertService } from '../services/alert.service';

//Should I put combine both forms into one? is data binded for submission?
@Component({
  selector: 'app-alert-partners',
  templateUrl: './alert-partners.component.html',
    styleUrls: ['./alert-partners.component.css'],
    providers: [DatePipe]
})
export class AlertPartnersComponent implements OnInit {
  alert: alertPartnersModel = new alertPartnersModel();
  alertPartnersForm1: FormGroup;
  alertPartnersForm2: FormGroup;
  hide = true;
  isSendMessage = true;
  isEditable = true;
  incomplete = "incomplete";

  constructor(private formBuilder: FormBuilder, private _contactService: ContactService,
      private _diseaseService: DiseaseService, private datePipe: DatePipe, private _alertService: AlertService) {
      this.alertPartnersForm1 = this.formBuilder.group({
      });
      this.alertPartnersForm2 = this.formBuilder.group({
      });
      
     }
  
  v = null;
  diseases = [];
  selectedDisease: Disease;
  persons = [];
  selectedPerson: Person;

  ngOnInit() {
    
    this.persons = this._contactService.filterBy();
    this.diseases = this._diseaseService.filterBy();
    this.alertPartnersForm1 = this.formBuilder.group({
      'diagnosis': [this.alert.diagnosis, [
        Validators.required
        ]],
        'message': [this.alert.message = String(this.isSendMessage), [
            //Validators.required
        ]],
        'date': [this.alert.date, [
        ]],
    });

    this.alertPartnersForm2 = this.formBuilder.group({
      'contacts': [this.alert.contacts, [
        //Validators.requiredTrue
      ]],
      'anonymity': [this.alert.anonymity, [
        //Validators.required
      ]]
    })
  }
    onSubmit() {
    /*
    alert('You may have been infected with ' + this.alert.diagnosis  + ', please get tested as soon as possible' + ' '
  + this.alert.anonymity + ' ' +  this.alert.contacts);*/
        console.log("data!: " + this.alert.diagnosis);
        //console.log(this.alert.date);
        this._alertService.alertpartners(this.alert).subscribe(
            data => console.log('Success!', data),
            error => console.error('Error!', error)
        );
    } //

  onSelect(person: Person): void {
    this.selectedPerson = person;
  }

  getTrace(){
    try {
      for (let dis of this.diseases){
        console.log(this.alert.diagnosis === dis.name);
        if (this.alert.diagnosis === dis.name){
          this.v = dis.trace;        
        }
      }
    } catch {
      this.v = null;
    }
    
    return this.v;
  }

  onChange(event) {   
    this.alertPartnersForm1.get(event.target.attributes.formcontrolname.value)
    .setValue(event.target.checked);
    this.alertPartnersForm2.get(event.target.attributes.formcontrolname.value)
          .setValue(event.target.checked);
    }

    sendMessage() {
        this.alertPartnersForm1.patchValue({ 'message': String(this.isSendMessage) })
    }

    formatDate() {
        //not working
        this.alert.date = this.datePipe.transform(this.alert.date, 'MM-dd-yyyy');
        console.log(this.alert.date);
    }

checkPartTwo(){
  console.log("checking")
  console.log(this.alert.contacts);
  if (!(this.alert.contacts === null || this.alert.anonymity === null)){
    this.incomplete = "Incomplete form";
  } else {
    this.incomplete = "";
  }
}

resetForm(){
  this.v = null;
}




}
