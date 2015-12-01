$(function () {

    $('#container').highcharts({
        chart: {
            "type": "pie",
            plotBackgroundColor: '#EFEFFF',
            width: 600,
            height: 243
        },
        credits: {
            enabled: false
        },
        title: {
            "text": null
        },
        // now the data
        series: [{
            "name": "Value",
            "showInLegend": true,
            "dataLabels": {
                "format": "{y:,f}"
            },
            minSize:150,
            data: [{
                name: "641397 (Description 641397)",
                y: 46115816.00
            }, {
                name: "641402 (Description 641402)",
                y: 23509037.00
            }, {
                name: "641396 (Description 641396)",
                y: 18884796.00
            }, {
                name: "641403 (Description 641403)",
                y: 11970798.00
            }, {
                name: "641410 (Description 641410)",
                y: 11116887.00
            }, {
                name: "641401 (Description 641401)",
                y: 10716092.00
            }, {
                name: "641408 (Description 641408)",
                y: 2195030.00
            }, {
                name: "641406 (Description 641406)",
                y: 1532110.00
            }, {
                name: "641399 (Description 641399)",
                y: 581743.00
            }, {
                name: "Rest",
                y: 214834.00
            }, {
                name: "Non-Bankable Assets",
                y: 26951036.00
            }]
        }]
    });

});