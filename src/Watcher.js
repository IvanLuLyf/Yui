'use strict';

import Dep from "./Dep.js";

export default class Watcher {
    constructor(yui, key, fn) {
        Dep.global = this;
        this.key = key;
        this.yui = yui;
        this.fn = fn;
        this.update();
        Dep.global = null;
    }

    get value() {
        let arr = this.key.split('.');
        let val = this.yui;
        arr.forEach(key => {
            val = val[key]
        });
        return val;
    }

    update() {
        this.fn(this.value);
    }
}
