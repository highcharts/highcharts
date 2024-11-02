Highcharts.chart('container', {
    title: {
        text: document.getElementById('title-input').value
    },
    subtitle: {
        text: document.getElementById('subtitle-input').value
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

document.getElementById('title-input').addEventListener('keyup', e => {
    Highcharts.charts[0].setTitle({ text: e.target.value });
});

document.getElementById('subtitle-input').addEventListener('keyup', e => {
    Highcharts.charts[0].setTitle(undefined, { text: e.target.value });
});

document.getElementById('usehtml').addEventListener('click', e => {
    Highcharts.charts[0].update({
        title: {
            useHTML: e.target.checked
        },
        subtitle: {
            useHTML: e.target.checked
        }
    });
});

document.getElementById('exporting').addEventListener('click', e => {
    Highcharts.charts[0].update({
        exporting: {
            enabled: e.target.checked
        }
    });
});
