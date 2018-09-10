const path = require('path')

module.exports = {
  sections: [
    {
      name: 'Introduction',
      content: 'docs/Introduction.md'
    },
    {
      name: 'Styles',
      content: 'docs/Styles/Introduction.md',
      sections: [
        {
          name: 'Writing SCSS / CSS',
          content: 'docs/Styles/Guidelines.md'
        },
        {
          name: 'Local Scope / Component Styles',
          content: 'docs/Styles/LocalScope.md'
        }
      ]
    },
    {
      name: 'Components',
      content: 'docs/Components/Introduction.md',
      sections: [
        {
          name: 'Developing Components',
          content: 'docs/Components/Development.md'
        },
        {
          name: 'Global Components',
          content: 'docs/Components/GlobalComponents.md',
          components: 'components/Global/**/[A-Z]*.vue'
        },
        {
          name: 'Specific Components',
          content: 'docs/Components/SpecificComponents.md',
          components: 'components/!(Global)**/[A-Z]*.vue'
        }
      ]
    }
  ],
  // Return path with import example for specific components
  getComponentPathLine (componentPath) {
    const name = path.basename(componentPath, '.vue')
    const dir = path.dirname(componentPath)
    if (dir.includes('Global')) {
      return componentPath
    }
    return `import ${name} from '~/${dir}/${name}.vue'`
  },
  assetsDir: 'static',
  title: 'HC Style Guide',
  serverHost: 'localhost',
  ignore: [
    '**/__tests__/**',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/_*.vue'
  ],
  webpackConfig: {
    module: {
      loaders: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
          options: {
            loaders: {
              'js': 'babel-loader?presets[]=vue-app&babelrc=false'
            }
          }
        },
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=vue-app&babelrc=false'
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
          options: {
            limit: 1000, // 1KO
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1000, // 1 KO
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        'assets': path.resolve(__dirname, 'assets/'),
        '~/components': path.resolve(__dirname, 'components/'),
        '~/docs': path.resolve(__dirname, 'docs/'),
        '~/helpers': path.resolve(__dirname, 'helpers/'),
        '~/plugins': path.resolve(__dirname, 'plugins/'),
        '~/locales': path.resolve(__dirname, 'locales/')
      }
    }
  }
}
