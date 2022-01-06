Highcharts.chart('container', {

    title: {
        text: '阿拉伯数字'
    },

    subtitle: {
        text: 'беручи до уваги, що <b>народи</b> Об <i>єднаних</i> Націй <b><i>підтвердили</i></b> в Статуті'
    },

    series: [{
        data: [1, 2, 3, 4, 5],
        name: ''
    }],

    exporting: {
        pdfFont: {
            enabled: undefined
        }
    }

});