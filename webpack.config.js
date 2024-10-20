module.exports = {
    entry: {
        "createMd5": "./src/createMd5.ts",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        library: {
            name: "onmessage",
            type: "self",
            "export": "default",
        },
    },
    devtool: "eval",
};
