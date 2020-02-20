'use strict';

import Watcher from "./Watcher.js";
import Dep from "./Dep.js";

export default class Yui {
    constructor(options) {
        let data = options.data;
        this._observe(this, data);
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
        let reg = /\{\{(.*?)\}\}/g;
        let that = this;
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
                    new Watcher(that, keyName, v => {
                        if (inputType === 'radio' || inputType === 'checkbox') {
                            node.checked = that[keyName];
                        } else {
                            node.value = that[keyName];
                        }
                    });
                }
            }
        } else if (node.nodeType === 3) {
            let txt = node.nodeValue;
            if (reg.test(txt)) {
                let keyName = RegExp.$1;
                keyName = keyName.trim();
                new Watcher(that, keyName, v => {
                    node.nodeValue = txt.replace(reg, (matched, placeholder) => {
                        return placeholder.trim().split('.').reduce((val, key) => {
                            return val[key]
                        }, that) + '';
                    })
                });
            }
        }
    }

    _proxy(target, key, val) {
        let dep = new Dep();
        let that = this;
        Object.defineProperty(target, key, {
            get() {
                if (Dep.global) {
                    dep.addSub(Dep.global);
                }
                return val;
            },
            set(newVal) {
                if (typeof newVal === "object") {
                    that._observe(newVal, newVal);
                }
                if (val === newVal && typeof newVal !== "object") {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        })
    }

    _observe(target, data) {
        Object.keys(data).forEach(k => {
            this._proxy(target, k, data[k]);
            if (typeof data[k] === "object") {
                this._observe(data[k], data[k])
            }
        });
    }
}
