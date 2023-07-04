(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Point click event test'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function () {
                            location.href = 'https://en.wikipedia.org/wiki/' + this.name;
                        }
                    }
                }
            }
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            cursor: 'pointer',
            tooltip: {
                pointFormat: '{point.name}: {point.value}/km²<br><span style="color:gray;font-size:11px">Click to view Wikipedia article</span>'
            }
        }]
    });
})();