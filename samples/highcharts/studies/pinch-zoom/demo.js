/*
To do
- When to show reset zoom button? Investigate and run some combinations.
- Check out if minPadding, maxPadding and threshold can be refactored out and
  shared with setTickPositions.
- Stock chart: navigator not working after zooming on y. Reset button quirks.
- On multiple panes, make sure only zoomed axes are affected. Check target or
  reference position (center point?) against axis position. Add/modify tests.
*/


(async () => {

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
    ).then(response => response.json())
        .then(data =>
            data
            // .map(p => p[1])
            // .slice(0, 10)
        );

    Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            panning: {
                enabled: true,
                type: 'x'
            },
            mouseWheel: {
                enabled: true
            },
            panKey: 'shift',
            type: 'area'
        },
        title: {
            text: 'USD to EUR exchange rate over time',
            align: 'left'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
            align: 'left'
        },
        xAxis: {
            minPadding: 0.2,
            maxPadding: 0.2
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },
        tooltip: {
            followTouchMove: false,
            followPointer: true
        },
        legend: {
            enabled: false
        },
        rangeSelector: {
            selected: 2
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            name: 'USD to EUR',
            data
        }]
    });

    /* eslint-disable-next-line no-extend-native */
    Array.prototype.item = function (i) {
        // eslint-disable-line no-extend-native
        return this[i];
    };
    /*
    setTimeout(function () {
        const chart = Highcharts.charts[0],
            offset = Highcharts.offset(chart.container);

        // Perform dual touch zoom
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                },
                {
                    pageX: 300 + offset.left,
                    pageY: 150 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [
                {
                    pageX: 180 + offset.left,
                    pageY: 80 + offset.top
                },
                {
                    pageX: 350 + offset.left,
                    pageY: 170 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        setTimeout(function () {

            chart.pointer.onContainerTouchMove({
                type: 'touchmove',
                touches: [
                    {
                        pageX: 200 + offset.left,
                        pageY: 100 + offset.top
                    },
                    {
                        pageX: 300 + offset.left,
                        pageY: 150 + offset.top
                    }
                ],
                preventDefault: function () {}
            });

            chart.pointer.onDocumentTouchEnd({
                type: 'touchend',
                touches: [
                    {
                        pageX: 200 + offset.left,
                        pageY: 100 + offset.top
                    },
                    {
                        pageX: 300 + offset.left,
                        pageY: 150 + offset.top
                    }
                ]
            });
        }, 500);

    }, 1000);
    // */
})();