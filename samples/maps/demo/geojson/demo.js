$(function () {

    // Prepare random data
    var data = [
        {
            "code": "DE.SH",
            "value": 728
        },
        {
            "code": "DE.BE",
            "value": 710
        },
        {
            "code": "DE.MV",
            "value": 963
        },
        {
            "code": "DE.HB",
            "value": 541
        },
        {
            "code": "DE.HH",
            "value": 622
        },
        {
            "code": "DE.RP",
            "value": 866
        },
        {
            "code": "DE.SL",
            "value": 398
        },
        {
            "code": "DE.BY",
            "value": 785
        },
        {
            "code": "DE.SN",
            "value": 223
        },
        {
            "code": "DE.ST",
            "value": 605
        },
        {
            "code": "DE.",
            "value": 361
        },
        {
            "code": "DE.NW",
            "value": 237
        },
        {
            "code": "DE.BW",
            "value": 157
        },
        {
            "code": "DE.HE",
            "value": 134
        },
        {
            "code": "DE.NI",
            "value": 136
        },
        {
            "code": "DE.TH",
            "value": 704
        }
    ];

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=germany.geo.json&callback=?', function (geojson) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'GeoJSON in Highmaps'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
            },

            series : [{
                data : data,
                mapData: geojson,
                joinBy: ['code_hasc', 'code'],
                name: 'Random data',
                states: {
                    hover: {
                        color: '#BADA55'
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