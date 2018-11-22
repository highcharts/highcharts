# This browser does not support SVG

This happens in old IE when the `oldie.js` module isn't loaded.

If compatibility with IE versions 6, 7 and 8 is required, add the module after 
loading `highcharts.js`. In a website context, it's a good idea to load it in a
conditional comment to avoid traffic overhead and dead code in modern browsers:

```html
<!--[if lt IE 9]>
    <script src='https://code.highcharts.com/modules/oldie.js'></script>
<![endif]-->
```
