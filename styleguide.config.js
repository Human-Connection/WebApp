const path = require('path')

module.exports = {
  sections: [
    {
      name: 'Introduction',
      content: 'docs/Introduction.md'
    },
    {
      name: 'Global Components',
      content: 'docs/GlobalComponents.md',
      components: 'components/Global/**/[A-Z]*.vue'
    }
    // {
    // name: 'Specific Components',
    // content: 'docs/SpecificComponents.md',
    // components: 'components/!(Global)**/[A-Z]*.vue'
    // }
  ],
  assetsDir: 'static',
  require: [
    'assets/styles/styleguide.scss'
  ],
  template: 'styleguide/template/index.html',
  title: 'HC Style Guide',
  serverHost: 'localhost',
  webpackConfig: {
    module: {
      loaders: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
        },
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=es2015'
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.scss/,
          loader: 'style-loader!css-loader!sass-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          query: {
            limit: 1000, // 1KO
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          query: {
            limit: 1000, // 1 KO
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        'components': path.resolve(__dirname, 'components/'),
        'assets': path.resolve(__dirname, 'assets/')
      }
    }
  }
}
