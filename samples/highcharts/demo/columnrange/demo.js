Highcharts.chart('container', {
    dataTable: {
        columns: {
            Month: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            TempLow: [
                -9.5, -7.8, -13.1, -4.4, -1.0, 3.1, 8.9, 9.6,
                4.9, -5.2, -10.5, -12.1
            ],
            TempHigh: [
                8.0, 8.3, 9.2, 15.7, 20.8, 28.4, 27.0,
                23.0, 19.3, 11.6, 12.0, 8.5
            ]
        }
    },
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
        type: 'category'
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
            },
            dataMapping: {
                name: 'Month'
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Temperatures',
        dataMapping: {
            low: 'TempLow',
            high: 'TempHigh'
        }
    }]

});
