'use strict';

import Yui from "./yui.js";

if (!globalThis.Yui) {
    globalThis.Yui = Yui;
}

export default {
    Yui: Yui
}
