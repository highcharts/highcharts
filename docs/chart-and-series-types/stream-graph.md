Stream graph
===

A stream graph is a type of stacked area graph which is displaced around a central axis, resulting in a flowing and organic shape.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.streamgraph)_

<iframe style="width: 100%; height: 660px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/streamgraph allow="fullscreen"></iframe>

Data structure
--------------

The data of a stream graph is simply set as Y values and possibly X values. Each band in the stream graph represents a series, and the [series](https://www.highcharts.com/docs/chart-concepts/series) are stacked against each other.

    
        series: [{
            "name": "Finland",
            "data": [
                0, 11, 4, 3, 6, 0, 0, 6
            ]
        }, {
            "name": "Austria",
            "data": [
                0, 3, 4, 2, 4, 0, 0, 8, 8
            ]
        }, {
            "name": "Sweden",
            "data": [
                0, 2, 5, 3, 7, 0, 0, 10, 4
            ]
        }]
    

Labelling
---------

Thanks to the series-label module, Highcharts allows applying labels in the best-fit position on top of the stream items, maximizing the legibility and quick perception of the data.
