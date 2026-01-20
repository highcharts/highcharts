(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.alternateGridColor</em>'
        },
        yAxis: {
            alternateGridColor: '#2caffe19'
        },
        series: [{
            data: data
        }]
    });

})();
