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

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = Highcharts.geojson(topology);

    // Set drilldown pointers
    data.forEach((d, i) => {
        d.drilldown = d.properties['hc-key'];
        d.value = i; // Non-random bogus data
    });

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            events: {
                drilldown
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

        // @todo: Handle insets
        // mapView: topology.objects.default['hc-recommended-mapview'],
        mapView: {
            projection: {
                name: 'LambertConformalConic',
                rotation: [100],
                parallels: [35, 45]
            }
        },

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
            }
        }],

        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textOutline: '1px #000000'
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