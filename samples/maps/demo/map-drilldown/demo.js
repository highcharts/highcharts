const drilldown = async function (e) {
    if (!e.seriesOptions) {
        const chart = this,
            mapKey = `countries/us/${e.point.drilldown}-all`;

        // Handle error, the timeout is cleared on success
        let fail = setTimeout(() => {
            if (!Highcharts.maps[mapKey]) {
                chart.showLoading(`
                    <i class="icon-frown"></i>
                    Failed loading ${e.point.name}
                `);
                fail = setTimeout(() => {
                    chart.hideLoading();
                }, 1000);
            }
        }, 3000);

        // Show the Font Awesome spinner
        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');

        // Load the drilldown map
        const topology = await fetch(
            `https://code.highcharts.com/mapdata/${mapKey}.topo.json`
        ).then(response => response.json());

        const data = Highcharts.geojson(topology);

        // Set a non-random bogus value
        data.forEach((d, i) => {
            d.value = i;
        });

        // Apply the recommended map view if any
        chart.mapView.update(
            Highcharts.merge(
                {
                    insets: undefined,
                    padding: 0
                },
                topology.objects.default['hc-recommended-mapview']
            )
        );

        // Hide loading and add series
        chart.hideLoading();
        clearTimeout(fail);
        chart.addSeriesAsDrilldown(e.point, {
            name: e.point.name,
            data,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        });
    }
};

// On drill up, reset to the top-level map view
const afterDrillUp = function (e) {
    if (e.seriesOptions.custom && e.seriesOptions.custom.mapView) {
        e.target.mapView.update(
            Highcharts.merge(
                { insets: undefined },
                e.seriesOptions.custom.mapView
            ),
            false
        );
    }
};

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = Highcharts.geojson(topology);

    const mapView = topology.objects.default['hc-recommended-mapview'];

    // Set drilldown pointers
    data.forEach((d, i) => {
        d.drilldown = d.properties['hc-key'];
        d.value = i; // Non-random bogus data
    });

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            events: {
                drilldown,
                afterDrillUp
            }
        },

        title: {
            text: 'Highcharts Map Drilldown'
        },

        colorAxis: {
            min: 0,
            minColor: '#E6E7E8',
            maxColor: '#005645'
        },

        mapView,

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: '#EEDD66'
                    }
                }
            }
        },

        series: [{
            data,
            name: 'USA',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal-code}'
            },
            custom: {
                mapView
            }
        }],

        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textOutline: '1px #000000'
            },
            breadcrumbs: {
                floating: true,
                relativeTo: 'spacingBox'
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    });

})();