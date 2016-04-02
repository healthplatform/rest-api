/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IPatientHistory extends waterline.Record, waterline.Model, IPatientHistoryBase {
}

export interface IPatientHistoryBase {
    medicare_no: string;
    hypertension?: boolean;
    asthma?: boolean;
    diabetes?: boolean;
    diabetesType?: string;
    diabeticSince?: Date;
    diabetesControl?: string;
    hbA1c?: number;
    allergies?: Array<string>;
    currentMedication?: Array<string>;
    eyedropIntolerance?: string;
    familySocialHistory?: string;
    ethnicity?: string;
}
