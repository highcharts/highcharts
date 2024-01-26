Highcharts JS is a JavaScript charting library based on SVG and some canvas/WebGL.

* Official website: [www.highcharts.com](http://www.highcharts.com)
* Download page: [www.highcharts.com/download](http://www.highcharts.com/download)
* Licensing: [shop.highcharts.com](https://shop.highcharts.com/)
* Support: [www.highcharts.com/support](http://www.highcharts.com/support)
* Issues: [Repo guidelines](repo-guidelines.md)

Highcharts is a [source available](https://en.wikipedia.org/wiki/Source-available_software) product. Please refer to [shop.highcharts.com](https://shop.highcharts.com/) for details on licensing.

## Installing and using Highcharts
This is the *working repo* for Highcharts code. If you simply want to include Highcharts into a project, use the [distribution package](https://www.npmjs.com/package/highcharts) instead, or read the [download page](http://www.highcharts.com/download).

Please note that there are several ways to use Highcharts. For general installation instructions, see [the docs](http://www.highcharts.com/docs/getting-started/installation).

### Use our CDN
Instead of downloading, you can use our CDN to access files directly. See [code.highcharts.com](https://code.highcharts.com) for details.

```
<script src="https://code.highcharts.com/highcharts.js"></script>
```

### Install from npm
See [npm documentation](https://docs.npmjs.com/) on how to get started with npm.
```
npm install --save highcharts
```

### ES6 modules, AMD, CommonJS and others
For other ways to use Highcharts in your projects, please refer to our [installation docs](http://www.highcharts.com/docs/getting-started/installation).

## Create your own custom build of Highcharts
To reduce file size, or combine modules into one file to reduce latency, you may
want to create your own build of the Highcharts modules. See [Creating custom
Highcharts files](https://www.highcharts.com/docs/getting-started/how-to-create-custom-highcharts-packages)
for more information.

## Build and debug
If you want to do modifications to Highcharts or fix issues, you may build your own files. Highcharts uses Gulp as the build system. After `npm install` in the root folder, run `gulp`, which will set up a watch task for the JavaScript and CSS files. Now any changes in the files of the `/js` or `/css` folders will result in new files being built and saved in the `code` folder. Other tasks are also available, like `gulp lint`.

```
npm install
gulp
```

## Generate API docs
Run in this `highcharts` repository the doc generator with
`npx gulp jsdoc-watch`, which also starts a new server with the generated API
documentation.
