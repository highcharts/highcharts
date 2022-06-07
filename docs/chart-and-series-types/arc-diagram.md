Arc diagram
============

The arc-diagram chart visualizes relations and their strength between nodes of a data set. In order to use it, you need to load the `modules/arc-diagram.js` module.

<iframe style="width: 100%; height: 485px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/arc-diagram allow="fullscreen"></iframe>

Data structure
--------------

Notice the structure of the [keys](https://api.highcharts.com/highcharts/plotOptions.arcdiagram.keys) feature that links the nodes using the keyword `from` and `to`, and `weight` to represent the volume of the connection: `keys: ['from', 'to', 'weight']`. Arc diagram-specific options such as [linkWeight](https://api.highcharts.com/highcharts/plotOptions.arcdiagram.linkWeight) and [centeredLinks](https://api.highcharts.com/highcharts/plotOptions.arcdiagram.centeredLinks) are also shown in this snippet:

``` JS
    series: [{
        keys: ['from', 'to', 'weight'],
        type: 'arcdiagram',
        name: 'Flights',
        linkWeight: 1,
        centeredLinks: true,
        data: [
            ['Bergen', 'Cracow', 1],
            ['Cracow', 'Frankfurt', 2],
            ['Bergen', 'Frankfurt', 1],
            ['Cracow', 'Chicago', 1]
        ]
    }]
```

Using the [marker](https://api.highcharts.com/highcharts/plotOptions.arcdiagram.marker) option, we can shape the `symbol` of our data nodes. An example of such a configuration with the necessary options can be found in the demo below:

<iframe style="width: 100%; height: 485px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-arcdiagram/marker-symbol allow="fullscreen"></iframe>

Another important feature to mention is the ability to rotate the chart with the `inverted` and `reversed` options:

<iframe style="width: 100%; height: 485px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-arcdiagram/inverted allow="fullscreen"></iframe>

For more detailed samples and documentation check the [API reference](https://api.highcharts.com/highcharts/plotOptions.arcdiagram).