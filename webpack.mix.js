const mix = require('laravel-mix');

mix.setPublicPath('dist').js('resources/js/app.js', 'dist/js').react();
