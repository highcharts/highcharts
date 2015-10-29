$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "zm-lp",
            "value": 0
        },
        {
            "hc-key": "zm-no",
            "value": 1
        },
        {
            "hc-key": "zm-ce",
            "value": 2
        },
        {
            "hc-key": "zm-ea",
            "value": 3
        },
        {
            "hc-key": "zm-ls",
            "value": 4
        },
        {
            "hc-key": "zm-co",
            "value": 5
        },
        {
            "hc-key": "zm-nw",
            "value": 6
        },
        {
            "hc-key": "zm-so",
            "value": 7
        },
        {
            "hc-key": "zm-we",
            "value": 8
        },
        {
            "hc-key": "zm-mu",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/zm/zm-all.js">Zambia</a>'
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
            mapData: Highcharts.maps['countries/zm/zm-all'],
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
