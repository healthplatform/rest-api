import * as restify from 'restify';
import {NotFoundError} from 'restify';
import {collections} from '../../main';
import {fmtError} from '../../utils/helpers';
import {IStorage} from './models.d';

export interface IStorageFetchRequest extends restify.Request {
    storage: IStorage;
}

export function fetchStorage(req: IStorageFetchRequest, res: restify.Response, next: restify.Next) {
    const Storage: waterline.Query = collections['storage_tbl'];

    if (req.params.filename === undefined) {
        return next(new NotFoundError('filename in url is undefined'));
    }

    Storage.findOne({
        uploader: req.params.uploader, // TODO: match with access-token user_id
        name: `${req.params.uploader}/${req.params.filename}`
    }).exec((error, storage: IStorage) => {
        if (error) {
            const e: errors.CustomError = fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        } else if (!storage) {
            return next(new NotFoundError('storage'));
        }

        req.storage = storage;
        return next();
    });
}
