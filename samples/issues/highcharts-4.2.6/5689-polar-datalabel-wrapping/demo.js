$(function () {

    var category = "first first first first first first first <br/> second second second <br/> third third third third";

    $('#container').highcharts({
        "title": {
            "text": "'first', 'second', and 'third', should be on their own individual lines"
        },
        "chart": {
            "polar": true
        },
        "series": [{
            "data": [5, 4, 2, 6, 7, 8]
        }],
        "xAxis": {
            "labels": {
                "style": {
                    "whiteSpace": "nowrap"
                }
            },
            "categories": [
                category,
                category,
                category,
                category,
                category,
                category
            ]
        }
    });
});
