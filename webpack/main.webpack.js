module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: './app/electron/main.ts',
    module: {
        rules: require('./rules.webpack'),
    }
}