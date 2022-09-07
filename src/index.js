'use strict';

import Yui from "./Yui.js";

if (!globalThis.Yui) {
    globalThis.Yui = Yui;
}

export {Yui}
