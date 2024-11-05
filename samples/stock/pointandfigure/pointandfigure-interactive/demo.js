(async () => {
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        title: {
            text: 'Point and Figure series'
        },
        series: [{
            type: 'pointandfigure',
            boxSize: 3,
            reversalAmount: 2,
            data
        }]
    });

    const markerUpColorInput =
        document.getElementById('navigator-markerup-color');
    markerUpColorInput.value = chart.series[0].options.markerUp.lineColor;
    markerUpColorInput.addEventListener('change', e => {
        const markerUpColor = e.target.value;
        chart.series[0].update({
            markerUp: {
                lineColor: markerUpColor
            }
        });
    });

    const markerColorInput =
        document.getElementById('navigator-marker-color');
    markerColorInput.value = chart.series[0].options.marker.lineColor;
    markerColorInput.addEventListener('change', e => {
        const markerColor = e.target.value;
        chart.series[0].update({
            marker: {
                lineColor: markerColor
            }
        });
    });

    const boxSizeInput = document.getElementById('box-size-input');
    boxSizeInput.value = chart.series[0].options.boxSize;
    boxSizeInput.addEventListener('input', e => {
        const boxSize = +e.target.value;
        chart.series[0].update({
            boxSize: boxSize
        });
    });

    const reversalAmountInput =
        document.getElementById('reversal-amount-input');
    reversalAmountInput.value = chart.series[0].options.reversalAmount;
    reversalAmountInput.addEventListener('input', e => {
        const reversalAmount = +e.target.value;
        chart.series[0].update({
            reversalAmount: reversalAmount
        });
    });
})();