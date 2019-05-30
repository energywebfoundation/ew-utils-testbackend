import { Adapter } from './adapter';
import { StatusCodes } from '../enums';

export class MemoryAdapter extends Adapter {
    _storage = {};

    get(key) {
        return this._storage[key];
    }

    async set(key, value) {
        this._storage[key] = value;
    }

    async del(key) {
        this._storage[key] = StatusCodes.GONE;
    }
}
