#How to create custom Highcharts files
By using the Highcharts assembler you can create your own custom Highcharts files. A benefit of using a custom file can be optimization of browser load speed due to lower filesize and less files to request.
Follow the steps below to get started.
##Download the Highcharts parts files
Go to the Highcharts repository and click on “Clone or download” and select “Download ZIP”. Once the zip file is downloaded unpack it. Create a new folder in your project and name it highcharts. Copy the folders "assembler", "js" and "css" from the unpacked zip file into the new highcharts folder.

##Install dependencies
The Highcharts assembler has to be executed in a Node.js environment, and you will therefore need to have Node.js installed. You can find more about it on [Node.js offical website](https://nodejs.org/en/)

Another dependency is [js-beautify](https://www.npmjs.com/package/js-beautify), which is used to format the resulting file. To install js-beautify open a CLI in your project folder and run `npm install --save-dev js-beautify`.
##Create a custom setup
Start by creating a new file `./highcharts/js/masters/custom.src.js`. In this example we want a basic line chart with some interactivity. To achieve this we will need a setup that looks something like this:
```javascript
'use strict';
import Highcharts from '../parts/Globals.js';
import '../parts/SvgRenderer.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Interaction.js';
export default Highcharts;
```
Modify the setup according to your needs, then proceed with the next step.

##Configure and run the Highcharts assembler
Create a new file `./custom-builder.js`. Add the following configuration to the file:
```javascript
'use strict';
const build = require('./highcharts/assembler/build.js').build;
build({
	base: './highcharts/js/masters/',
	files: ['custom.src.js'],
	output: './dist/'
});
```
Open a CLI in your project folder and run `node custom-builder.js` to execute the build script. Once the script has completed you should find the resulting script `./dist/custom.src.js`.
##Create custom Highcharts CSS files
To create a custom CSS version you will have to make a few modifications to the build procedure. This example assumes that you have read and followed the procedures already mentioned above in this article. 
The Highcharts assembler has an option named `type`, let us set this to `css`. The configuration in `./custom-builder.js` should now look like this:
```javascript
build({
	base: './highcharts/js/masters/',
	files: ['custom.src.js'],
	output: './dist/',
	type : ‘css’
});
```
Run `node custom-builder.js` again and notice that the new file `./dist/js/custom.src.js` has been created.

Highcharts Styled version uses CSS to style the chart, and we must therefore also load its css styling. In this example we will use node-sass to generate the css file from the highcharts.scss file.
First create a new directory `./dist/css`.
Add the following code to `./custom-builder.js`:
```javascript
const sass = require('node-sass');
sass.render({
  file: './highcharts/css/highcharts.scss'
}, (err, result) => {
	const fs = require('fs');
	fs.writeFile('./dist/css/highcharts.css', result.css)
});
```
Then run `node custom-builder.js` again to create all the files for your custom Highcharts Styled version.
##Options
| Option | Default | Description |
| ------------- | ------------- | ------------- |
| base | null | Path to where the build files are located |
| date | null | |
| exclude | null | |
| fileOptions | {} | |
| files | null |Array of files to compile |
| jsBase | null | Path to where the js folder is located. Used when masters file is not in same location as the source files. |
| output | './' | Folder to output compiled files |
| palette | null | Highcharts palette |
| pretty | true | |
| product | 'Highcharts' | Which product we're building. |
| umd | true | Wether to use UMD pattern or a module pattern |
| version | 'x.x.x' | Version number of Highcharts |
| type | 'classic' | Type of Highcharts version. Classic or css. |

