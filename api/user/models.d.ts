/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IUser extends waterline.Record, waterline.Model, IUserBase {
}

export interface IUserBase {
    email: string;
    password?: string;
    title?: string;
}
