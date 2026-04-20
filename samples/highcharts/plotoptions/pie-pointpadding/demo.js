const chart = Highcharts.chart('container', {
    series: [{
        type: 'pie',
        data: [6, 0.3, 3, 2, 4, 2, 26, 1],
        borderRadius: '5%',
        innerSize: '50%',
        pointPadding: 10
    }]
});

const paddingSlider = document.getElementById('padding-slider');
const paddingValue = document.getElementById('padding-value');
const innerSlider = document.getElementById('inner-slider');
const innerValue = document.getElementById('inner-value');

paddingSlider.addEventListener('input', () => {
    const pointPadding = Number(paddingSlider.value);
    paddingValue.textContent = String(pointPadding);

    chart.update({
        series: [{
            pointPadding
        }]
    }, true, false);
});

innerSlider.addEventListener('input', () => {
    const innerSize = Number(innerSlider.value);
    innerValue.textContent = String(innerSize);

    chart.update({
        series: [{
            innerSize: `${innerSize}%`
        }]
    }, true, false);
});
