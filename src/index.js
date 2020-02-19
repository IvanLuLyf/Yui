'use strict';

import Yui from "./yui";

if (!global.Yui) {
    global.Yui = Yui;
}

export default {
    Yui: Yui
}
