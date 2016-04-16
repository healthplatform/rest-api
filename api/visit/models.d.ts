/// <reference path='./../../cust_typings/waterline.d.ts' />

export interface IVisit extends waterline.Model, IVisitBase {
    createdAt: Date;
    updatedAt: Date;
}

export interface IVisitBase {
    id?: string;
    acuity_left_eye_num?: number;
    acuity_left_eye_den?: number;
    acuity_right_eye_num?: number;
    acuity_right_eye_den?: number;
    refraction_right_eye?: number;
    vf_right_eye?: string;
    iop_right_eye?: number;
    iop_left_eye?: number;
    reason?: string;
    gonio_right_eye?: number;
    retinal_disc_left_eye?: string;
    /*additional_left_eye?: string[];
     additional_right_eye?: string[];*/
    vf_left_eye?: string;
    refraction_left_eye?: number;
    retinal_disc_right_eye?: string;
    cct_left_eye?: number;
    callback?: Date;
    cct_right_eye?: number;
    gonio_left_eye?: number;
    medicare_no: string;
}
