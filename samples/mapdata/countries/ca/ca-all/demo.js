$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-5682",
            "value": 0
        },
        {
            "hc-key": "ca-bc",
            "value": 1
        },
        {
            "hc-key": "ca-nu",
            "value": 2
        },
        {
            "hc-key": "ca-nt",
            "value": 3
        },
        {
            "hc-key": "ca-ab",
            "value": 4
        },
        {
            "hc-key": "ca-nl",
            "value": 5
        },
        {
            "hc-key": "ca-sk",
            "value": 6
        },
        {
            "hc-key": "ca-mb",
            "value": 7
        },
        {
            "hc-key": "ca-qc",
            "value": 8
        },
        {
            "hc-key": "ca-on",
            "value": 9
        },
        {
            "hc-key": "ca-nb",
            "value": 10
        },
        {
            "hc-key": "ca-ns",
            "value": 11
        },
        {
            "hc-key": "ca-pe",
            "value": 12
        },
        {
            "hc-key": "ca-yt",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-all.js">Canada</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-all'],
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
