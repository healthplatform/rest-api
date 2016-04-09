/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IStorage extends waterline.Record, waterline.Model, IStorageBase {
}

export interface IStorageBase {
    uploader: string;
    remote_location: string;
    local_location: string;
    size: number;
    mime_type: string;
    name: string;
}
