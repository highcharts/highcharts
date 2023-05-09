(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                style: {
                    fontFamily: 'serif'
                }
            },

            title: {
                text: 'Chart with serif fonts'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            legend: {
                title: {
                    text: 'Population per km²'
                }
            },

            series: [{
                data: data,
                mapData: topology,
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.point.properties && this.point.properties['hc-a2'];
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
})();