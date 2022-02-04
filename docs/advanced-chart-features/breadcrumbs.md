Breadcrumbs
============

The Breadcrumbs is a standalone feature that might be used in a drilldown module or in series such as treemap or sunburst to help traverse through levels. It also might be used outside of the Highcharts.

Allows showing the full path that leads to a given level or only a single button to the previous level is visible depending on the `showFullPath` property.

![breadcrumbs.png](breadcrumbs.png)

**Breadcrumbs in drilldown**

In the case of simpler series (for example column) `breadcrumbs` configuration object should be placed inside the `drilldown` object. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/breadcrumbs/format)

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
**Breadcrumbs in treemap/sunburst**

For series like treemap and sunburst, the `breadcrumbs` config should be declared inside the series. They are enabled by default. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/sunburst)

``` JS
series: [{
    breadcrumbs: {
        showFullPath: false
    },
    type: 'treemap',
    ...
}]
```
**Breadcrumbs standalone**

Breadcrumbs might also be used as a standalone element. To do so, a list of levels and their options need to be created. Then Breadcrumbs class might be used to create a new object. Chart and breadcrumbs options should be passed as arguments. To calculate the list use the `updateProperties method, then breadcrumbs are ready to be rendered. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/breadcrumbs/standalone)

```JS
const chart = Highcharts.chart('container', {
    title: {
        text: 'Standalone Breadcrumbs group'
    }
});

const list = [{
    level: 0,
    levelOptions: {
        name: 'First Element'
    }
}, {
    level: 1,
    levelOptions: {
        name: 'Second Element'
    }
}];

const breadcrumbsOptions = {
    position: {
        align: 'center'
    },
    events: {
        click: function (e, b) {
            console.log(b.level);
        }
    },
    showFullPath: true
};

const breadcrumbs = new Highcharts.Breadcrumbs(
    chart,
    breadcrumbsOptions
);

breadcrumbs.updateProperties(list);
breadcrumbs.render();
```

For more information see the [API reference](https://api.highcharts.com/highcharts/breadcrumbs) for breadcrumbs options.