/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IPatientRecord extends waterline.Record, waterline.Model, IPatientRecordBase {
}

export interface IPatientRecordBase {
    medicare_no: string;
    name: string;
    suburb: string;
    callback: Date;
}
