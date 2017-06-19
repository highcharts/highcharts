## Overview

This folder contains the one-off scripts required to automagically add doclets to the highcharts code based on the live API.

## How to shot web
- Run npm install in this (`tmp/`) folder
- Run JSDoc in the root highcharts repository: `jsdoc js/modules js/parts js/parts-3d js/parts-map js/parts-more -c jsdoc.json`
- Then run `node generate_patch_script.js`: this creates `patch.json`
- Then run `node patch.js` to patch the source code

## The files

There's a set of cached mongo dumps in this folder:
    - `highcharts.cache.json`
    - `highmaps.cache.json`
    - `highstock.cache.json`

If you want to run with an updated API definition, you need to use the mongo 
dump tools on the API mongo server and replace the above files. 

Make sure they're well-formed, the dump tool sometimes won't export the documents 
in a single array..

## Testing the frontend

After patching the source code with the above steps, re-generate the JSDocs 
by running `jsdoc js/modules js/parts js/parts-3d js/parts-more js/parts-map tmp/supplemental.docs.js -c jsdoc.json`
in the highcharts repository root. This produces tree.json, which is used 
as the input for the documentation generator.

Once you have that file, go to [the api-gen github page](https://github.com/highcharts/api-docs) for further instructions.

Note that the API front-end is not done as of yet (07/04).

**Remember to copy `supplemental.docs.js` outputted by the patch generator script to somewhere where jsdoc can find it before running jsdoc!**
