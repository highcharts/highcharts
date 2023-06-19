const chart = Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Highcharts interpolation study'
    },

    xAxis: {
        type: 'datetime'
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ],
        min: -5,
        max: 25
    },

    series: [{
        colsize: 24 * 36e5, // one day
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }]
});

const colSlider = document.getElementById('col-range');
const colSliderOutput = document.getElementById('col-slider-output');
colSliderOutput.innerHTML = `${colSlider.value} * 36e5`;

colSlider.addEventListener('input', () => {
    colSliderOutput.innerHTML = `${colSlider.value} * 36e5`;
    chart.series[0].update(
        {
            colsize: colSlider.value * 36e5
        }
    );
});

document.getElementById('interpolation-toggle').addEventListener('click', e => {
    chart.series[0].update({
        interpolation: e.target.checked
    });
});

document.getElementById('data-toggle').addEventListener('click', e => {
    chart.series[0].update(
        {
            data: e.target.checked ?
                [
                    { x: 0, y: 0, value: 1 },
                    { x: 1, y: 1, value: 20 },
                    { x: 2, y: 2, value: 12 },
                    { x: 3, y: 3, value: 8 }
                ] :
                JSON.parse(document.getElementById('data').innerText)
        }
    );
});
