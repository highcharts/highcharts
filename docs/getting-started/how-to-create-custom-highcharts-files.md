Creating custom Highcharts files
================================

By using the Highcharts assembler you can create your own custom Highcharts
package files. A benefit of using a custom file can be optimization of browser
load speed due to lower filesize and less files to request.

Follow the steps below to get started.



Install the Highcharts assembler
--------------------------------

### Download with NPM

This project is not published as a package in the NPM register, but NPM has
support for installing packages by cloning them from GitHub which is something
we can utilize.

The command we will use is
`npm install <githubname>/<githubrepo>[#<commit-ish>]`.

The command has support for providing a `#<commit-ish>` which can be a tag or
reference to a specific commit. Using the `#<commit-ish>` is useful to ensure
that everyone working on your project is using the same version of the
assembler. This is the recommended approach. The following example installs a
version of the assembler tagged as `v1.0.10`:

```shell
npm install --save-dev highcharts/highcharts-assembler#v1.0.10
```

If versioning is not a concern, then it is possible to install the latest commit
from master branch by omitting the `#<commit-ish>`:

```shell
npm install --save-dev highcharts/highcharts-assembler
```

[Read more about `npm install` on npmjs.com](https://docs.npmjs.com/cli/install).

After installing the package by using NPM it can be loaded as a regular package
in NodeJS.
```js
const build = require('highcharts-assembler');
```

### Download ZIP archive from GitHub

Go to the
[`highcharts/highcharts-assembler`](https://github.com/highcharts/highcharts-assembler)
repository and click on “Clone or download” and select “Download ZIP”. Once the
zip file is downloaded unpack it to a desired location.

Open the extracted folder in a CLI and run `npm install` to install any required
dependencies.

After downloading and extracting the archive, it can be loaded in NodeJS by
referring to its location. The example below has installed the assembler in a
subfolder named `highcharts-assembler`:

```js
const build = require('./highcharts-assembler/index.js');
```



Download the Highcharts parts files
-----------------------------------

Go to the [highcharts/highcharts](https://github.com/highcharts/highcharts)
repository and click on “Clone or download” and select “Download ZIP”. Once the
zip file is downloaded unpack it to a desired location. In this case we are only
interested in the folders `js` and `css` where the source code is located, the
rest can be deleted if wanted.



Create a custom master file
---------------------------

Start by creating a new file `./highcharts/js/masters/custom.src.js`. In this
example we want a basic line chart with some interactivity. To achieve this we
will need a setup that looks something like this:

```js
'use strict';
import Highcharts from '../parts/Globals.js';
import '../parts/SVGRenderer.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Interaction.js';
export default Highcharts;
```

Modify the setup according to your needs, then proceed with the next step.
Please note that the order of the imports has to match the dependencies of each
file. Optional additions come therefor last.



Configure and run the Highcharts assembler
------------------------------------------

Create a new file `./custom-builder.js`. Add the following configuration to the
file:

```js
'use strict';
/**
 * Assembler is installed as an NPM package.
 * See "Install the Highcharts assembler" for more information.
 */
const build = require('highcharts-assembler');
build({
    base: './highcharts/js/masters/',
    files: ['custom.src.js'],
    output: './dist/'
});
```

Open a CLI in your project folder and run `node custom-builder.js` to execute
the build script. Once the script has completed you should find the resulting
script `./dist/custom.src.js`.



Create CSS for Styled Mode
-------------------------------------

Highcharts [styled mode](https://api.highcharts.com/highcharts/chart.styledMode)
uses CSS to style the chart, and we must therefore also load CSS styling. In
this example we will use node-sass to generate the CSS file from the
`highcharts.scss` file.

First create a new directory `./dist/css`.

Add the following code to `./custom-builder.js`:

```js
const sass = require('node-sass');
const fs = require('fs');
sass.render({
    file: './highcharts/css/highcharts.scss'
}, (err, result) => {
    fs.writeFile('./dist/css/highcharts.css', result.css);
});
```

Then run `node custom-builder.js` again to create all the files for your custom
Highcharts Styled version.



Options
-------

|Option|Default|Description|
|--- |--- |--- |
|base|null|Path to where the build files are located|
|date|null||
|exclude|null||
|fileOptions|{}||
|files|null|Array of files to compile|
|jsBase|null|Path to where the js folder is located. Used when masters file is not in same location as the source files.|
|output|‘./’|Folder to output compiled files|
|palette|null|Highcharts palette|
|pretty|true||
|product|‘Highcharts’|Which product we’re building.|
|umd|true|Wether to use UMD pattern or a module pattern|
|version|‘x.x.x’|Version number of Highcharts|
