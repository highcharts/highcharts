Highcharts.chart('container', {

    title: {
        text: 'यह है चार्ट का शीर्षक'
    },

    subtitle: {
        text: 'беручи до уваги, що <b>народи</b> Об <i>єднаних</i> Націй <b><i>підтвердили</i></b> в Статуті'
    },

    xAxis: {
        categories: ['ένα', 'δύο', 'τρία', 'τέσσερα']
    },

    series: [{
        data: [1, 3, 2, 4],
        type: 'column',
        colorByPoint: true,
        name: 'Αυτή είναι η σειρά'
    }],

    exporting: {
        pdfFont: {
            normal: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Regular.ttf',
            bold: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Bold.ttf',
            bolditalic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-BoldItalic.ttf',
            italic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Italic.ttf'
        }
    }

});