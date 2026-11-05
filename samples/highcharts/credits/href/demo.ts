Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>credits.href</em> and <em>text</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    credits: {
        href: 'https://www.example.com',
        text: 'Example.com'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
