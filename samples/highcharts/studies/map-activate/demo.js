/**
 * Snippet to activate the map navigation on click.
 *
 * To do
 * - Option for the button to remain hidden until the user interacts with the
 *   chart.
 * - Option to change the map's state back
 * - Make the button HTML
 * - Make sample and blog article
 */

(({ addEvent, Chart }) => {

    function activateChart(chart) {
        chart.update({
            chart: {
                panning: {
                    enabled: true
                }
            },
            mapNavigation: {
                enabled: true
            }
        });
        chart.activateButton.hide();
    }

    function highlightButton(chart) {
        chart.activateButton
            .attr({
                fill: '#000066'
            })
            .animate({
                fill: '#2caffe'
            });
    }

    function createButton(chart) {
        const button = chart.renderer.button(
            'Click to explore the map',
            0,
            0,
            () => activateChart(chart),
            {
                r: 18,
                fill: '#2caffe',
                height: 24,
                paddingLeft: 16,
                paddingRight: 16,
                style: {
                    color: '#ffffff',
                    fontSize: '18px'
                }
            },
            {
                fill: '#000066'
            }
        )
            .attr({
                align: 'center',
                zIndex: 3
            })
            .add();
        chart.container.addEventListener(
            'touchmove',
            () => highlightButton(chart)
        );
        chart.container.addEventListener(
            'mousewheel',
            () => highlightButton(chart)
        );
        chart.container.addEventListener(
            'mousemove',
            e => {
                if (e.buttons === 1) {
                    highlightButton(chart);
                }
            }
        );
        return button;
    }

    addEvent(Chart, 'render', function () {
        if (!this.activateButton) {
            this.activateButton = createButton(this);
        }
        this.activateButton.align({
            align: 'center',
            verticalAlign: 'bottom',
            y: -70
        }, false, 'plotBox');
    });

})(Highcharts);


// Create the chart
Highcharts.mapChart('container', {
    chart: {
        margin: 0,
        panning: {
            enabled: false
        }
    },

    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },

    navigation: {
        buttonOptions: {
            theme: {
                stroke: '#e6e6e6'
            }
        }
    },

    mapNavigation: {
        enabled: false,
        buttonOptions: {
            alignTo: 'spacingBox'
        }
    },

    mapView: {
        center: [6.5811472, 61.08707],
        zoom: 13
    },

    tooltip: {
        pointFormat: '{point.name}'
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        mappoint: {
            dataLabels: {
                align: 'left',
                x: 5
            }
        }
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Basemap Tiles',
        provider: {
            type: 'OpenStreetMap'
        },
        showInLegend: false
    }, {
        type: 'mappoint',
        name: 'POIs',
        marker: {
            symbol: 'mapmarker',
            radius: 10
        },
        data: [{
            name: 'Something happened here',
            lon: 6.5811472,
            lat: 61.08707
        }]
    }]
});
