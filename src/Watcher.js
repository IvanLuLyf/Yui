'use strict';

import Dep from "./Dep";

export default class Watcher {
    constructor(yui, node, key) {
        Dep.global = this;
        this.key = key;
        this.node = node;
        this.yui = yui;
        this.update();
        Dep.global = null;
    }

    get value() {
        return this.yui[this.key];
    }

    update() {
        switch (this.node.nodeType) {
            case 1:
                this.node.value = this.value;
                break;
            case 3:
                this.node.nodeValue = this.value;
                break;
        }
    }
}
