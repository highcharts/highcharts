Highcharts.chart('container', {

    chart: {
        styledMode: true
    },

    title: {
        text: 'Styling with prefers-color-scheme'
    },

    xAxis: {
        width: '40%',
        type: 'category'
    },

    yAxis: {
        width: '40%',
        title: {
            text: 'kg'
        }
    },

    series: [{
        type: 'pie',
        allowPointSelect: true,
        keys: ['name', 'y', 'selected', 'sliced'],
        data: [
            ['Apples', 29.9, false],
            ['Pears', 71.5, false],
            ['Oranges', 106.4, false],
            ['Plums', 129.2, false],
            ['Bananas', 144.0, false],
            ['Peaches', 176.0, false],
            ['Prunes', 135.6, true, true],
            ['Avocados', 148.5, false]
        ],
        showInLegend: true,
        center: ['75%', '50%']
    }, {
        type: 'column',
        keys: ['name', 'y'],
        data: [
            ['Apples', 29.9, false],
            ['Pears', 71.5, false],
            ['Oranges', 106.4, false],
            ['Plums', 129.2, false],
            ['Bananas', 144.0, false],
            ['Peaches', 176.0, false],
            ['Prunes', 135.6, true, true],
            ['Avocados', 148.5, false]
        ],
        colorByPoint: true,
        showInLegend: false
    }]
});

[...document.querySelectorAll('input[name="color-mode"]')]
    .forEach(input => {
        input.addEventListener('click', e => {
            document.getElementById('container').className =
                e.target.value === 'none' ? '' : `highcharts-${e.target.value}`;
        });
    });