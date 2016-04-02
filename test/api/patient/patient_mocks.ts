import {IContactBase} from '../../../api/contact/models.d';
import {IPatientBase} from '../../../api/patient/models.d';


export class PatientMocks {
    static contacts: IContactBase[] = [
        {
            first_name: 'Alec', last_name: 'Burg',
            street: '385 Foo St', suburb: 'Alice Springs',
            state: 'NT', country: 'Australia', description: 'patient',
            contact0: 'foo@bar.com', contact1: '+614082353244'
        },
        {
            first_name: 'Charlotte', last_name: 'Truss',
            street: '5 Bar St', suburb: 'Redfern',
            state: 'NSW', country: 'Australia', description: 'patient',
            contact0: 'bar@foo.com', contact1: '+61488235328'
        },
        {
            first_name: 'Gus', last_name: 'Wyndburg',
            street: '83A Car St', suburb: 'Merrylands',
            state: 'ACT', country: 'Australia', description: 'patient',
            contact0: 'barfoo@foo.com', contact1: '+61499235329'
        },
        {
            first_name: 'Harry', last_name: 'Faulk',
            street: '3/9 Jar St', suburb: 'Southbank',
            state: 'VIC', country: 'Australia', description: 'patient',
            contact0: 'foo@barfoo.com', contact1: '+61333235333'
        },
        {
            first_name: 'Gale', last_name: 'Vine',
            street: '3/9 Jar St', suburb: 'Newfoundland',
            state: 'WA', country: 'Australia', description: 'patient',
            contact0: 'bar@barfoo.com', contact1: '+61163265637'
        },
        {
            first_name: 'Henry', last_name: 'Gray',
            street: '5 Carter St', suburb: 'Sydney CBD',
            state: 'NSW', country: 'Australia', description: 'GP',
            contact0: 'FAX:+61463265634', contact1: '+61463535622'
        },
        {
            first_name: 'HV', last_name: 'Carter',
            street: '5 FRS St', suburb: 'Sydney CBD',
            state: 'NSW', country: 'Australia', description: 'geriatrician',
            contact0: 'FAX:+61463265634', contact1: '+61463535622'
        },
        {
            first_name: 'Sidney', last_name: 'Nikon',
            street: '5 Broach St', suburb: 'Sydney CBD',
            state: 'NSW', country: 'Australia', description: 'ophthalmologist',
            contact0: 'FAX:+61463265634', contact1: '+61463535622'
        }
    ];

    public patients: IPatientBase[] = [
        {
            medicare_no: '545554543534', sex: 'male',
            dob: '1998-03-20', contact: PatientMocks.contacts[0],
            gp: PatientMocks.contacts[5],
            other_specialists: [
                PatientMocks.contacts[6],
                PatientMocks.contacts[7]
            ]
        },
        {
            medicare_no: '3444434344332', sex: 'female',
            dob: '1980-02-28', contact: PatientMocks.contacts[1],
            gp: PatientMocks.contacts[5],
            other_specialists: [
                PatientMocks.contacts[6]
            ]
        },
        {
            medicare_no: '7474374344337', sex: 'male',
            dob: '1903-12-08', contact: PatientMocks.contacts[2],
            gp: PatientMocks.contacts[5]
        },
        {
            medicare_no: '6644334344536', sex: 'male',
            dob: '1959-08-15', contact: PatientMocks.contacts[3],
            gp: PatientMocks.contacts[5],
            other_specialists: []
        },
        {
            medicare_no: '144423424322', sex: 'male',
            dob: '1966-10-05', contact: PatientMocks.contacts[4],
            gp: PatientMocks.contacts[5],
            other_specialists: [
                PatientMocks.contacts[7]
            ]
        }
    ];
}
