var dataPrev = {
    2016: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 11],
        ['Russia', 24],
        ['China', 38],
        ['Great Britain', 29],
        ['United States', 46]
    ],
    2012: [
        ['South Korea', 13],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 0],
        ['Russia', 22],
        ['China', 51],
        ['Great Britain', 19],
        ['United States', 36]
    ],
    2008: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 13],
        ['Russia', 27],
        ['China', 32],
        ['Great Britain', 9],
        ['United States', 37]
    ],
    2004: [
        ['South Korea', 0],
        ['Japan', 5],
        ['Australia', 16],
        ['Germany', 0],
        ['Russia', 32],
        ['China', 28],
        ['Great Britain', 0],
        ['United States', 36]
    ],
    2000: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 9],
        ['Germany', 20],
        ['Russia', 26],
        ['China', 16],
        ['Great Britain', 0],
        ['United States', 44]
    ]
};

var data = {
    2016: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 17],
        ['Russia', 19],
        ['China', 26],
        ['Great Britain', 27],
        ['United States', 46]
    ],
    2012: [
        ['South Korea', 13],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 0],
        ['Russia', 24],
        ['China', 38],
        ['Great Britain', 29],
        ['United States', 46]
    ],
    2008: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 0],
        ['Germany', 16],
        ['Russia', 22],
        ['China', 51],
        ['Great Britain', 19],
        ['United States', 36]
    ],
    2004: [
        ['South Korea', 0],
        ['Japan', 16],
        ['Australia', 17],
        ['Germany', 0],
        ['Russia', 27],
        ['China', 32],
        ['Great Britain', 0],
        ['United States', 37]
    ],
    2000: [
        ['South Korea', 0],
        ['Japan', 0],
        ['Australia', 16],
        ['Germany', 13],
        ['Russia', 32],
        ['China', 28],
        ['Great Britain', 0],
        ['United States', 36]
    ]
};

var countries = [{
    name: 'South Korea',
    flag: 197582,
    color: 'rgb(201, 36, 39)'
}, {
    name: 'Japan',
    flag: 197604,
    color: 'rgb(201, 36, 39)'
}, {
    name: 'Australia',
    flag: 197507,
    color: 'rgb(0, 82, 180)'
}, {
    name: 'Germany',
    flag: 197571,
    color: 'rgb(0, 0, 0)'
}, {
    name: 'Russia',
    flag: 197408,
    color: 'rgb(240, 240, 240)'
}, {
    name: 'China',
    flag: 197375,
    color: 'rgb(255, 217, 68)'
}, {
    name: 'Great Britain',
    flag: 197374,
    color: 'rgb(0, 82, 180)'
}, {
    name: 'United States',
    flag: 197484,
    color: 'rgb(215, 0, 38)'
}];


function getData(data) {
    return data.map(function (country, i) {
        return {
            name: country[0],
            y: country[1],
            color: countries[i].color
        };
    });
}

var chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Summer Olympics 2016 - Top 5 countries by Gold medals',
        align: 'left'
    },
    subtitle: {
        text: 'Comparing to results from Summer Olympics 2012 - Source: <a href="https://en.wikipedia.org/wiki/2016_Summer_Olympics_medal_table">Wikipedia</a>',
        align: 'left'
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
        headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} medals</b><br/>'
    },
    xAxis: {
        type: 'category',
        max: 4,
        labels: {
            useHTML: true,
            animate: true,
            formatter: function () {
                var value = this.value,
                    output;

                countries.forEach(function (country) {
                    if (country.name === value) {
                        output = country.flag;
                    }
                });

                return '<span><img src="https://image.flaticon.com/icons/svg/197/' + output + '.svg" style="width: 40px; height: 40px;"/><br></span>';
            }
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
        name: '2012'
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
        data: getData(data[2016]).slice()
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
                text: 'Comparing to results from Summer Olympics ' + (year - 4) + ' - Source: <a href="https://en.wikipedia.org/wiki/' + (year) + '_Summer_Olympics_medal_table">Wikipedia</a>'
            },
            series: [{
                name: year - 4,
                data: dataPrev[year].slice()
            }, {
                name: year,
                data: getData(data[year]).slice()
            }]
        }, true, false, {
            duration: 800
        });
    });
});
