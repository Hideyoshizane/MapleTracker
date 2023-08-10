const path = require('path');


module.exports = {
  mode: "development",
  resolve: {
    fallback: { 
                "async_hooks": false,
                "fs": false,
                "net": false,
                crypto: false,
                buffer: false,
                url: false,
                stream: false,
                assert: false,
                querystring: false,
                http: false,
                zlib: false
    },
    
  },
  entry: {
    navbar: './public/javascript/navbar.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};

//npx webpack --config webpack.config.js
