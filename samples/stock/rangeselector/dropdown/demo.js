(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        chart: {
            type: 'arearange',
            width: 400
        },
        rangeSelector: {
            selected: 2
        },
        title: {
            text: 'RangeSelector dropdown demo'
        },
        tooltip: {
            valueSuffix: '°C'
        },
        series: [{
            name: 'Temperatures',
            data: data
        }]
    });


    document.getElementById('dropdown').addEventListener('click', e => {
        const dropdown = e.target.dataset.dropdown;
        if (dropdown) {
            chart.update({
                rangeSelector: {
                    dropdown
                }
            });
        }
    });

    document.getElementById('width').addEventListener('click', e => {
        const width = e.target.dataset.width;
        if (width) {
            chart.setSize(width);
        }
    });

})();