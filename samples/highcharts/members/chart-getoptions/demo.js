const chart = Highcharts.chart('container', {
    series: [{
        data: [1, 4, 3, 5],
        type: 'column',
        colorByPoint: true,
        name: 'Animals'
    }],
    xAxis: {
        categories: ['Cats', 'Dogs', 'Sheep', 'Cows']
    }
});

document.getElementById('add-series').addEventListener('click', () => {
    chart.addSeries({
        data: [4, 2, 3, 1]
    });
});

document.getElementById('getoptions').addEventListener('click', () => {
    const options = chart.getOptions();
    document.getElementById('outputs').style.display = 'block';
    Highcharts.chart('container-output', options);

    document.getElementById('code-output').innerText = JSON.stringify(
        options, null, '  '
    );

});
