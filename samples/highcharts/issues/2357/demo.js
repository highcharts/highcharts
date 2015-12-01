$(function () {
    $('#container').highcharts({
        title: {
            text: "Reading point names from different series.<br/>Categories should be Apr, May, Jun."
        },
        "series": [{
            "data": [{
                x: 5,
                "name": "May",
                "y": 366
            }],
            "name": "Alpha"
        }, {
            "data": [{
                x: 4,
                "name": "Apr",
                "y": 984
            }, {
                x: 5,
                "name": "May",
                "y": 4800
            }, {
                x: 6,
                "name": "Jun",
                "y": 5429
            }],
            "name": "Beta"
        }, {
            "data": [{
                x: 5,
                "name": "May",
                "y": 280
            }, {
                x: 6,
                "name": "Jun",
                "y": 899
            }],
            "name": "Gamma"
        }],
        "xAxis": {
            "type": "category"
        }
    });
});