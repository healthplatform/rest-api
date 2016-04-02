/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IKV extends waterline.Record, waterline.Model {
    key: string;
    value: string;
}

export interface IKVBase {
    [key: string]: string;
}
