import { Disease } from '../models/disease.model';
export class alertPartnersModel {
    diagnosis: string; //which disease
    contacts: any[]; //who to send to
    message: string; //y/n
    anonymity: string; //y/n
    date: string;
  }