import * as supertest from 'supertest';
import {expect} from 'chai';
import {cb} from '../../share_interfaces.d';
import {IPatient} from '../../../api/patient/models.d';


export class PatientTestSDK {
    constructor(private app, private token: string) {
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(patient: IPatient, cb: cb) {
        if (!patient || Object.keys(patient).length < 1)
            return cb(new TypeError('patient argument to register must be defined'));
        supertest(this.app)
            .post('/api/patient')
            .set({'X-Access-Token': this.token})
            .send(patient)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body).sort()).to.deep.equal([
                    'contact', 'createdAt', 'dob', 'gp', 'medicare_no', 'sex', 'updatedAt'
                ]);
                return cb(err, res);
            })
    }

    deregister(patient: IPatient, cb: cb) {
        if (!patient || Object.keys(patient).length < 1)
            return cb(new TypeError('patient argument to deregister must be defined'));
        supertest(this.app)
            .del(`/api/patient/${patient.medicare_no}`)
            .set({'X-Access-Token': this.token})
            .send(patient)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res);
            })
    }

    registerMany(patients: {patients: IPatient[]}, cb: cb) {
        if (!patients || Object.keys(patients).length < 1 || patients.patients.length < 1)
            return cb(new TypeError('patients argument to registerMany must be defined'));
        supertest(this.app)
            .post('/api/patients')
            .set({'X-Access-Token': this.token})
            .send(patients)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('patients');
                expect(res.body.patients).to.be.an.instanceof(Array);
                expect(res.body.patients).to.have.length.above(0);
                res.body.patients.map((patient: IPatient) => expect(Object.keys(patient).sort()).to.deep.equal([
                    'contact', 'createdAt', 'dob', 'gp', 'medicare_no', 'sex', 'updatedAt'
                ]));
                return cb(err, res);
            })
    }

    deregisterMany(patients: {patients: IPatient[]}, cb: cb) {
        if (!patients || Object.keys(patients).length < 1 || patients.patients.length < 1)
            return cb(new TypeError('patients argument to deregisterMany must be defined'));
        supertest(this.app)
            .del(`/api/patients`)
            .set({'X-Access-Token': this.token})
            .send(patients)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res);
            })
    }
}
