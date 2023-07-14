(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-population-density.json'
    ).then(response => response.json());

    // Make codes uppercase to match the map data
    data.forEach(function (p) {
        p.code = p.code.toUpperCase();
    });

    // Instantiate the map
    Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        title: {
            text: 'US population density (/km²)'
        },

        exporting: {
            sourceWidth: 600,
            sourceHeight: 500
        },

        legend: {
            layout: 'horizontal',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: true,
            verticalAlign: 'top',
            y: 25
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
            min: 1,
            type: 'logarithmic',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
                [0, '#EFEFFF'],
                [0.67, '#4444FF'],
                [1, '#000022']
            ]
        },

        series: [{
            accessibility: {
                point: {
                    valueDescriptionFormat: '{xDescription}, {point.value} people per square kilometer.'
                }
            },
            animation: {
                duration: 1000
            },
            data: data,
            joinBy: ['postal-code', 'code'],
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                format: '{point.code}'
            },
            name: 'Population density',
            tooltip: {
                pointFormat: '{point.code}: {point.value}/km²'
            }
        }]
    });

})();