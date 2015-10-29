$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "za-ec",
            "value": 0
        },
        {
            "hc-key": "za-np",
            "value": 1
        },
        {
            "hc-key": "za-nl",
            "value": 2
        },
        {
            "hc-key": "za-wc",
            "value": 3
        },
        {
            "hc-key": "za-nc",
            "value": 4
        },
        {
            "hc-key": "za-nw",
            "value": 5
        },
        {
            "hc-key": "za-fs",
            "value": 6
        },
        {
            "hc-key": "za-gt",
            "value": 7
        },
        {
            "hc-key": "za-mp",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/za/za-all.js">South Africa</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/za/za-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
