Installation
===

### Install via NPM
One of the ways of adding the Highcharts Dashboards to your web page is via npm script. You can get all Dashboards functionality in the package, which can be installed using following script:
```bash
    npm install <PACKAGE-NAME>
```
Then import the package in your project:
``` JS
    import Dashboards from '<PACKAGE-NAME>';
```

### Include Dashboards by script tag
Include the JavaScript files in the `<head>` section of your web page as shown below.

```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
 ```


### Load files from your domain
In the example above the Javascript files are loaded from [code.highcharts.com](https://code.highcharts.com) but you can download the files from [highcharts.com](https://www.highcharts.com/download/) and include them on your web page. Here is the example with Highcharts served from your own server:

```html
    <script src="../code/dashboards.js"></script>
```
### Load additional modules
There are some additional modules that you might want to include in your webpage, that are not included in the basic `dashboards.js` module. The basic module lets you create the elementary dashboard with `HTMLComponents`, but if you would like to use some predefined component types, you need to add some other modules e.g. to use Highcharts component, you need to add following scripts:
```html
    ../dashboards.js
    ../dashboards-plugin.js
    ../highcharts.js
```

### Get started

Now you are ready to use Dashboards. Check out [Your first Dashboard](https://highcharts.com/docs/dashboards/your-first-dashboard) to get started.