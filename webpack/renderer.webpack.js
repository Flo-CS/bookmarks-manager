module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        /** To fix this issue: https://github.com/react-dnd/react-dnd/issues/3423 */
        fallback: {
            'react/jsx-runtime': 'react/jsx-runtime.js',
            'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
        },
    },
    module: {
        rules: require('./rules.webpack'),
    },
}