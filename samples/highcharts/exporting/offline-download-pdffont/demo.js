Highcharts.chart('container', {
    exporting: {
        pdfFont: {
            name: 'NotoSans-Regular',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@452d4a50/samples/data/NotoSans-Regular-normal.js'
        }
    },

    title: {
        text: 'सभमन'
    },

    subtitle: {
        text: 'беручи до уваги, що народи Об єднаних Націй підтвердили в Статуті'
    },
    series: [{
        data: [1, 2, 3, 4, 5]
    }]
});