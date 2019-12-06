var dataName = function (flagNumber) {
    return '<span><img src="https://image.flaticon.com/icons/svg/197/' + flagNumber + '.svg" style="width: 40px; height: 40px;"/><br></span>';
};

var dataPrev = {
    2016: [
        [0, 'South Korea'],
        [0, 'Japan'],
        [0, 'Australia'],
        [11, 'Germany'],
        [24, 'Russia'],
        [38, 'China'],
        [29, 'Great Britain'],
        [46, 'United States']
    ],
    2012: [
        [13, 'South Korea'],
        [0, 'Japan'],
        [0, 'Australia'],
        [0, 'Germany'],
        [22, 'Russia'],
        [51, 'China'],
        [19, 'Great Britain'],
        [36, 'United States']
    ],
    2008: [
        [0, 'South Korea'],
        [0, 'Japan'],
        [0, 'Australia'],
        [13, 'Germany'],
        [27, 'Russia'],
        [32, 'China'],
        [9, 'Great Britain'],
        [37, 'United States']
    ],
    2004: [
        [0, 'South Korea'],
        [5, 'Japan'],
        [16, 'Australia'],
        [0, 'Germany'],
        [32, 'Russia'],
        [28, 'China'],
        [0, 'Great Britain'],
        [36, 'United States']
    ],
    2000: [
        [0, 'South Korea'],
        [0, 'Japan'],
        [9, 'Australia'],
        [20, 'Germany'],
        [26, 'Russia'],
        [16, 'China'],
        [0, 'Great Britain'],
        [44, 'United States']
    ]
};

var data = {
    2016: [
        [0, dataName(197582), 'rgb(201, 36, 39)'],
        [0, dataName(197604), 'rgb(201, 36, 39)'],
        [0, dataName(197507), 'rgb(0, 82, 180)'],
        [17, dataName(197571), 'rgb(0, 0, 0)'],
        [19, dataName(197408), 'rgb(240, 240, 240)'],
        [26, dataName(197375), 'rgb(255, 217, 68)'],
        [27, dataName(197374), 'rgb(0, 82, 180)'],
        [46, dataName(197484), 'rgb(215, 0, 38)']
    ],
    2012: [
        [13, dataName(197582), 'rgb(201, 36, 39)'],
        [0, dataName(197604), 'rgb(201, 36, 39)'],
        [0, dataName(197507), 'rgb(0, 82, 180)'],
        [0, dataName(197571), 'rgb(0, 0, 0)'],
        [24, dataName(197408), 'rgb(240, 240, 240)'],
        [38, dataName(197375), 'rgb(255, 217, 68)'],
        [29, dataName(197374), 'rgb(0, 82, 180)'],
        [46, dataName(197484), 'rgb(215, 0, 38)']
    ],
    2008: [
        [0, dataName(197582), 'rgb(201, 36, 39)'],
        [0, dataName(197604), 'rgb(201, 36, 39)'],
        [0, dataName(197507), 'rgb(0, 82, 180)'],
        [16, dataName(197571), 'rgb(0, 0, 0)'],
        [22, dataName(197408), 'rgb(240, 240, 240)'],
        [51, dataName(197375), 'rgb(255, 217, 68)'],
        [19, dataName(197374), 'rgb(0, 82, 180)'],
        [36, dataName(197484), 'rgb(215, 0, 38)']
    ],
    2004: [
        [0, dataName(197582), 'rgb(201, 36, 39)'],
        [16, dataName(197604), 'rgb(201, 36, 39)'],
        [17, dataName(197507), 'rgb(0, 82, 180)'],
        [0, dataName(197571), 'rgb(0, 0, 0)'],
        [27, dataName(197408), 'rgb(240, 240, 240)'],
        [32, dataName(197375), 'rgb(255, 217, 68)'],
        [0, dataName(197374), 'rgb(0, 82, 180)'],
        [37, dataName(197484), 'rgb(215, 0, 38)']
    ],
    2000: [
        [0, dataName(197582), 'rgb(201, 36, 39)'],
        [0, dataName(197604), 'rgb(201, 36, 39)'],
        [16, dataName(197507), 'rgb(0, 82, 180)'],
        [13, dataName(197571), 'rgb(0, 0, 0)'],
        [32, dataName(197408), 'rgb(240, 240, 240)'],
        [28, dataName(197375), 'rgb(255, 217, 68)'],
        [0, dataName(197374), 'rgb(0, 82, 180)'],
        [36, dataName(197484), 'rgb(215, 0, 38)']
    ]
};

var chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Summer Olympics 2016 - Top 5 countries by Gold medals'
    },
    subtitle: {
        text: 'Comparing to results from Summer Olympics 2012 - Source: <ahref="https://en.wikipedia.org/wiki/2016_Summer_Olympics_medal_table">Wikipedia</a>'
    },
    plotOptions: {
        series: {
            grouping: false,
            borderWidth: 0
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.point.shortName}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} medals</b><br/>'
    },
    xAxis: {
        type: 'category',
        max: 4,
        labels: {
            useHTML: true,
            animate: true
        }
    },
    yAxis: [{
        title: {
            text: 'Gold medals'
        },
        showFirstLabel: false
    }],
    series: [{
        color: 'rgb(158, 159, 163)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: dataPrev[2016].slice(),
        name: '2012',
        keys: ['y', 'shortName']
    }, {
        name: '2016',
        id: 'main',
        dataSorting: {
            enabled: true,
            matchByName: true
        },
        dataLabels: [{
            enabled: true,
            inside: true,
            style: {
                fontSize: '16px'
            }
        }],
        keys: ['y', 'name', 'color'],
        data: data[2016].slice()
    }],
    exporting: {
        allowHTML: true
    }
});

var years = [2016, 2012, 2008, 2004, 2000];

years.forEach(function (year) {
    var btn = document.getElementById(year);

    btn.addEventListener('click', function () {

        document.querySelectorAll('.buttons button.active').forEach(function (active) {
            active.className = '';
        });
        btn.className = 'active';

        chart.update({
            title: {
                text: 'Summer Olympics ' + year + ' - Top 5 countries by Gold medals'
            },
            subtitle: {
                text: 'Comparing to results from Summer Olympics ' + (year - 4) + ' - Source: <ahref="https://en.wikipedia.org/wiki/' + (year) + '_Summer_Olympics_medal_table">Wikipedia</a>'
            },
            series: [{
                name: year - 4,
                data: dataPrev[year].slice()
            }, {
                name: year,
                data: data[year].slice()
            }]
        }, true, false, {
            duration: 800
        });
    });
});
