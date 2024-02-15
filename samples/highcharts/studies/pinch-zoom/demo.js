function log() {
    document.getElementById('log').innerText += Array.from(arguments)
        .join(', ') + '\n';
}

// Boost scale preview
/*
Highcharts.addEvent(Highcharts.Axis, 'setExtremes', function (e) {
    if (e.trigger === 'touchmove') {
        const range = this.max - this.min,
            scale = (e.max - e.min) / range;

        log(scale);

        e.preventDefault();
    }
});
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

    // const data = new Array(500000).fill(1).map(Math.random)

    Highcharts.chart('container', {
        chart: {
            zoomType: 'xy',
            panning: {
                enabled: true,
                type: 'x'
            },
            mouseWheel: {
                enabled: true
            },
            panKey: 'shift',
            type: 'line',
            backgroundColor: '#eeeeff',
            plotBackgroundColor: '#ffffff'
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
            },
            startOnTick: false,
            endOnTick: false
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

        boost: {
            // seriesThreshold: 1
        },
        plotOptions: {
            series: {
                // boostThreshold: 1
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