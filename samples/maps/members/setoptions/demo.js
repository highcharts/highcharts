(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        chart: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, '#111'],
                    [0.15, '#222'],
                    [0.4, '#333'],
                    [0.6, '#333'],
                    [0.75, '#222'],
                    [1, '#111']
                ]
            }
        },
        title: {
            style: {
                color: '#ccc'
            }
        },
        legend: {
            title: {
                style: {
                    color: '#ccc'
                }
            }
        },
        colorAxis: {
            minColor: '#666',
            maxColor: '#888',
            labels: {
                style: {
                    color: '#888'
                }
            }
        },

        plotOptions: {
            map: {
                borderWidth: 0.25,
                borderColor: '#111'
            }
        }

    });

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {

            title: {
                text: 'Set general theme options'
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
                    text: 'Population density (/km²)'
                }
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
    });
})();