(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c116b6fa6948448/samples/data/us-counties-unemployment.json'
    ).then(response => response.json());

    // Add state acronym for tooltip
    mapData.objects.default.geometries.forEach(g => {
        const properties = g.properties;
        if (properties['hc-key']) {
            properties.name = properties.name + ', ' +
            properties['hc-key'].substr(3, 2).toUpperCase();
        }
    });

    document.getElementById('container').innerHTML = 'Rendering map...';

    // Create the map
    setTimeout(function () { // Otherwise innerHTML doesn't update
        Highcharts.mapChart('container', {
            chart: {
                map: mapData,
                borderWidth: 1,
                marginRight: 20 // for the legend
            },

            title: {
                text: 'US Counties unemployment rates, January 2018'
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                floating: true,
                backgroundColor: ( // theme
                    Highcharts.defaultOptions &&
              Highcharts.defaultOptions.legend &&
              Highcharts.defaultOptions.legend.backgroundColor
                ) || 'rgba(255, 255, 255, 0.85)'
            },

            mapNavigation: {
                enabled: true
            },

            colorAxis: {
                min: 0,
                max: 25,
                tickInterval: 5,
                stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']],
                labels: {
                    format: '{value}%'
                }
            },

            plotOptions: {
                mapline: {
                    showInLegend: false,
                    enableMouseTracking: false,
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },

            series: [{
                data: data,
                joinBy: ['hc-key', 'code'],
                name: 'Unemployment rate',
                tooltip: {
                    valueSuffix: '%'
                },
                borderWidth: 0.5
            }, {
                type: 'mapline',
                name: 'State borders',
                color: 'white',
                shadow: false,
                borderWidth: 2
            }]
        });
    }, 0);
})();