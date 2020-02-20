'use strict';

import Watcher from "./Watcher";
import Dep from "./Dep";

export default class Yui {
    constructor(options) {
        let data = options.data;
        this._observe(data);
        let elem = document.querySelector(options.el);
        elem.append(this._parseDom(elem));
    }

    _parseDom(node, parent) {
        let p = parent || document.createDocumentFragment();
        Array.from(node.childNodes).forEach(node => {
            this._compile(node);
            if (node.childNodes && node.childNodes.length) {
                this._parseDom(node, p)
            }
        });
        return p;
    }

    _compile(node) {
        let reg = /\{\{(.*)\}\}/g;
        let that = this;
        console.log('_compile', node);
        if (node.nodeType === 1) {
            let attr = node.attributes;
            for (let i = 0; i < attr.length; i++) {
                if (attr[i].nodeName === 'v-model') {
                    let keyName = attr[i].value;
                    let inputType = node.getAttribute('type');
                    if (inputType === 'radio' || inputType === 'checkbox') {
                        node.addEventListener('change', e => {
                            that[keyName] = e.target.checked;
                        });
                        node.checked = that[keyName];
                    } else {
                        node.addEventListener('input', e => {
                            that[keyName] = e.target.value;
                        });
                        node.value = that[keyName];
                    }
                    node.removeAttribute('v-model');
                    new Watcher(that, node, keyName);
                }
            }
        } else if (node.nodeType === 3) {
            if (reg.test(node.nodeValue)) {
                let keyName = RegExp.$1;
                keyName = keyName.trim();
                new Watcher(that, node, keyName);
            }
        }
    }

    _proxy(key, val) {
        let dep = new Dep();
        Object.defineProperty(this, key, {
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
