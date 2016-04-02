///<reference path="helpers.ts"/>

import * as async from 'async';
import {RequestOptions, IncomingMessage, ClientRequest, request as http_request} from 'http';
import * as url from 'url';
import {PatientMocks} from '../test/api/patient/patient_mocks';
import {HistoricMocks} from '../test/api/historic/historic_mocks';
import {IPatientHistoryBase} from '../api/historic/models.d';
import {VisitMocks} from '../test/api/visit/visit_mocks';
import {IVisitBase, IVisit} from '../api/visit/models.d';
import {trivial_merge} from './helpers';

interface callback {
    (res: IncomingMessageF): void;
}

interface cb {
    (err: IncomingMessageF, res?: IncomingMessageF): void;
}

export interface IncomingMessageF extends IncomingMessage {
    func_name: string;
}

function httpF(method: 'POST'|'PUT'|'PATCH'|'HEAD'|'GET'|'DELETE') {
    return (options: RequestOptions,
            func_name: string,
            body_or_cb: string|callback|cb|AsyncResultCallback<{}>,
            cb?: callback|cb|AsyncResultCallback<{}>): ClientRequest => {
        if (!cb) {
            cb = <callback|cb|AsyncResultCallback<{}>>body_or_cb;
            body_or_cb = null;
        }

        options['method'] = method;

        if (body_or_cb)
            if (!options)
                options = {'headers': {'Content-Length': Buffer.byteLength(<string>body_or_cb)}};
            else if (!options.headers)
                options.headers = {'Content-Length': Buffer.byteLength(<string>body_or_cb)};
            else if (!options.headers['Content-Length'])
                options.headers['Content-Length'] = Buffer.byteLength(<string>body_or_cb);

        const req = http_request(options, (res: IncomingMessageF) => {
            res.func_name = func_name;
            if (!res) return (<cb>cb)(res);
            else if ((res.statusCode / 100 | 0) > 3) return (<cb>cb)(res);
            return (<cb>cb)(null, res);
        });
        //body_or_cb ? req.end(<string>body_or_cb, cb) : req.end();
        body_or_cb && req.write(body_or_cb);
        req.end();

        return req;
    }
}

const httpHEAD = httpF('HEAD'),
    httpGET = httpF('GET'),
    httpPOST = httpF('POST'),
    httpPUT = httpF('PUT'),
    httpPATCH = httpF('PATCH'),
    httpDELETE = httpF('DELETE');

export class SampleData {
    public patientMocks = new PatientMocks();
    public historicMocks: IPatientHistoryBase[] = HistoricMocks;
    public visitMocks: IVisitBase[] = VisitMocks;
    private uri: url.Url;

    constructor(uri: string/*only: Array<string>, uri: string,
     callback: (error: IncomingMessageF|Error,
     results: [IncomingMessageF]) => void*/) {
        this.uri = url.parse(uri);

        /*
         async.map(only, (fname: string, cb) =>
         this[fname]((err, res) => {
         console.log('err =', err, '\nres =', res);
         return cb(err, res);
         }), (error, results: [IncomingMessageF]) => {
         console.log('error =', error, '\nresults =', results);
         error ? console.error(error.statusCode, error.statusMessage) :
         results.map((result: IncomingMessageF) =>
         console.info('result =', result) && console.info(result.statusCode, result.statusMessage));
         return callback(error, results)
         }
         );
         */
    }

    private mergeOptions(options, body?) {
        return trivial_merge({
            host: this.uri.host === `[::]:${this.uri.port}` ? 'localhost' :
                `${this.uri.host.substr(this.uri.host.lastIndexOf(this.uri.port) + this.uri.port.length)}`,
            port: parseInt(this.uri.port),
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body ? Buffer.byteLength(body) : 0
            }
        }, options)
    }

    deletePatientsHttp(cb) {
        const body = JSON.stringify({patients: this.patientMocks.patients});
        return httpDELETE(this.mergeOptions({path: '/api/patients'}), 'deletePatientsHttp', body, cb);
    }

    loadPatientsHttp(cb) {
        const body = JSON.stringify({patients: this.patientMocks.patients});
        return httpPOST(this.mergeOptions({path: '/api/patients'}), 'loadPatientsHttp', body, cb);
    }

    deleteHistoricHttp(cb) {
        return async.map(
            this.historicMocks,
            (historic, callback) => httpDELETE(
                this.mergeOptions({path: `/api/patient/${historic.medicare_no}/historic`}), 'deleteHistoricHttp', callback
            ), cb
        );
    }

    loadHistoricHttp(cb) {
        return async.map(
            this.historicMocks,
            (historic, callback) => httpPOST(
                this.mergeOptions({path: `/api/patient/${historic.medicare_no}/historic`}),
                'loadHistoricHttp', JSON.stringify(historic), callback
            ), cb
        );
    }

    /* // Can't work, don't know Visit createdDates. Can't findOne, because could be identical visits otherwise.
     deleteVisitsHttp(cb) {
     return async.map(
     this.visitMocks,
     (visit: IVisit, callback) => console.log('visit =', visit) && callback()*/
    /*httpDELETE(
     this.mergeOptions({path: `/api/patient/${visit.medicare_no}/visit/${visit.createdAt}`}),
     JSON.stringify(visit), callback
     )*/
    /*, (err, res) => console.info('deleteVisitsHttp();') && cb(err, res)
     );
     }
     */

    loadVisitsHttp(cb) {
        return async.map(
            this.visitMocks,
            (visit: IVisit, callback) => httpPOST(
                this.mergeOptions({path: `/api/patient/${visit.medicare_no}/visit`}),
                'loadVisitsHttp', JSON.stringify(visit), callback
            ), cb
        );
    }
}
