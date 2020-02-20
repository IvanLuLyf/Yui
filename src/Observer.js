'use strict';

import Dep from "./Dep.js";

export default class Observer {
    constructor(data) {
        this.data = data;
        this._observe(data);
    }

    _proxy(key, val) {
        let dep = new Dep();
        let child = observe(val);
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: false,
            get() {
                if (Dep.global) {
                    dep.addSub(Dep.global);
                }
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                child = observe(newVal);
                dep.notify();
            }
        })
    }

    _observe(data) {
        Object.keys(data).forEach(k => {
            this._proxy(k, data[k]);
        });
    }
}

export function observe(val, yui) {
    if (!val || typeof val !== 'object') {
        return;
    }
    return new Observer(val);
}
