"use strict";

import * as webpack from "webpack";

module.exports = {
    module: {
        rules: [],
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
    ]
};
