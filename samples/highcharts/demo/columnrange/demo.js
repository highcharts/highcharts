Highcharts.chart('container', {

    chart: {
        type: 'columnrange',
        inverted: true
    },

    accessibility: {
        description: 'Image description: A column range chart compares the monthly temperature variations throughout 2021 in Vik I Sogn, Norway. The chart is interactive and displays the temperature range for each month when hovering over the data. The temperature is measured in degrees Celsius on the X-axis and the months are plotted on the Y-axis. The lowest temperature is recorded in February at minus 16.7 Celsius. The lowest range of temperatures is found in March ranging from a low of minus 4.7 to a high of 11.6 Celsius. The highest temperature is found in June at 29.4 Celsius. May has the highest range of temperatures from minus 2.5 to 27.2 Celsius. The broadest range of temperatures is also found in May ranging from a low of minus 2.1 to a high of 27.2 Celsius.'
    },

    title: {
        text: 'Temperature variation by month'
    },

    subtitle: {
        text: 'Observed in Vik i Sogn, Norway, 2021 | ' +
            'Source: <a href="https://www.vikjavev.no/ver/" target="_blank">Vikjavev</a>'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        title: {
            text: 'Temperature ( °C )'
        }
    },

    tooltip: {
        valueSuffix: '°C'
    },

    plotOptions: {
        columnrange: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true,
                format: '{y}°C'
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Temperatures',
        data: [
            [-13.9, 5.2],
            [-16.7, 10.6],
            [-4.7, 11.6],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [5.9, 29.4],
            [6.5, 29.1],
            [4.7, 25.4],
            [4.3, 21.6],
            [-3.5, 15.1],
            [-9.8, 12.5],
            [-11.5, 8.4]
        ]
    }]

});
