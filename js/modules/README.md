# How to distribute a module.
This article use `<>` to mark where some text should be replaced with a suitable text.

## Create a masters file for the module
Create a new `./js/masters/<module_name>.js`
The master file should contain a minimum of 3 things. A license header, the 'use strict' statement, and `import` statements to include the parts which the module is made up of.
### License header
```javascript
/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2010-2017 Highsoft AS
 * Author: <author_name>
 *
 * License: www.highcharts.com/license
 */
```
### Use strict
Simple enough, add the following line right after the license header.
```javascript
'use strict';
```
### Import Statements
Add import statements to include the bits of source code which the module is made up of.
Usually a module only consist of a single parts file. The path used in the import statement is the relative path from the masters file to the part file.
```javascript
import '../../modules/<module_name>.src.js';
```
## Configure the build script
To tell the Highcharts build script how we would like the resulting distributed module to look like, we will have to add some some option. Open the file `./gulpfile.js` in a text editor and locate the function `scripts`. The `scripts` function is executes the `build` function with a set of option. One of these options is `fileOptions`, it includes a list of options which is specific to only one master file. Add a new section for your new module:
```javascript
'modules/<module_name>.src.js': {
    exclude: new RegExp(folders.parts),
    umd: false
}
```
The section above is a typical use case for distributing a module.
`exclude: new RegExp(folders.parts)` option tells the build script to not include any source code from the `parts` folder.
`umd: false` tells the build script that this distribution file is not intended to be a standalone file, and that Highcharts will be loaded in advance.
Learn more about the different options for the build script by reading the <a href="../../assembler/README.md">Highcharts build script documentation</a>.

## Run the build script to create the distribution file
Open up a CLI in the top folder of this repository, usually the folder is named `highcharts`. To execute our build script, run the following command:
```
gulp scripts
```
This will build all the distribution files. To build a single file use the `--file` option and save some time.
```
gulp scripts --file <path_to_master_file>
```

## Add to rewrite to .htaccess
Usually when running tests locally, the compiled version of the distribution file does not exist or is not up to date. Therefore we need to add a redirect `.js` to `.src.js`. Open and the `./code/.htaccess` in a text editor and add the following line to the file:
```
RewriteRule (.*?)<module_name>.js $1<module_name>.src.js
```