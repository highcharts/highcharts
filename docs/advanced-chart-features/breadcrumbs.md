Breadcrumbs
============

The Breadcrumbs is part of the Drilldown module that helps in navigation through drilldown levels.
Allows showing the full path that leads to a given level or only a single button to the previous level is visible depending on the `showFullPath` property.

![breadcrumbs.png](breadcrumbs.png)

In the case of simpler series (for example column) `breadcrumbs` configuration object should be placed inside the `drilldown` object.

``` JS
drilldown: {
    breadcrumbs: {
        floating: true,
        position: {
            align: 'right'
        }
    },
    ...
}
```
For series like treemap and sunburst, the `breadcrumbs` config should be declared inside the series.
``` JS
series: [{
    breadcrumbs: {
        showFullPath: false
    },
    type: 'treemap',
    ...
}]
```

For more information see the [API reference](https://api.highcharts.com/highcharts/breadcrumbs) for breadcrumbs options.