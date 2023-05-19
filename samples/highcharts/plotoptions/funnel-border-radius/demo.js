Highcharts.chart('container', {
    chart: {
        type: 'funnel'
    },
    accessibility: {
        enabled: false
    },
    title: {
        text: 'Funnel chart with rounded corners'
    },
    plotOptions: {
        series: {
            borderRadius: `${document.getElementById('range').value}`,
            borderWidth: 2,
            borderColor: '#666',
            dataLabels: {
                enabled: true
            },
            center: ['47%', '50%'],
            width: '90%'
        }
    },
    series: [{
        data: [
            ['Website visits', 15654],
            ['Downloads', 4064],
            ['Requested price list', 1987],
            ['Invoice sent', 1822]
        ]
    }],
    colors: ['#d7bfff', '#af80ff', '#5920b9', '#48208b']
});

const label = document.querySelector('label[for="range"]');
const updateLabel = input => {
    label.innerText = `${input.value}px`;

    const position = (input.value - input.min) / (input.max - input.min),
        percent = Math.round(position * 100),
        pxAdjust = Math.round(label.offsetWidth * position);
    label.style.left = `calc(${percent}% - ${pxAdjust}px)`;
};
updateLabel(document.getElementById('range'));

document.getElementById('range').addEventListener('input', e => {
    updateLabel(e.target);

    Highcharts.charts.forEach(chart => {
        chart.update({
            plotOptions: {
                series: {
                    borderRadius: e.target.value
                }
            }
        }, undefined, undefined, false);
    });
});

document.querySelectorAll('button.radius-mode').forEach(btn => {
    btn.addEventListener('click', () => {
        Highcharts.charts[0].update({
            plotOptions: {
                series: {
                    borderRadiusMode: btn.dataset.value
                }
            }
        });
    });
});

document.querySelectorAll('button.type').forEach(btn => {
    btn.addEventListener('click', () => {
        Highcharts.charts[0].update({
            chart: {
                type: btn.dataset.value
            },
            title: {
                text: btn.innerHTML + ' chart with rounded corners'
            }
        });
    });
});
