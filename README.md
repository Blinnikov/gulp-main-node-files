# gulp-main-node-files
Allows to get main js files from installed ```/node_modules```.
``` javascript
var files = gulpMainNodeFiles([options]);
```

## Installation

```
npm i --save-dev gulp-main-node-files
```

## Usage
- Connect in ```gulpfile.js```

```javascript
var mainNodeFiles = require('gulp-main-node-files');
```
  and than
``` javascript
var mainNodeJsFiles = mainNodeFiles();
var src = gulp.src(mainNodeJsFiles, { base: '.' });
```

- For example, copying js-files from ```/node_modules``` folder to ```/build```.
``` javascript
gulp.src(mainNodeFiles(), { base: '.' })
    .pipe(gulp.dest('./build'));
```

## Options
You can pass in the ```options``` object to customize function behavior with the following keys:

- **packageJsonPath** (default - ``` './package.json' ``` ) - a path to your ```package.json``` file.

- **nodeModulesPath** (default - ```'./node_modules'```) - a path to ```node_modules``` folder.

- **overrides** (no default value) - this is an object that allows override ```main:``` section from ```package.json``` file.
  - For example, if package points out to the wrong or not the whole-source file:
    ``` javascript
    mainNodeFiles({
      overrides: {
        'packery': 'dist/packery.pkgd.js'
      }
    })
    ```
  - or if you want to return several main files:
  ``` javascript
  mainNodeFiles({
    overrides: {
      'codemirror': [
        'lib/codemirror.js',
        'mode/clike/clike.js',
        'addon/edit/closebrackets.js',
      ]
    }
  })
  ```
- **order** (no default value) - the object that allows to specify returned main files order.
  For example, if you further inject returned files into ```html``` and want to connect jquery before any other libraries.
  ``` javascript
  mainNodeFiles({
    order: {
      'jquery': 1,
      'angular': 2
    }
  })
  ```
