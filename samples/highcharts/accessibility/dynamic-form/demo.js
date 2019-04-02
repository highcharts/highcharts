var minute = 1000 * 60,
    startTime = +new Date(),
    dateTimeLabelFormats = {
        day: '%H:%M',
        hour: '%H:%M',
        minute: '%H:%M',
        second: '%H:%M:%S',
        millisecond: '%H:%M:%S'
    },
    chart = Highcharts.chart('balanceChart', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Account balance'
        },
        legend: {
            enabled: false
        },
        accessibility: {
            description: 'Displays balance of your bank accounts over time.',
            pointValuePrefix: '$',
            announceNewData: {
                enabled: true,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'Account balance updated. New data point: Time ' +
                            newPoint.getA11yTimeDescription() + ', $' +
                            Highcharts.numberFormat(newPoint.y, 0, '', ',') + '.';
                    }
                    return false;
                }
            }
        },
        tooltip: {
            dateTimeLabelFormats: dateTimeLabelFormats,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>- Checking: ${point.checking}<br/>- Savings: ${point.savings}'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: dateTimeLabelFormats
        },
        yAxis: {
            max: 14000,
            min: 0,
            title: {
                text: 'Balance'
            },
            labels: {
                format: '${value}'
            }
        },
        series: [{
            id: 'balance',
            name: 'Total account balance',
            keys: ['x', 'y', 'checking', 'savings'],
            data: [
                [0, 11000, 2000, 9000],
                [minute * 2, 12500, 3500, 9000],
                [minute * 4, 12400, 3400, 9000],
                [minute * 6, 11400, 2400, 9000],
                [minute * 8, 11900, 2900, 9000],
                [minute * 10, 12000, 3000, 9000]
            ]
        }]
    });


// Code for handling the pay bill form
var balance = {
        checking: 3000,
        savings: 9000
    },
    fromAccount = document.getElementById('account-select'),
    payAmount = document.getElementById('pay-amount'),
    accountBalance = document.getElementById('account-balance');

// Update balance when account is selected
fromAccount.onchange = function () {
    var accountID = fromAccount.options[fromAccount.selectedIndex].value;
    accountBalance.innerHTML = balance[accountID];
};

// Add balance data when paying a bill
document.getElementById('pay').onclick = function () {
    var time = +new Date() - startTime + 10 * minute,
        accountID = fromAccount.options[fromAccount.selectedIndex].value,
        newBalance = Math.round(parseFloat(accountBalance.innerHTML) -
            parseFloat(payAmount.value));

    if (newBalance >= 0) {
        accountBalance.innerHTML = newBalance;
        balance[accountID] = newBalance;
        chart.get('balance').addPoint({
            x: Math.round(time / 1000) * 1000,
            y: balance.checking + balance.savings,
            checking: balance.checking,
            savings: balance.savings
        });
    }
};

document.getElementById('distribution').onclick = function () {
    var color1 = 'rgba(180, 60, 60, 0.6)',
        color2 = 'rgba(0, 100, 180, 0.6)',
        newData = [
            { name: 'Checking', y: balance.checking, color: color1 },
            { name: 'Savings', y: balance.savings, color: color2 }
        ],
        distributionSeries = chart.get('distribution');
    document.getElementById('distribution').innerHTML = 'Update distribution';
    if (distributionSeries) {
        distributionSeries.setData(newData);
    } else {
        chart.addSeries({
            type: 'pie',
            id: 'distribution',
            name: 'Balance distribution',
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b>${point.y}</b>'
            },
            center: [90, 180],
            size: 100,
            dataLabels: {
                distance: 0
            },
            showInLegend: false,
            data: newData
        });
    }
};
