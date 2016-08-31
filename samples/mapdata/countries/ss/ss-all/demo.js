$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ss-we",
            "value": 0
        },
        {
            "hc-key": "ss-619",
            "value": 1
        },
        {
            "hc-key": "ss-un",
            "value": 2
        },
        {
            "hc-key": "ss-jg",
            "value": 3
        },
        {
            "hc-key": "ss-wh",
            "value": 4
        },
        {
            "hc-key": "ss-wr",
            "value": 5
        },
        {
            "hc-key": "ss-wb",
            "value": 6
        },
        {
            "hc-key": "ss-ee",
            "value": 7
        },
        {
            "hc-key": "ss-nb",
            "value": 8
        },
        {
            "hc-key": "ss-eb",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ss/ss-all.js">South Sudan</a>'
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
            mapData: Highcharts.maps['countries/ss/ss-all'],
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
