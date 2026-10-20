Highcharts.chart('container', {
    dataTable: {
        columns: {
            Month: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            TempLow: [
                -11, -10.4, -4.5, -0.5, 0.9, 4.6, 7.9, 6.6, 2.6, -1.7, -7.8,
                -5.2
            ],
            TempHigh: [
                9.6, 9.9, 16.5, 17.6, 22.3, 24.8, 30.3, 24.6, 24.3, 16.6, 12.1,
                10.3
            ]
        }
    },
    chart: {
        type: 'columnrange',
        inverted: true
    },

    accessibility: {
        description: 'Image description: A column range chart compares the ' +
            'monthly temperature variations throughout 2025 in Vik i Sogn, ' +
            'Norway. The chart is interactive and displays the temperature ' +
            'range for each month when hovering over the data. The ' +
            'temperature is measured in degrees Celsius on the X-axis and ' +
            'the months are plotted on the Y-axis. The lowest temperature is ' +
            'recorded in January at minus 11 Celsius. The lowest range of ' +
            'temperatures is found in December ranging from a low of -5.2 ' +
            'to a high of 10.3 Celsius. The highest temperature is found in ' +
            'July at 28.4 Celsius, and has the highest range of temperatures ' +
            'from 7.9 up to 30.3'
    },

    title: {
        text: 'Temperature variation by month'
    },

    subtitle: {
        text: 'Observed in Vik i Sogn, Norway, 2025 | ' +
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
