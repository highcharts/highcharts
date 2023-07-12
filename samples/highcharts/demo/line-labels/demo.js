// Data retrieved https://www.yr.no/nb/historikk/tabell/1-92416/Norway/Vestland/Bergen/Bergen?q=siste-13-m%C3%A5neder
// https://www.yr.no/nb/historikk/tabell/5-53070/Norge/Vestland/Vik/Vik%20i%20Sogn?q=siste-13-m%C3%A5neder
// https://www.yr.no/nb/historikk/tabell/5-15660/Norge/Innlandet/Skj%C3%A5k/Skj%C3%A5k%20(Austin)?q=siste-13-m%C3%A5neder

Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Monthly Average Rainfall'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.yr.no" ' +
            'target="_blank">www.yr.no</a>'
    },
    xAxis: {
        categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
        title: {
            text: 'Rainfall (mm)'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Vik i sogn',
        color: '#f50aed',
        data: [45.3, 80.8, 86.8, 47.9, 155.4, 76.2, 86.1, 163.3, 161.5, 81.1,
            12.6, 34.0, 23.2]
    }, {
        name: 'Bergen',
        color: '#051efc',
        data: [164.1, 233.4, 169.2, 163.7, 304.6, 190.7, 226.5, 297.8, 260.1,
            181.0, 42.8, 81.9, 67.8]
    }, {
        name: 'Skjåk',
        color: '#0df201',
        data: [47.2, 31.3, 46.0, 51.2, 46.8, 25.5, 22.8, 21.2, 47.1,
            12.1, 15.1, 16.5, 22.9]
    }]
});