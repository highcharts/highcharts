$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ad-3689",
            "value": 0
        },
        {
            "hc-key": "ad-6404",
            "value": 1
        },
        {
            "hc-key": "ad-6405",
            "value": 2
        },
        {
            "hc-key": "ad-6406",
            "value": 3
        },
        {
            "hc-key": "ad-6407",
            "value": 4
        },
        {
            "hc-key": "ad-6408",
            "value": 5
        },
        {
            "hc-key": "ad-6409",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ad/ad-all.js">Andorra</a>'
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
            mapData: Highcharts.maps['countries/ad/ad-all'],
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
