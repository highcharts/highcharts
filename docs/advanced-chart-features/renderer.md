How to use the SVG Renderer
===

The SVG Renderer allows direct access to the Highcharts rendering layer in order
to draw primitive shapes like circles, rectangles, paths or text directly on a
chart, or independent from any chart. It represents a JavaScript wrapper object
for SVG.

Relevant API documentation
--------------------------
* [SVGRenderer](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer)
* [SVGElement](https://api.highcharts.com/class-reference/Highcharts.SVGElement)

Standalone use
--------------
As a standalone API, the Highcharts renderer is a handy abstraction to drawing
vector graphics in the browser.

```js
const renderer = new Highcharts.SVGRenderer(
    document.getElementById('container'),
    600,
    400
);
```

Once the renderer is instanciated, it can be used to render primitive shapes
onto the SVG. Common elements are `rect`, `circle`, `path`, `label` and `text`,
along with groups `g` and other methods. See the [class
reference](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer)
for the full list and live demos.

```js
renderer.circle(100, 100, 50).attr({
    fill: 'red',
    stroke: 'black',
    'stroke-width': 1
}).add();

renderer.text('Hello world', 200, 100).attr({
    rotation: 45
}).css({
    fontSize: '16pt',
    color: 'green'
}).add();
```

Bringing it to life
-------------------
All generated elements can be updated dynamically, either immediately through
the [attr](https://api.highcharts.com/class-reference/Highcharts.SVGElement.html#attr)
function, or by animation through the [animate](https://api.highcharts.com/class-reference/Highcharts.SVGElement.html#animate) function. Check out this demo for some
simple elements with animation:

<iframe style="width: 100%; height: 465px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/members/renderer-basic" allow="fullscreen"></iframe>

Putting it to use on a chart
----------------------------
While freeform drawing capabilities are a nice feature, the renderer gets really
useful when it can be used for custom graphics on top of a chart.

Each `Chart` instance has its own reference to a [renderer](https://api.highcharts.com/class-reference/Highcharts.Chart#renderer). This can be accessed to draw
shapes directly onto the chart's SVG.

The best way to hook custom drawings into the chart rendering process, is to
listen for the
[chart.events.render](https://api.highcharts.com/highcharts/chart.events.render) event.
This event is good for the purpose because it fires both on the first render,
and subsequently every time the chart redraws as a consequence of either
updating data, options or the container size. More on that below.

The `render` event handler can be assigned in two different ways.
1. Add it to the options structure, [chart.events.render](https://api.highcharts.com/highcharts/chart.events.render). This applies per instance.
2. Alternatively, add it the Chart class, so it will apply to all instances.
`Highcharts.addEvent(Highcharts.Chart, 'render', eventHandler)`. This method is
more modular and invites to keeping the options structure clean, but requires that
other options, like for example [chart.className](https://api.highcharts.com/highcharts/chart.className), be used to identify individual charts. Read more about
[addEvent](https://api.highcharts.com/class-reference/Highcharts#.addEvent%3CT%3E)
and see the [addEvent and render demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/addevent/).

Adding responsive shapes
------------------------------
Let's take a closer look at how we can create a custom annotation, and keep it
in place as we change the size of the chart.

Check out the demo for [renderer on a chart](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/renderer-on-chart/).

In this case the annotation is closely tied to this specific chart, so we want
to add the `render` event handler to the options structure. The chart we are
building is a column chart showing precipitation. For the sake of the demo
we want to show a bracket and a text that draw attention to the usually rainful
autumn months. Moreover, this needs to scale up and down because the chart is
responsive and reacts to the size of the containing div.

On the -first call- to the `render` event, we create the element.

```js
let isNew = false;
if (!this.autumnBracket) {
    this.autumnBracket = this.renderer.path()
        .attr({
            stroke: '#333333',
            'stroke-width': 1
        })
        .add();
    this.autumnText = this.renderer.text('Autumn months')
        .attr({
            'text-anchor': 'middle'
        })
        .css({
            fontStyle: 'italic'
        })
        .add();
    isNew = true;
}
```

Note that we haven't supplied the actual [path definition](https://api.highcharts.com/class-reference/Highcharts.SVGAttributes#d) yet, and we have not
set the x and y positions of the text. What we do, is to register the elements
directly on the Chart instance (`this`), so that subsequent render events will
pick them up and reuse them instead of creating new ones. Also note that we
define a flag, `isNew`, that we will use below.

After doing some math to determine exactly where to put the elements, we do the
actual placement:

```js
this.autumnBracket[isNew ? 'attr' : 'animate']({
    d: [
        ['M', left, top + 10],
        ['L', left, top],
        ['L', right, top],
        ['L', right, top + 10]
    ]
});
this.autumnText[isNew ? 'attr' : 'animate']({
    x: (right + left) / 2,
    y: top - 5
});
```

This positioning runs both on the initial draw, and on subsequent redraws. The
only difference is that we use the `isNew` flag to decide if the element was
newly created. If `isNew` is true, we run the `attr` function, because we don't
want an animation from a [0, 0] position. If `isNew` is false, it means the
element was created in a previous render call, which in turn means that we want
a smooth animation into the new position along with other native chart elements
that are animated.

See the full example here, and notice how it repositions if you change the
viewport size:

<iframe style="width: 100%; height: 465px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/members/renderer-on-chart" allow="fullscreen"></iframe>

Positioning items on the chart
------------------------------
In the demo above we used
[Point.pos()](https://api.highcharts.com/class-reference/Highcharts.Point#pos)
to decide where to draw our annotation. Some other positioning properties are
handy when placing custom drawings on the chart:

* [Chart.plotLeft](https://api.highcharts.com/class-reference/Highcharts.Chart#plotLeft)
and
[Chart.plotTop](https://api.highcharts.com/class-reference/Highcharts.Chart#plotLeft)
reflect the position of the plot area.
* [Chart.plotWidth](https://api.highcharts.com/class-reference/Highcharts.Chart#plotWidth)
and
[Chart.plotHeight](https://api.highcharts.com/class-reference/Highcharts.Chart#plotHeight)
reflect the size of the plot area, and can be combined with the previous to find
the right and bottom positions.
* [Axis.pos](https://api.highcharts.com/class-reference/Highcharts.Axis#pos) and
[Axis.len](https://api.highcharts.com/class-reference/Highcharts.Axis#len)
usually are the same as the above, because the axes usually fill the full extent
of the plot area. The exception is when the axis is specifically positioned
using `left` or `top` options.
* The [Series.center](https://api.highcharts.com/class-reference/Highcharts.Series#center)
property is available on circular series types like pie and sunburst.
