const nav = Highcharts.navigator('container', {
    navigator: {
        series: [{
            data: Array.from({length: 50}, (_, x) => Math.floor(Math.sin(x / 10) * 20))
        }]
    }
})


const chart1 = Highcharts.chart('chart1', {
    series:[{
        data: Array.from({length: 50}, (_, x) => Math.floor(Math.sin(x / 10) * 20))
    }]
})

const chart2 = Highcharts.chart('chart2', {
    series:[{
        data: Array.from({length: 50}, (_, x) => Math.floor(Math.cos(x / 10) * 20))
    }]
})


nav.bind(chart1);
nav.bind(chart2.xAxis[0]);