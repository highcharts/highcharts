$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-sn-14522000",
            "value": 0
        },
        {
            "hc-key": "de-sn-14511000",
            "value": 1
        },
        {
            "hc-key": "de-sn-14626000",
            "value": 2
        },
        {
            "hc-key": "de-sn-14521000",
            "value": 3
        },
        {
            "hc-key": "de-sn-14523000",
            "value": 4
        },
        {
            "hc-key": "de-sn-14524000",
            "value": 5
        },
        {
            "hc-key": "de-sn-14729000",
            "value": 6
        },
        {
            "hc-key": "de-sn-14612000",
            "value": 7
        },
        {
            "hc-key": "de-sn-14627000",
            "value": 8
        },
        {
            "hc-key": "de-sn-14628000",
            "value": 9
        },
        {
            "hc-key": "de-sn-14625000",
            "value": 10
        },
        {
            "hc-key": "de-sn-14713000",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-sn-all.js">Sachsen</a>'
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
            mapData: Highcharts.maps['countries/de/de-sn-all'],
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
