(async () => {

    // Prepare random data
    const data = [
        ['DE.SH', 728],
        ['DE.BE', 710],
        ['DE.MV', 963],
        ['DE.HB', 541],
        ['DE.HH', 622],
        ['DE.RP', 866],
        ['DE.SL', 398],
        ['DE.BY', 785],
        ['DE.SN', 223],
        ['DE.ST', 605],
        ['DE.NW', 237],
        ['DE.BW', 157],
        ['DE.HE', 134],
        ['DE.NI', 136],
        ['DE.TH', 704],
        ['DE.', 361]
    ];

    // Load the geojson germany map
    const geojson = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/germany.geo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: geojson
        },

        title: {
            text: 'GeoJSON in Highmaps'
        },

        accessibility: {
            typeDescription: 'Map of Germany.'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            tickPixelInterval: 100
        },

        series: [{
            data: data,
            keys: ['code_hasc', 'value'],
            joinBy: 'code_hasc',
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal}'
            }
        }]
    });
})();