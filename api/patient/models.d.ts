/// <reference path='./../../cust_typings/waterline.d.ts' />

import {IContactBase} from '../contact/models.d';

export interface IPatient extends waterline.Record, waterline.Model, IPatientBase {
}

export interface IPatientBase {
    medicare_no: string;
    sex?: string;
    dob?: string;
    contact?: IContactBase;
    gp?: IContactBase;
    other_specialists?: IContactBase[];
}
