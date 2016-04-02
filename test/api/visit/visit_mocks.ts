import {IVisitBase} from './../../../api/visit/models.d';
import {PatientMocks} from './../patient/patient_mocks';

const patientMocks = new PatientMocks();

export const VisitMocks: IVisitBase[] = [
    {
        medicare_no: patientMocks.patients[0].medicare_no,
        iop_left_eye: 24, iop_right_eye: 27,
        acuity_left_eye_num: 6, acuity_left_eye_den: 12,
        acuity_right_eye_num: 6, acuity_right_eye_den: 6,
        /*additional_left_eye: ['base64', 'base64', 'url'],
         additional_right_eye: ['url', 'base64', 'url']*/
    },
    {
        medicare_no: patientMocks.patients[1].medicare_no,
        iop_left_eye: 23, iop_right_eye: 27,
        acuity_left_eye_num: 6, acuity_left_eye_den: 6,
        acuity_right_eye_num: 6, acuity_right_eye_den: 12,
        /*additional_left_eye: ['base64', 'base64', 'url'],
         additional_right_eye: ['url', 'base64', 'url']*/
    },
    {
        medicare_no: patientMocks.patients[2].medicare_no,
        iop_left_eye: 28, iop_right_eye: 23,
        acuity_left_eye_num: 6, acuity_left_eye_den: 6,
        acuity_right_eye_num: 6, acuity_right_eye_den: 12,
        /*additional_left_eye: ['base64', 'base64', 'url'],
         additional_right_eye: ['url', 'base64', 'url']*/
    },
    {
        medicare_no: patientMocks.patients[3].medicare_no,
        iop_left_eye: 23, iop_right_eye: 25,
        acuity_left_eye_num: 6, acuity_left_eye_den: 6,
        acuity_right_eye_num: 6, acuity_right_eye_den: 12,
        /*additional_left_eye: ['base64', 'base64', 'url'],
         additional_right_eye: ['url', 'base64', 'url']*/
    },
    {
        medicare_no: patientMocks.patients[4].medicare_no,
        iop_left_eye: 23, iop_right_eye: 26,
        acuity_left_eye_num: 6, acuity_left_eye_den: 6,
        acuity_right_eye_num: 6, acuity_right_eye_den: 12,
        /*additional_left_eye: ['base64', 'base64', 'url'],
        additional_right_eye: ['url', 'base64', 'url']*/
    }
];
