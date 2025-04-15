// .eslintrc.js
module.exports = {
    // ...
    settings: {
        "import/resolver": {
            typescript: {
                // Optional if tsconfig is in root
                project: "./tsconfig.json",
            },
        },
    },
};
