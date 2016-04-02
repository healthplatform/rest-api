import * as supertest from 'supertest';
import {expect} from 'chai';
import {cb as auth_test_sdk_cb} from './../auth/auth_test_sdk.d';
import {IPatient} from '../../../api/patient/models.d';

export function test_sdk(app) {
    return {
        register: function register(patient: IPatient, cb: auth_test_sdk_cb) {
            if (!patient) return cb(new TypeError('patient argument to register must be defined'));
            supertest(app)
                .post('/api/patient')
                .send(patient)
                .end((err, res) => {
                    if (err) return cb(err);
                    else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                    expect(Object.keys(res.body).sort()).to.deep.equal([
                        'contact', 'createdAt', 'dob', 'gp', 'medicare_no', 'sex', 'updatedAt'
                    ]);
                    return cb(err, res);
                })
        },
        deregister: function deregister(patient: IPatient, cb: auth_test_sdk_cb) {
            if (!patient) return cb(new TypeError('patient argument to deregister must be defined'));
            supertest(app)
                .del(`/api/patient/${patient.medicare_no}`)
                .send(patient)
                .end((err, res) => {
                    if (err) return cb(err);
                    expect(res.statusCode).to.equal(204);
                    return cb(err, res);
                })
        },
        registerMany: function registerMany(patients: {patients: IPatient[]}, cb: auth_test_sdk_cb) {
            if (!patients) return cb(new TypeError('patients argument to registerManyFaux must be defined'));
            supertest(app)
                .post('/api/patients')
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
        },
        deregisterMany: function deregisterMany(patients: {patients: IPatient[]}, cb: auth_test_sdk_cb) {
            if (!patients) return cb(new TypeError('patients argument to deregisterManyFaux must be defined'));
            supertest(app)
                .del(`/api/patients`)
                .send(patients)
                .end((err, res) => {
                    if (err) return cb(err);
                    else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                    expect(res.statusCode).to.equal(204);
                    return cb(err, res);
                })
        }
    }
}
