System requirements
===

Highcharts is a standalone library, which means that it does not require any additional frameworks or plugins to work. It is solely based on native browser technologies, and all core functionality runs in the browser. As it is a front-end library, Highcharts can be used with any server that can serve static files. It needs only the core `highcharts.js` script to run.

There are Highcharts integrations available for frameworks such as React and Vue, as well as for native iOS and Android development. See our [integrations overview](https://www.highcharts.com/integrations/) for more information.

Browser compatibility
---------------------

We test our software on many browsers using the latest versions. Highcharts runs on the following browser versions:

|Brand|Versions supported|
|--- |--- |
|Firefox|2.0 +|
|Chrome|1.0 +|
|Safari|4.0 +|
|Opera|9.0 +|
|Edge|12.0 +|
|Internet Explorer|9.0 +|
|Android Browser|3.0 +|

Supporting IE 11 and other legacy browsers
-----------------

Beginning with Highcharts v11, legacy browsers must load Highcharts from the `es5` folder on `code.highcharts.com` or in the local file download. This also works with modern browsers. A typical setup looks like this:

```html
<script src="https://code.highcharts.com/es5/highcharts.js"></script>
<script src="https://code.highcharts.com/es5/modules/exporting.js"></script>
```

One of the legacy browsers requiring the files from the `es5` folder is QtWeb (wkhtmltopdf's QT Webkit rendering engine is based on this browser).
