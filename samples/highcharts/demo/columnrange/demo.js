Highcharts.chart('container', {

    chart: {
        type: 'columnrange',
        inverted: true
    },

    accessibility: {
        description: 'Image description: A column range chart compares the ' +
            'monthly temperature variations throughout 2023 in Vik i Sogn, ' +
            'Norway. The chart is interactive and displays the temperature ' +
            'range for each month when hovering over the data. The ' +
            'temperature is measured in degrees Celsius on the X-axis and ' +
            'the months are plotted on the Y-axis. The lowest temperature is ' +
            'recorded in March at minus 13.1 Celsius. The lowest range of ' +
            'temperatures is found in September ranging from a low of 9.6 ' +
            'to a high of 23.0 Celsius. The highest temperature is found in ' +
            'June at 28.4 Celsius, and has the highest range of temperatures ' +
            'from 3.1 up to 28.4'
    },

    title: {
        text: 'Temperature variation by month'
    },

    subtitle: {
        text: 'Observed in Vik i Sogn, Norway, 2023 | ' +
            'Source: <a href="https://www.vikjavev.no/ver/" target="_blank">Vikjavev</a>'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
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
            [-9.5, 8.0],
            [-7.8, 8.3],
            [-13.1, 9.2],
            [-4.4, 15.7],
            [-1.0, 20.8],
            [3.1, 28.4],
            [8.9, 27.0],
            [9.6, 23.0],
            [4.9, 19.3],
            [-5.2, 11.6],
            [-10.5, 12.0],
            [-12.1, 8.5]
        ]
    }]

});
