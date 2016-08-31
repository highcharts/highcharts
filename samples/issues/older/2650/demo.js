$(function () {
    $('#container').highcharts({
        "title": {
            "text": "Data label was mispositioned due to rounding error, Highcharts 3.0.9"
        },
        "series": [{
            "type": "pie",
            "dataLabels": {
                "color": "#FFFFFF",
                "distance": -20,
                backgroundColor: 'black'
            },
            "data": [{
                "y": 1,
                "name": "Label"
            }],
            "size": 239.6
        }]
    });
});