/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IPrognosis extends waterline.Record, waterline.Model, IPrognosisBase {
}

export interface IPrognosisBase {
    medicare_no: string;
    visit_created_at: Date;
    prognosis: string;
    intervention: string;
}
