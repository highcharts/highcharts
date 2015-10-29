$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "jo-ma",
            "value": 0
        },
        {
            "hc-key": "jo-ir",
            "value": 1
        },
        {
            "hc-key": "jo-aj",
            "value": 2
        },
        {
            "hc-key": "jo-ja",
            "value": 3
        },
        {
            "hc-key": "jo-ba",
            "value": 4
        },
        {
            "hc-key": "jo-md",
            "value": 5
        },
        {
            "hc-key": "jo-ka",
            "value": 6
        },
        {
            "hc-key": "jo-az",
            "value": 7
        },
        {
            "hc-key": "jo-aq",
            "value": 8
        },
        {
            "hc-key": "jo-mn",
            "value": 9
        },
        {
            "hc-key": "jo-am",
            "value": 10
        },
        {
            "hc-key": "jo-at",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/jo/jo-all.js">Jordan</a>'
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
            mapData: Highcharts.maps['countries/jo/jo-all'],
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
