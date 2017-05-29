(function (H) {
    H.chart('container', {
        series: [{
            type: 'wordcloud',
            data: [{
                name: "Words",
                y: 10
            }, {
                name: "dont",
                y: 5
            }, {
                name: "come",
                y: 3
            }, {
                name: "easy",
                y: 1
            }]
        }]
    });
}(Highcharts));