/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IContact extends waterline.Record, waterline.Model, IContactBase {
}

export interface IContactBase {
    /** First name */
    first_name?: string;
    /** Last name */
    last_name?: string;
    street?: string;
    suburb?: string;
    state?: string;
    country?: string;
    contact0?: string;
    contact1?: string;
    description: string;
}
