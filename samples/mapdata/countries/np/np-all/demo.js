$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "np-750",
            "value": 0
        },
        {
            "hc-key": "np-751",
            "value": 1
        },
        {
            "hc-key": "np-752",
            "value": 2
        },
        {
            "hc-key": "np-753",
            "value": 3
        },
        {
            "hc-key": "np-754",
            "value": 4
        },
        {
            "hc-key": "np-755",
            "value": 5
        },
        {
            "hc-key": "np-756",
            "value": 6
        },
        {
            "hc-key": "np-757",
            "value": 7
        },
        {
            "hc-key": "np-354",
            "value": 8
        },
        {
            "hc-key": "np-1278",
            "value": 9
        },
        {
            "hc-key": "np-746",
            "value": 10
        },
        {
            "hc-key": "np-747",
            "value": 11
        },
        {
            "hc-key": "np-748",
            "value": 12
        },
        {
            "hc-key": "np-749",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/np/np-all.js">Nepal</a>'
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
            mapData: Highcharts.maps['countries/np/np-all'],
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
