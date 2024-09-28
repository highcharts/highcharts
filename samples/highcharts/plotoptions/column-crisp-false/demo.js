Highcharts.chart('container', {

    title: {
        text: 'Crisp columns are disabled'
    },

    subtitle: {
        text: 'Resulting in blurry, but evenly spaced columns'
    },

    series: [{
        data: (function () {
            const arr = [];
            for (let i = 0; i < 100; i++) {
                arr.push(i);
            }
            return arr;
        }()),
        type: 'column',
        crisp: false
    }]

});
