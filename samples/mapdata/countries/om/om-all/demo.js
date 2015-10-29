$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "om-ss",
            "value": 0
        },
        {
            "hc-key": "om-ja",
            "value": 1
        },
        {
            "hc-key": "om-mu",
            "value": 2
        },
        {
            "hc-key": "om-wu",
            "value": 3
        },
        {
            "hc-key": "om-da",
            "value": 4
        },
        {
            "hc-key": "om-za",
            "value": 5
        },
        {
            "hc-key": "om-bn",
            "value": 6
        },
        {
            "hc-key": "om-ma",
            "value": 7
        },
        {
            "hc-key": "om-bu",
            "value": 8
        },
        {
            "hc-key": "om-sh",
            "value": 9
        },
        {
            "hc-key": "om-bs",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/om/om-all.js">Oman</a>'
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
            mapData: Highcharts.maps['countries/om/om-all'],
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
