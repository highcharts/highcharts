(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = [
        ['Atlanta', 'USA', '1996', 33.75, -84.38, 7, 2, 2, 3],
        ['Sydney', 'Australia', '2000', -33.87, 151.20, 10, 4, 3, 3],
        ['Athens', 'Greece', '2004', 38, 23.72, 6, 5, 0, 1],
        ['Beijing', 'China', '2008', 39.92, 116.38, 9, 3, 5, 1],
        ['London', 'Great Britain', '2012', 51.5, -0.12, 4, 2, 1, 1],
        ['Rio de Janeiro', 'Brazil', '2016', -22.91, -43.20, 4, 0, 0, 4],
        ['Tokyo', 'Japan', '2020', 35.69, 139.69, 8, 4, 2, 2]
    ];

    Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Alaska west
                    [-164, 54],
                    // Greenland north
                    [-35, 84],
                    // New Zealand east
                    [179, -38],
                    // Chile south
                    [-68, -55]
                ]
            }
        },

        title: {
            text: 'Norwegian medals in the Summer Olympics (1996 - 2020)',
            align: 'left'
        },

        subtitle: {
            text: 'Source: <a href="https://en.wikipedia.org/wiki/Norway_at_the_Olympics">Wikipedia</a>',
            align: 'left'
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '{point.city} ({point.country}, {point.year})<br/>' +
                'Total medals: {point.z}<br/>' +
                '<span style="color: #ffd700;">\u25CF</span> {point.gold}<br/>' +
                '<span style="color: #c0c0c0;">\u25CF</span> {point.silver}<br/>' +
                '<span style="color: #cd7f32;">\u25CF</span> {point.bronze}<br/>'
        },

        series: [{
            name: 'World map',
            nullColor: '#fad3cf'
        }, {
            name: 'Olympic games',
            type: 'mapbubble',
            color: '#fe5f55',
            lineWidth: 1,
            keys: ['city', 'country', 'year', 'lat', 'lon', 'z', 'gold', 'silver', 'bronze'],
            data: data,
            minSize: '5%',
            maxSize: '12.5%',
            accessibility: {
                point: {
                    valueDescriptionFormat: '{point.city}, {point.country}, {point.year}. Total medals: {point.z}. Gold: {point.gold}, silver: {point.silver}, bronze: {point.bronze}.'
                }
            }
        }]

    });

})();
