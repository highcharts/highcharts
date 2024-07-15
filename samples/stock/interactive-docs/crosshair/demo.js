(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: data
        }],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        xAxis: {
            crosshair: true
        },
        yAxis: {
            crosshair: true
        }
    });

    // Toggle xAxis crosshair
    const toggleXAxisCrosshair =
        document.getElementById('toggle-xaxis-crosshair');

    toggleXAxisCrosshair.addEventListener('click', () => {
        const crosshairEnabled = chart.xAxis[0].crosshair;

        chart.xAxis[0].update({
            crosshair: !crosshairEnabled
        });

        toggleXAxisCrosshair.innerText =
        `${crosshairEnabled ? 'Enable' : 'Disable'} xAxis crosshair`;
    });

    // Toggle yAxis crosshair
    const toggleYAxisCrosshair =
        document.getElementById('toggle-yaxis-crosshair');

    toggleYAxisCrosshair.addEventListener('click', () => {
        const crosshairEnabled = chart.yAxis[0].crosshair;

        chart.yAxis[0].update({
            crosshair: !crosshairEnabled
        });

        toggleYAxisCrosshair.innerText =
        `${crosshairEnabled ? 'Enable' : 'Disable'} yAxis crosshair`;
    });

    let isCrosshairSnapping = true;
    // Toggle crosshair snap
    const toggleCrosshairSnap =
        document.getElementById('toggle-crosshair-snap');

    toggleCrosshairSnap.addEventListener('click', () => {
        chart.xAxis[0].update({
            crosshair: {
                snap: !isCrosshairSnapping
            }
        }, false);
        chart.yAxis[0].update({
            crosshair: {
                snap: !isCrosshairSnapping
            }
        }, false);
        chart.redraw();

        toggleCrosshairSnap.innerText =
        `${isCrosshairSnapping ? 'Enable' : 'Disable'} crosshair snapping`;

        isCrosshairSnapping = !isCrosshairSnapping;
    });


})();
