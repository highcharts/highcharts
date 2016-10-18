$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ni-as",
            "value": 0
        },
        {
            "hc-key": "ni-an",
            "value": 1
        },
        {
            "hc-key": "ni-224",
            "value": 2
        },
        {
            "hc-key": "ni-6330",
            "value": 3
        },
        {
            "hc-key": "ni-ca",
            "value": 4
        },
        {
            "hc-key": "ni-gr",
            "value": 5
        },
        {
            "hc-key": "ni-ji",
            "value": 6
        },
        {
            "hc-key": "ni-le",
            "value": 7
        },
        {
            "hc-key": "ni-mn",
            "value": 8
        },
        {
            "hc-key": "ni-ms",
            "value": 9
        },
        {
            "hc-key": "ni-ci",
            "value": 10
        },
        {
            "hc-key": "ni-es",
            "value": 11
        },
        {
            "hc-key": "ni-md",
            "value": 12
        },
        {
            "hc-key": "ni-mt",
            "value": 13
        },
        {
            "hc-key": "ni-ns",
            "value": 14
        },
        {
            "hc-key": "ni-bo",
            "value": 15
        },
        {
            "hc-key": "ni-co",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ni/ni-all.js">Nicaragua</a>'
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
            mapData: Highcharts.maps['countries/ni/ni-all'],
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
