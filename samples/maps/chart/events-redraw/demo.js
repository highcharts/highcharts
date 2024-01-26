(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            events: {
                resize: function () {
                    this.setTitle(null, {
                        text: 'Chart width: ' + this.chartWidth + '<br/>' +
                                'Chart height: ' + this.chartHeight
                    });
                }
            },
            borderWidth: 1
        },

        subtitle: {
            align: 'left',
            verticalAlign: 'middle',
            y: 50,
            floating: true
        },

        title: {
            text: 'Set subtitle on chart resize. Resize browser or frame to view.'
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

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
})();