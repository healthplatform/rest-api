/// <reference path='./../typings/multiparty/multiparty.d.ts' />
/// <reference path='./../typings/express/express.d.ts' />

//import * as multiparty from 'multiparty';
//import * as express from 'express';

declare var connectMultiparty: connectMultiparty.connectMultiparty;

declare module connectMultiparty {
    export interface connectMultiparty {
        (options?: {}): (req: any, res: any, next: any) => void;
    }
}

declare module "connect-multiparty" {
    export = connectMultiparty;
}
