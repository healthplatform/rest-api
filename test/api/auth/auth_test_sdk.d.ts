import {IUserBase, IUser} from '../../../api/user/models.d';

export interface ITestSDK {
    register(user: IUserBase | IUser, cb: cb): void;
    login(user: IUserBase | IUser, cb: cb): void;
    get_user(access_token: string, user: IUser | IUserBase, cb: cb);
    logout(access_token: string, cb: cb): void;
    unregister(ident: { access_token?: string, user_id?: string }, cb: cb): void;
}

export interface cb {
    (err: Error, res?: any): void;
}
