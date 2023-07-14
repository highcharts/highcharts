Highcharts.setOptions({
    colors: ['#01BAF2', '#71BF45', '#FFA500']
});

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Top 10 nuclear vs renewable energy producers (2011)'
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production">Wikipedia</a>'
    },
    xAxis: {
        categories: ['China', 'United States', 'Russia', 'India', 'Japan', 'Canada', 'Germany', 'France', 'South Korea', 'United Kingdom']
    },
    yAxis: {
        labels: {
            format: '{value} %'
        },
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
        shared: true
    },
    series: [
        {
            name: 'Hydropower',
            data: [14.8, 7.4, 15.7, 12.4, 8, 59, 2.9, 8, 0.9, 1.6]
        },
        {
            name: 'Other renewable',
            data: [2.2, 4.8, 0.1, 5, 4.2, 3.3, 17.6, 3.6, 0.6, 40.3]
        },
        {
            name: 'Nuclear',
            data: [1.8, 19.2, 16.4, 3.2, 9.8, 14.7, 17.9, 79.4, 29.8, 19.1]
        }
    ]
});
