/*
To do
- Remove chart.plotLeft, chart.plotTop from the calculations. Check axis
  positioning.
- When to show reset zoom button? Not on mousewheel.
- Look into the Chart.zoom function. Can it also use transform?
*/


(async () => {

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            panning: {
                enabled: true,
                type: 'x'
            },
            panKey: 'shift'
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
            min: 500,
            max: 2500
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
            type: 'area',
            name: 'USD to EUR',
            data: data.map(p => p[1])
        }]
    });

    /* eslint-disable-next-line no-extend-native */
    Array.prototype.item = function (i) {
        // eslint-disable-line no-extend-native
        return this[i];
    };
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
})();