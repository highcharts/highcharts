const notifyOnUnload = () => {
    console.error('beforeunload was triggered'); // It should not be

    setTimeout(
        () => {
            window.removeEventListener('beforeunload', notifyOnUnload);
        },
        500
    );
};

const chart = Highcharts.chart('container', {
    chart: {
        height: 200
    },
    title: {
        text: 'Export test'
    },
    credits: {
        enabled: false
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ],
        showInLegend: false
    }],
    exporting: {
        enabled: true
    }
});


document.getElementById('export-button').addEventListener('click', () => {
    window.addEventListener('beforeunload', notifyOnUnload, { once: true });

    chart.exportChart();
});
