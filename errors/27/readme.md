# This browser does not support SVG

This happens in old IE when the `oldie.js` module is not loaded.

If you need to target IE versions 6, 7 and 8, add the module after loading
`highcharts.js`. In a website context, it is a good idea to load it in a
conditional comment to avoid traffic overhead in modern browsers:

```html
<!--[if lt IE 9]>
    <script src='https://code.highcharts.com/modules/oldie.js'></script>
<![endif]-->
```
