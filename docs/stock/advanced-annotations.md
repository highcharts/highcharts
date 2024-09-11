Advanced Annotations module
===========================

Combining multiple shapes and labels to create a meaningful highlight can be challenging and time consuming. The advanced annotations module simplifies this process, enabling users to add complex yet practical annotations to charts—particularly valuable for technical analysis. Below is a list of all available advanced annotations. See here for [basic annotations](https://www.highcharts.com/docs/advanced-chart-features/annotations-module).
 

Include the following file `modules/annotations-advanced.js` after highcharts.js or highstock.js to enable advanced annotations.

<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/fibonacci allow="fullscreen"></iframe>

The concept
-----------

Advanced annotations are composed of one or more shapes combined with labels. The `type` option specifies the type of advanced annotation to use. This code snippet shows how to easily create the Fibonacci retracement above.


        annotations: [{
            type: 'fibonacci',
            typeOptions: {
                points: [{
                    x: 2,
                    y: 4
                }, {
                    x: 10,
                    y: 6.5
                }]
            }
        }]


The type options and label options
----------------------------------

The `typeOptions` feature allows users to customize the appearance and design of an annotation, including its individual shapes and labels. It’s important to note that `typeOptions` settings are specific to each annotation type. Some annotations that use labels also have `labelOptions` where users may configure the label appearance. Below is an example demonstrating how to apply different colors to various shapes using `typeOptions` for the Fibonacci Retracement annotation. Click the "Apply colors" button in the demo to see the effect.


        ...
        labelOptions: {
            style: {
                color: '#071952'
            }
        },
        typeOptions: {
            backgroundColors: [
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)',
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)',
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)'
            ],
            lineColor: 'rgba(0, 0, 0, 0.8)'
        }

<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/fibonacci allow="fullscreen"></iframe>

Look for the [typeOptions](https://api.highcharts.com/highstock/annotations.fibonacci.typeOptions) and [labelOptions](https://api.highcharts.com/highstock/annotations.fibonacci.labelOptions) for a specific annotation.


Points and control points
-------------------------

Most of the advanced annotations have some control points defined by default. These control points enable users to adjust the annotation by dragging points within the chart, allowing for easy resizing and reshaping. Control points can be modified using `controlPointOptions`, within the overall annotation object, or directly in the `points` array with `controlPoint`. For certain advanced annotations, the `typeOptions` includes an additional `heightControlPoint`, which specifically controls the height. See the Tunnel example below:

<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/tunnel allow="fullscreen"></iframe>

By default, all control points are set to `visible: false`. To make them visible, change the setting to `true` in the `controlPointOptions`. Read more about [controlPointOptions](https://api.highcharts.com/highstock/annotations.tunnel.controlPointOptions) and [heightControlPoint](https://api.highcharts.com/highstock/annotations.tunnel.typeOptions.heightControlPoint).

List of advanced annotations with examples
--------------------------------

Note the demos with an interactive "Apply colors" button to see how various options such as `typeOptions` are applied with different annotations.

### Vertical line
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/vertical-line allow="fullscreen"></iframe>


### Tunnel
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/tunnel allow="fullscreen"></iframe>

### Time cycles
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/time-cycles allow="fullscreen"></iframe>


### Pitchfork
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/pitchfork allow="fullscreen"></iframe>

### Measure
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/measure allow="fullscreen"></iframe>

### Infinity line
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/infinity-line allow="fullscreen"></iframe>

### Fibonacci
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/fibonacci allow="fullscreen"></iframe>

### Fibonacci time zones
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/fibonacci-time-zones allow="fullscreen"></iframe>

### Elliot wave
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/elliott-wave allow="fullscreen"></iframe>

### Crooked line
<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/highcharts/annotations-advanced/crooked-line allow="fullscreen"></iframe>

