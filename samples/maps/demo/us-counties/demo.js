(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://www.highcharts.com/samples/data/us-counties-unemployment.json'
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
    Highcharts.mapChart('container', {
        chart: {
            map: mapData,
            height: '80%'
        },

        title: {
            text: 'US Counties unemployment rates',
            align: 'left'
        },

        subtitle: {
            text: 'January 2018',
            align: 'left'
        },

        accessibility: {
            description: 'Demo showing a large dataset.'
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            y: 42,
            margin: 0,
            borderColor: 'var(--highcharts-neutral-color-5, #f2f2f2)',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: 'var(--highcharts-background-color, white)',
            padding: 10,
            shadow: {
                width: 1,
                opacity: 0.03
            },
            symbolRadius: 6
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
            min: -1,
            max: 26,
            tickInterval: 5,
            labels: {
                format: '{value}%'
            },
            startOnTick: false,
            endOnTick: false,
            minColor: '#ebf1ff',
            maxColor: '#0048ff',
            // Dots for ticks, extended also by custom CSS
            tickColor: '#ffffff',
            tickLength: 0.1,
            tickWidth: 6,
            gridLineWidth: 0
        },

        plotOptions: {
            mapline: {
                showInLegend: false,
                enableMouseTracking: false
            }
        },

        series: [{
            data: data,
            joinBy: ['hc-key', 'code'],
            name: 'Unemployment rate',
            tooltip: {
                valueSuffix: '%'
            },
            borderWidth: 0.5,

            shadow: false,
            accessibility: {
                enabled: false
            }
        }, {
            type: 'mapline',
            name: 'State borders',
            color: 'white',
            shadow: false,
            borderWidth: 2,
            accessibility: {
                enabled: false
            }
        }],

        tooltip: {
            useHTML: true,
            headerFormat: '<b>{series.name}</b><hr/>',
            // Custom point format for consistent width
            pointFormat:
                '<b style="color:{point.color};">● </b> ' +
                '<b style="min-width: 40px; display: inline-block;">' +
                '{point.value}</b>' +
                '<span style="min-width: 140px; display: inline-block;' +
                ' text-align: right;">{point.name}</span>'
        }
    });

})();
