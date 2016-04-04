import * as restify from 'restify';
import {collections} from '../../main';
import {IVisit} from './models.d';
import {fmtError} from '../../utils/helpers';

export interface IVisitFetchRequest extends restify.Request {
    visit: IVisit;
}

export interface IVisitsFetchRequest extends restify.Request {
    visits: Array<IVisit>;
}


export function fetchVisit(req: IVisitFetchRequest, res: restify.Response, next: restify.Next) {
    const Visit: waterline.Query = collections['visit_tbl'];

    Visit.findOne({createdAt: req.params.createdAt}).exec(
        (error, visit: IVisit) => {
            if (error) {
                const e: errors.CustomError = fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            req.visit = visit;
            return next();
        });
}

export function fetchVisits(req: IVisitsFetchRequest, res: restify.Response, next: restify.Next) {
    const Visit: waterline.Query = collections['visit_tbl'];

    Visit.find({medicare_no: req.params.medicare_no}).exec(
        (error, visits: IVisit[]) => {
            if (error) {
                const e: errors.CustomError = fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            req.visits = visits;
            return next();
        });
}
