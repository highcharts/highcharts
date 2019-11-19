Gradients, shadows, and pattern fills in styled mode
===

In Highcharts classic mode, gradients are set as configuration objects to colors, shadows are generally available as API options, and patterns require [the pattern module](https://www.highcharts.com/blog/tutorials/pattern-fills/). 

In [styled mode](https://highcharts.com/docs/chart-design-and-style/style-by-css) however, we have removed all presentational API options, so color options or shadow options are not available. The idea here is that all presentational properties should be set via CSS. But while HTML supports CSS properties for gradients, shadows and patterns, SVG doesn't. We need to define them in the SVG structure first, before applying them from the CSS.

1. Define the SVG structure
----------------------------

SVG allows graphical objects to be defined for later usage in the [defs tag](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs). So in Highcharts 5, we added a direct API for adding defs through the [SVGRenderer.definition](https://api.highcharts.com/highcharts/SVGRenderer.definition) function and the general [defs option structure](https://api.highcharts.com/highcharts/defs). For maximum flexibility, this structure accepts a JSON-serialized SVG structure that is directly inserted. Some key property names are reserved:

*   `tagName` corresponds to the SVG tag.
*   `textContent` is inserted directly into the generated tag.
*   `children` is an array of child nodes with the same syntax.

An example of using defs is to apply a gradient: 

    
    defs: {
        gradient0: { // key
            tagName: 'linearGradient',
            id: 'gradient-0',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        }  
    }  
      
    

The _key_ (see code comment) doesn't have a general meaning, but can be used for later reference or when merging options. For instance the structure can be modified in depth through `Highcharts.setOptions`. 

An alternative way to define the SVG structure is to add it to a second SVG in the same HTML document. This is the fastest way of reusing definitions by copy-pasting from online SVG examples. [View sample](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/gradient-island/).

2. Apply it in the CSS
-----------------------

Notice the _id_ property in the sample above. The generated definition structure is given this id, that we can use to apply the gradient via CSS. For instance, we can set `fill: url(#gradient-0)` in a CSS rule. An important note here is that the URL is relative to the _CSS file_, while the SVG definition is in the current web page. To make it more confusion, WebKit has a bug that makes this URL work from CSS in different directories and on different hosts. So make sure to test with different browsers.

As for shadow, there is a built-in definition in Highcharts. Set `filter: url(#drop-shadow)` for any element where you want a simple drop shadow. This is used for the tooltip by default.

Samples
-------

1.  [Gradients](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/gradient/). The sample shows two gradients. Stop colors are also defined from the CSS.
2.  [Shadows and glows](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/shadow/). The sample shows how to apply an SVG filter. For a simple drop shadow, the built-in `#drop-shadow` filter can be used.
3.  [Patterns](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/pattern/). The sample shows how to add pattern patterns in the defs, and add colors an apply them in CSS. 
4.  [Borrow definitions](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/gradient-island/) from another SVG in the page.
