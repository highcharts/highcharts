// Define data with both full names and abbreviations
const cities = [
    { fullName: 'Tokyo', abbr: 'TKY', value: 37.33 },
    { fullName: 'Delhi', abbr: 'DL', value: 31.18 },
    { fullName: 'Shanghai', abbr: 'SH', value: 27.79 },
    { fullName: 'Sao Paulo', abbr: 'SP', value: 22.23 },
    { fullName: 'Mexico City', abbr: 'MC', value: 21.91 },
    { fullName: 'Dhaka', abbr: 'DH', value: 21.74 },
    { fullName: 'Cairo', abbr: 'CAI', value: 21.32 },
    { fullName: 'Beijing', abbr: 'BJ', value: 20.89 },
    { fullName: 'Mumbai', abbr: 'MB', value: 20.67 },
    { fullName: 'Osaka', abbr: 'OSK', value: 19.11 },
    { fullName: 'Karachi', abbr: 'KHI', value: 16.45 },
    { fullName: 'Chongqing', abbr: 'CQ', value: 16.38 },
    { fullName: 'Istanbul', abbr: 'IST', value: 15.41 },
    { fullName: 'Buenos Aires', abbr: 'BA', value: 15.25 },
    { fullName: 'Kolkata', abbr: 'KOL', value: 14.974 },
    { fullName: 'Kinshasa', abbr: 'KIN', value: 14.970 },
    { fullName: 'Lagos', abbr: 'LG', value: 14.86 },
    { fullName: 'Manila', abbr: 'MN', value: 14.16 },
    { fullName: 'Tianjin', abbr: 'TJ', value: 13.79 },
    { fullName: 'Guangzhou', abbr: 'GZ', value: 13.64 }
];

// Create city data
const cityData = cities.map(city => ({ name: city.fullName, y: city.value }));

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'World\'s largest cities per 2021'
    },
    subtitle: {
        text: 'Source: <a href="https://worldpopulationreview.com/world-cities" target="_blank">World Population Review</a>'
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Population in 2021: <b>{point.y:.1f} millions</b>'
    },
    series: [{
        name: 'Population',
        colors: [
            '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
            '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
            '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
            '#03c69b',  '#00f194'
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: cityData,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                xAxis: {
                    labels: {
                        formatter: function () {
                            const city = cities
                                .find(city => city.fullName === this.value);
                            return city.abbr;
                        },
                        rotation: -90,
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                series: [{
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }]
    }
});
