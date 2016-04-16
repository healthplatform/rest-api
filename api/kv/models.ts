// Should really use the Postgres KV feature
// ... also I do have Redis...
import {IKV} from './models.d';

export const KV = {
    identity: 'kv_tbl',
    connection: 'postgres',
    attributes: {
        key: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        value: {
            type: 'string',
            required: true
        },
        toJSON: function toJSON() {
            let kv: IKV = this.toObject();
            for (const key in kv)
                if (kv.hasOwnProperty(key) && !kv[key]) delete kv[key];
            return kv;
        }
    }
};
