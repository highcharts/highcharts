$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ag-6313",
            "value": 0
        },
        {
            "hc-key": "ag-6598",
            "value": 1
        },
        {
            "hc-key": "ag-6599",
            "value": 2
        },
        {
            "hc-key": "ag-6600",
            "value": 3
        },
        {
            "hc-key": "ag-6601",
            "value": 4
        },
        {
            "hc-key": "ag-6602",
            "value": 5
        },
        {
            "hc-key": "ag-6603",
            "value": 6
        },
        {
            "hc-key": "ag-6604",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ag/ag-all.js">Antigua and Barbuda</a>'
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
            mapData: Highcharts.maps['countries/ag/ag-all'],
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
