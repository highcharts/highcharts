System requirements
===

Highcharts is a standalone library, which means that it does not require any additional frameworks or plugins to work. It is solely based on native browser technologies, and all core functionality runs in the browser. As it is a front-end library, Highcharts can be used with any server that can serve static files. It needs only the core `highcharts.js` script to run.

Highcharts works on all modern browsers and mobile devices. Legacy browsers – primarily IE 6-8 – are supported using polyfills and the [oldIE module](#supporting-ie-6-8).

There are Highcharts wrappers available for frameworks such as React and Vue, as well as for native iOS and Android development. See our [wrapper overview](https://www.highcharts.com/wrappers-addons-and-plugins/wrappers/) for more information.

Browser compatibility
---------------------

We test our software on many browsers using the latest versions. Knowing that Internet Explorer users have a tendency not to upgrade we also systematically test older versions of that browser. Highcharts runs on the following browser versions:

|Brand|Versions supported|
|--- |--- |
|Firefox|2.0 +|
|Chrome|1.0 +|
|Safari|4.0 +|
|Opera|9.0 +|
|Edge|12.0 +|
|Internet Explorer|6.0-8.0 partial support using polyfills|
|Internet Explorer|9.0 +|
|Android Browser|3.0 +|

Supporting IE 6-8
-----------------

For supporting IE 6-8, some polyfills are needed. The first file, `oldie-polyfills.js` includes some common array functions. This file extends array and object prototypes, and can be omitted if you have other polyfill libraries, or prefer to use your own. The second file, `oldie.js`, includes the VML renderer since old IE doesn't support SVG rendering. The polyfills must be inluded before the Highcharts main file. With conditional comments, it looks like this:

```html
<!--[if lt IE 9]>
<script src="https://code.highcharts.com/modules/oldie-polyfills.js"></script>
<![endif]-->
<script src="https://code.highcharts.com/highcharts.js"></script>
<!--[if lt IE 9]>
<script src="https://code.highcharts.com/modules/oldie.js"></script>
<![endif]-->
```
