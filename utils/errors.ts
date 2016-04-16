/// <reference path='./../cust_typings/waterline.d.ts' />
/// <reference path='./errors.d.ts' />

import {RestError} from 'restify';
import {inherits} from 'util';


export function fmtError(error: waterline.WLError | Error | any, statusCode = 400) {
    if (!error) return null;
    else if (error.originalError) {
        if (!process.env['NO_DEBUG'])
            console.error(error);
        error = error.originalError;
    }

    if (error instanceof RestError) return error;
    else if (error.invalidAttributes)
        return new WaterlineError(error, statusCode);
    else
        throw TypeError('Unhandled input to fmtError:' + error)
}

export const to_end = res => {
    return {
        NotFound: (entity = 'Entity') => res.json(404, {
            error: 'NotFound', error_message: `${entity} not found`
        })
    }
};

export function NotFoundError(entity = 'Entity') {
    this.name = 'NotFoundError';
    const msg = `${entity} not found`;
    RestError.call(this, <errors.CustomError>{
            restCode: this.name,
            statusCode: 404,
            message: msg,
            constructorOpt: NotFoundError,
            body: {
                error: this.name,
                error_message: msg
            }
        }
    );
}
inherits(NotFoundError, RestError);

export function WaterlineError(wl_error: waterline.WLError, statusCode = 400) {
    this.name = 'WaterlineError';
    RestError.call(this, <errors.CustomError>{
            message: wl_error.reason,
            statusCode: statusCode,
            constructorOpt: WaterlineError,
            restCode: this.name,
            body: {
                error: wl_error.code,
                error_message: wl_error.reason,
                error_metadata: {
                    details: wl_error.details.split('\n'),
                    invalidAttributes: wl_error.invalidAttributes
                }
            }
        }
    );
}
inherits(WaterlineError, RestError);
