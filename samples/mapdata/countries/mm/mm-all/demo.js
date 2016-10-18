$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mm-tn",
            "value": 0
        },
        {
            "hc-key": "mm-5760",
            "value": 1
        },
        {
            "hc-key": "mm-mo",
            "value": 2
        },
        {
            "hc-key": "mm-ra",
            "value": 3
        },
        {
            "hc-key": "mm-ay",
            "value": 4
        },
        {
            "hc-key": "mm-ch",
            "value": 5
        },
        {
            "hc-key": "mm-mg",
            "value": 6
        },
        {
            "hc-key": "mm-sh",
            "value": 7
        },
        {
            "hc-key": "mm-kh",
            "value": 8
        },
        {
            "hc-key": "mm-kn",
            "value": 9
        },
        {
            "hc-key": "mm-kc",
            "value": 10
        },
        {
            "hc-key": "mm-sa",
            "value": 11
        },
        {
            "hc-key": "mm-ba",
            "value": 12
        },
        {
            "hc-key": "mm-md",
            "value": 13
        },
        {
            "hc-key": "mm-ya",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mm/mm-all.js">Myanmar</a>'
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
            mapData: Highcharts.maps['countries/mm/mm-all'],
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
