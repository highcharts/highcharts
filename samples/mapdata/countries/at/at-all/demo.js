$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "at-wi",
            "value": 0
        },
        {
            "hc-key": "at-vo",
            "value": 1
        },
        {
            "hc-key": "at-bu",
            "value": 2
        },
        {
            "hc-key": "at-st",
            "value": 3
        },
        {
            "hc-key": "at-ka",
            "value": 4
        },
        {
            "hc-key": "at-oo",
            "value": 5
        },
        {
            "hc-key": "at-sz",
            "value": 6
        },
        {
            "hc-key": "at-tr",
            "value": 7
        },
        {
            "hc-key": "at-no",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/at/at-all.js">Austria</a>'
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
            mapData: Highcharts.maps['countries/at/at-all'],
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
