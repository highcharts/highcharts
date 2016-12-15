$(function () {

    // Prepare random data
    var data = [
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

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=germany.geo.json&callback=?', function (geojson) {

        // Initiate the chart
        Highcharts.mapChart('container', {

            title: {
                text: 'GeoJSON in Highmaps'
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
                mapData: geojson,
                joinBy: ['code_hasc', 0],
                keys: ['code_hasc', 'value'],
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.postal}'
                }
            }]
        });
    });
});