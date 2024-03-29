import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisHistoryService {

  private _url = '/diagnosishistory';  // URL to web api
  private url_diagnosis = '/diagnosis';  // URL to web api

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private http: HttpClient,
    private router: Router) { 

    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          if (this.keepAfterNavigationChange) {
              // only keep for a single location change
              this.keepAfterNavigationChange = false;
          } else {
              // clear alert
              this.subject.next();
          }
      }
    });
  }

  /* Action URL Post for Getting Diagnosis History */
  getDiagnosis() {
    console.dir("calling POST service");
    //return this.http.post<any>(this.url_diagnosis,"BODY 2ND PARAM");
    return this.http.post<any>(this.url_diagnosis,"BODY 2ND PARAM");
  }

  /* Action URL Post for Deleting Diagnosis History */
  deleteDiagnosis(item: any) {
    console.dir("calling DELETING POST service");
    return this.http.post<any>(this._url, item);
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
