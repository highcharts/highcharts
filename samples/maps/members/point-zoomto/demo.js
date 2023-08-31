(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Assign id's
    data.forEach(function (p) {
        p.id = p.code;
    });

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Zoom to point'
        },

        subtitle: {
            text: 'Click a country to zoom to it. Use buttons below map for selected tests.'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            allowPointSelect: true,
            cursor: 'pointer',
            events: {
                click: function (e) {
                    e.point.zoomTo();
                }
            },
            tooltip: {
                pointFormat: '{point.id} {point.name}',
                valueSuffix: '/km²'
            }
        }]
    });

    // Activate the buttons
    document.getElementById('ecuador').addEventListener('click', function () {
        chart.get('EC').zoomTo();
    });
    document.getElementById('south-korea').addEventListener('click', function () {
        chart.get('KR').zoomTo();
    });
    document.getElementById('zoom-out').addEventListener('click', function () {
        chart.mapZoom();
    });

})();