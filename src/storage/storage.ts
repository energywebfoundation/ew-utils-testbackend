import { ENTITY } from '../enums/Entity';
import { IAdapter } from './adapter';
import { STATUS_CODES } from '../enums/StatusCodes';

export class CustomStorage {
    _dataTypes: ENTITY[];
    _adapter: IAdapter = null;

    constructor(dataTypes: ENTITY[], adapter: IAdapter) {
        if (!adapter) {
            throw new Error('You need to initialize Storage with adapter');
        }

        this._adapter = adapter;
        this._dataTypes = dataTypes;
    }

    async initialize() {
        await this._adapter.initialize();

        this._dataTypes.forEach(type => {
            if (!this._adapter.get(type)) {
                this._adapter.set(type, []);
            }
        });
    }

    get(type: ENTITY, key: string) {
        if (arguments.length > 2) {
            throw new Error('Storage::get()::Too many arguments passed');
        }

        const entity = this._adapter.get(type)[key];

        return entity !== STATUS_CODES.GONE ? entity : STATUS_CODES.GONE;
    }

    set(type: ENTITY, key: string, value: any) {
        if (arguments.length < 3) {
            throw new Error('Storage::set()::Not enough arguments passed');
        }

        const existingData = this._adapter.get(type);

        return this._adapter.set(
            type,
            Object.assign({}, existingData, {
                [key]: value
            })
        );
    }

    del(type: ENTITY, key: string) {
        if (arguments.length > 2) {
            throw new Error('Storage::del()::Too many arguments passed');
        }

        return this._adapter.del(type)[key];
    }
}
