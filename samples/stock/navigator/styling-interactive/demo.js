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
            selected: 4
        }
    });

    // Set navigator mask to outside/inside
    const toggleMaskButton = document.getElementById('toggle-mask');
    toggleMaskButton.addEventListener('click', () => {
        const maskInside = chart.navigator.navigatorOptions.maskInside;

        chart.update({
            navigator: {
                maskInside: !maskInside
            }
        });

        toggleMaskButton.innerText =
            `Set mask to ${maskInside ? 'inside' : 'outside'}`;
    });
    // Set and change navigator mask fill
    const maskFillInput = document.getElementById('navigator-mask-fill');
    maskFillInput.value = '#667aff';
    maskFillInput.addEventListener('change', e => {
        const maskFill = e.target.value;
        chart.update({
            navigator: {
                maskFill: maskFill + '4d'
            }
        });
    });
    // Set and change navigator outline color
    const outlineInput = document.getElementById('navigator-outline-color');
    outlineInput.value = chart.navigator.navigatorOptions.outlineColor;
    outlineInput.addEventListener('change', e => {
        const outlineColor = e.target.value;
        chart.update({
            navigator: {
                outlineColor: outlineColor
            }
        });
    });
    // Set and change outline width
    const outlineWidthInput = document.getElementById('navigator-slider');
    outlineWidthInput.value = chart.navigator.navigatorOptions.outlineWidth;
    outlineWidthInput.addEventListener('input', e => {
        const outlineWidth = parseInt(e.target.value, 10);
        chart.update({
            navigator: {
                outlineWidth: outlineWidth
            }
        });
    });
})();