$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sl-so",
            "value": 0
        },
        {
            "hc-key": "sl-we",
            "value": 1
        },
        {
            "hc-key": "sl-no",
            "value": 2
        },
        {
            "hc-key": "sl-ea",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sl/sl-all.js">Sierra Leone</a>'
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
            mapData: Highcharts.maps['countries/sl/sl-all'],
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
