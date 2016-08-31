$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-mv-13075000",
            "value": 0
        },
        {
            "hc-key": "de-mv-13004000",
            "value": 1
        },
        {
            "hc-key": "de-mv-13073000",
            "value": 2
        },
        {
            "hc-key": "de-mv-13076000",
            "value": 3
        },
        {
            "hc-key": "de-mv-13072000",
            "value": 4
        },
        {
            "hc-key": "de-mv-13074000",
            "value": 5
        },
        {
            "hc-key": "de-mv-13071000",
            "value": 6
        },
        {
            "hc-key": "de-mv-13003000",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-mv-all.js">Mecklenburg-Vorpommern</a>'
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
            mapData: Highcharts.maps['countries/de/de-mv-all'],
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
