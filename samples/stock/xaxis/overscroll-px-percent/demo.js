Highcharts.setOptions({
    global: {
        useUTC: false
    },
    rangeSelector: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointStart: Date.UTC(2017, 0, 1),
            pointInterval: 1000 // 1s
        }
    }
});

const generateRandomData = () => {
    // generate an array of random data
    const data = [];

    for (let i = 0; i <= 1000; i += 1) {
        data.push(
            Math.round(Math.random() * 100)
        );
    }
    return data;
};

Highcharts.stockChart('container1', {
    title: {
        text: 'Overscroll set in percentage'
    },
    xAxis: {
        overscroll: '50%'
    },
    navigator: {
        xAxis: {
            overscroll: '50%'
        }
    },
    series: [{
        data: generateRandomData()
    }]
});

Highcharts.stockChart('container2', {
    title: {
        text: 'Overscroll set in pixels'
    },
    xAxis: {
        overscroll: '600px'
    },
    navigator: {
        xAxis: {
            overscroll: '600px'
        }
    },
    series: [{
        data: generateRandomData()
    }]
});
