Highcharts.chart('container', {
    exporting: {
        chartOptions: {
            chart: {
                style: {
                    fontFamily: 'NotoSans-Regular'
                }
            }
        },
        pdfFontURL: 'https://utils.highcharts.com/samples/data/NotoSans-Regular-normal.js'
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