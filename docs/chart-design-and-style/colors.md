Colors
======

Highcharts supports solid and semi-transparent colors as well as linear and radial gradients. Unless specified below, this applies to all color options in the Highcharts API, whether it is called color, backgroundColor, borderColor, lineColor etc.

Solid colors
------------

Primarily, Highcharts supports solid colors given in hex format _#00FF00_ and rgb format _rgb(0,255,0)_.

Secondary, any color format that is recognized by the browser, like short Hex _#0F0_ or color names (_red, brown, blue_) is supported. However, in some cases Highcharts alters the brightness of the color, like when hovering a column chart. When using the secondary color formats, this operation isn't performed. By plugging in to the Highcharts.Color object, we can make named colors work with external libraries or color definitions, like [this example with RGBColor](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/colors-parsers/).

### Semi-transparent colors - opacity

Semi-transparent colors in Highcharts are given in the rgba format _rgba(255,255,255,1)_. The last parameter is the alpha or opacity that ranges from 0, fully transparent, to 1, fully opaque. Because of this, there are no separate opacity options in the Highcharts API.

Linear gradients
----------------

Linear gradients in Highcharts have a similar syntax to that of SVG:

    
    color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, '#003399'],
            [1, '#3366AA']
        ]
    }

The color is given as an object literal containing two properties:

*   **linearGradient** holds another object literal that defines the start position (x1, y1) and the end position (x2, y2) relative to the shape, where 0 is top/left and 1 is bottom/right.
*   **stops** is an array of tuples. The first item in each tuple is the position in the gradient, where 0 is the start of the gradient and 1 is the end of the gradient. Multiple stops can be applied. The second item is the color for each stop. This color can also be given in the rgba format.

The linear gradients can be applied to both fills (backgrounds) and strokes (lines).

Note that linear gradients can be differently defined (as an array or an object). Also, start/end positions might be calculated differently depending on the `gradientUnits` property (this property can only be set in linear gradient declared as object).

`gradientUnits` values:
*   **`userSpaceOnUse`** Default when gradient declared as an array. Start and end positions have to be declared as pixels on the chart.
*   **`objectBoundingBox`** Default when gradient declared as an object. Start and end positions are in the range of 0 to 1 as described above. Using this might sometimes result in the disappearance of the coloured element.

See the online example of a [linear gradient chart background](https://jsfiddle.net/highcharts/4rTBY/).

Radial gradients
----------------

Since Highcharts 2.3 radial gradients have been supported. They have a similar syntax to that of SVG:

    
    color: {
        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        stops: [
           [0, '#003399'],
           [1, '#3366AA']
        ]
    }

The color is given as an object literal containing two properties:

*   **radialGradient** holds another object literal, with three properies. The **cx** and **cy** properties are the horizontal and vertical centers of the radial gradient respectively, relative to the shape where 0 and 1 are the edges and 0.5 is the center of the shape. The r property defines the radius relative to the shape's diameter. When all values are 0.5, the gradient starts in the middle of the circle and ends along the perimeter.
*   **stops** is an array of tuples. The first item in each tuple is the position in the gradient, where 0 is the start of the gradient and 1 is the end of the gradient. Multiple stops can be applied. The second item is the color for each stop. This color can also be given in the rgba format.

When a radial gradient is used as the color of a pie slice or the background color of a gauge or polar chart, the gradient is drawn relative to the full circle, not only the specific shape.

See the demo of [radial gradients in a pie chart](https://highcharts.com/demo/pie-gradient).

Pattern fills
-------------

Since Highcharts v6.1, pattern fills are supported natively.

To enable this new functionality, load the pattern-fill.js module. Example loading the latest version from our CDN:
    
    <script src="https://code.highcharts.com/modules/pattern-fill.js"></script>

Then, to define a color as a pattern, we can do as follows with any color option:

    color: {
        pattern: {
            // Pattern options here
        }
    }

Further reading:

*   [Pattern fills tutorial](https://www.highcharts.com/docs/chart-design-and-style/pattern-fills)
*   [PatternOptions](https://api.highcharts.com/class-reference/Highcharts.PatternOptionsObject) in the API for options details.
