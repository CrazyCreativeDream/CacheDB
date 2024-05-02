import CompressionPlugin from 'compression-webpack-plugin';
export default {
    entry: './index.js',
    output: {
        filename: 'index.min.js'
    },
    plugins: [new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
    })],
    mode: 'production'
}