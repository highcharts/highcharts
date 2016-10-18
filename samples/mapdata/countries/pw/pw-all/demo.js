$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pw-6740",
            "value": 0
        },
        {
            "hc-key": "pw-6753",
            "value": 1
        },
        {
            "hc-key": "pw-6742",
            "value": 2
        },
        {
            "hc-key": "pw-6741",
            "value": 3
        },
        {
            "hc-key": "pw-6743",
            "value": 4
        },
        {
            "hc-key": "pw-6747",
            "value": 5
        },
        {
            "hc-key": "pw-6749",
            "value": 6
        },
        {
            "hc-key": "pw-6751",
            "value": 7
        },
        {
            "hc-key": "pw-6752",
            "value": 8
        },
        {
            "hc-key": "pw-6746",
            "value": 9
        },
        {
            "hc-key": "pw-6744",
            "value": 10
        },
        {
            "hc-key": "pw-6748",
            "value": 11
        },
        {
            "hc-key": "pw-6745",
            "value": 12
        },
        {
            "hc-key": "pw-6750",
            "value": 13
        },
        {
            "hc-key": "pw-6739",
            "value": 14
        },
        {
            "hc-key": "pw-3596",
            "value": 15
        },
        {
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/pw/pw-all.js">Palau</a>'
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
            mapData: Highcharts.maps['countries/pw/pw-all'],
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
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/pw/pw-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
