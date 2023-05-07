Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Top Headline Phrases'
    },
    subtitle: {
        text: 'Source: <a href="http://buzzsumo.com/blog/most-shared-headlines-study/">buzzsumo</a>'
    },
    xAxis: {
        categories: ['will make you', 'this is why', 'can we guess', 'only X in', 'the reason is', 'are freaking out', 'X stunning photos', 'tears of joy', 'is what happens', 'make you cry', 'give you gossebumps', 'talking about it', 'is too cute', 'shocked to see', 'melt your heart', 'X things only', 'can\'t stop laughing', 'top X songs', 'twitter reacts to', 'what happened next'],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        max: 9000,
        title: {
            text: 'Average Facebook Engagements'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        formatter: function () {
            return 'This trigrams "<b> ' + this.x + ' </b>" was used <b>' + this.y + '</b>';
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Year 1800',
        data: [8961, 4099, 3199, 2398, 1610, 1560, 1425, 1388, 1337, 1287,
            1278, 1265, 1261, 1257, 1233, 1227, 1142, 1092, 1062, 1060]
    }]
});
