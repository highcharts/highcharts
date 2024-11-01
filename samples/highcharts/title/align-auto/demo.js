const text = 'Title auto alignment and downscaling demo';
Highcharts.chart('container', {
    title: {
        text,
        useHTML: false
    },
    subtitle: {
        text: 'Subtitle inherits align from title'
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }],
    exporting: {
        buttons: {
            contextButton: {
                y: -5
            }
        }
    }
});

document.getElementById('input-width').addEventListener('input', e => {
    Highcharts.charts[0].setSize(Number(e.target.value), undefined, false);
    document.getElementById('container').style.width = `${e.target.value}px`;
});

document.getElementById('short').addEventListener('click', () => {
    Highcharts.charts[0].setTitle({ text: 'Short title' });
});

document.getElementById('long').addEventListener('click', () => {
    Highcharts.charts[0].setTitle({ text });
});

document.getElementById('exporting').addEventListener('click', e => {
    Highcharts.charts[0].update({
        exporting: {
            enabled: e.target.checked
        }
    });
});
