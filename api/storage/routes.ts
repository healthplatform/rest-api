import * as restify from 'restify';
import {NotFoundError, fmtError} from './../../utils/errors';
import {has_body} from './../../utils/validators';
import {collections} from './../../main';
import {IStorage, IStorageBase} from './models.d.ts';
import {has_auth} from '../auth/middleware';
import {readFile} from 'fs';
import {IStorageFetchRequest, fetchStorage} from './middleware';


export function create(app: restify.Server, namespace: string = ""): void {
    app.post(`${namespace}/:uploader`, has_body, has_auth(),
        function (req: any, res: restify.Response, next: restify.Next) {
            const Storage: waterline.Query = collections['storage_tbl'];

            Storage.create(<IStorageBase>{
                uploader: req.params.uploader,
                size: req.files.file.size,
                local_location: req.files.file.path,
                name: `${req.params.uploader}/${req.files.file.name}`,
                mime_type: req.files.file.type,
                remote_location: `${namespace}/${req.params.uploader}/${req.files.file.name}`
            }).exec((error, storage: IStorage) => {
                next.ifError(fmtError(error));
                res.json(201, storage);
                return next();
            });
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:uploader/:filename`, has_auth(), fetchStorage,
        function (req: IStorageFetchRequest, res: restify.Response, next: restify.Next) {
            readFile(req.storage.local_location, null, (error, fileContents) => {
                next.ifError(fmtError(error));
                if (!fileContents)
                    return next(new NotFoundError('fileContents'));
                res.contentType = req.storage.mime_type.slice(req.storage.mime_type.lastIndexOf('/') + 1);
                res.contentLength = req.storage.size;
                res.send(fileContents);
                return next();
            });
        }
    );
}

export function getMeta(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:uploader/:filename/meta`, has_auth(), fetchStorage,
        function (req: IStorageFetchRequest, res: restify.Response, next: restify.Next) {
            res.json(req.storage);
            return next();
        }
    );
}
