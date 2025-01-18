import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppStorageService {

    private _storage: Storage | null = null;
    private tempUnitSubject = new BehaviorSubject<string>('celsius');
    tempUnit$ = this.tempUnitSubject.asObservable();

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        const storage = await this.storage.create();
        this._storage = storage;

        const unit = await this.get('TEMP_UNIT');
        if (unit) {
            this.tempUnitSubject.next(unit);
        }
    }

    async get(key: string) {
        return this._storage?.get(key)
    }

    async set(key: string, value: any) {
        this._storage?.set(key, value);

        if (key === 'TEMP_UNIT') {
            this.tempUnitSubject.next(value);
        }
    }
}