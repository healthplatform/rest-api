import * as restify from 'restify';
import {collections} from '../../main';
import {IVisit} from './models.d';
import {fmtError, NotFoundError} from '../../utils/errors';

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
            if (error) return next(fmtError(error));
            else if(!visit) return next(new NotFoundError('visit'));
            req.visit = visit;
            return next();
        });
}

export function fetchVisits(req: IVisitsFetchRequest, res: restify.Response, next: restify.Next) {
    const Visit: waterline.Query = collections['visit_tbl'];

    Visit.find({medicare_no: req.params.medicare_no}).exec(
        (error, visits: IVisit[]) => {
            if (error) return next(fmtError(error));
            req.visits = visits;
            return next();
        });
}
