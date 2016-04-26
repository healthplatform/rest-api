import {PatientMocks} from './../patient/patient_mocks';
import {IPrognosisBase} from '../../../api/prognosis/models.d';
import {VisitMocks} from '../visit/visit_mocks';

const patientMocks = new PatientMocks();
const visitMocks = VisitMocks.create;

export const PrognosisMocks: /*IPrognosisBase*/{}[] = [
    {
        medicare_no: patientMocks.patients[0].medicare_no,
        
    },
    {
        medicare_no: patientMocks.patients[1].medicare_no,
        
    },
    {
        medicare_no: patientMocks.patients[2].medicare_no,
        
    },
    {
        medicare_no: patientMocks.patients[3].medicare_no,
        
    },
    {
        medicare_no: patientMocks.patients[4].medicare_no,
        
    }
];
