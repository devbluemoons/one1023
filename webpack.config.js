const path = require("path");

module.exports = {
    entry: "/public/js/index.js",
    resolve: {
        extensions: [".js"],
    },
    output: {
        filename: "index.js",
        path: path.join(__dirname, "dist"),
    },
};
