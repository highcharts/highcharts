// Set to 00:00:00:000 today
let today = new Date();

const day = 1000 * 60 * 60 * 24,
    dateFormat = Highcharts.dateFormat;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

const cars = [{
    model: 'Nissan Leaf',
    current: 0,
    deals: [{
        rentedTo: 'Lisa Star',
        from: today - 1 * day,
        to: today + 2 * day
    }, {
        rentedTo: 'Shane Long',
        from: today - 3 * day,
        to: today - 2 * day
    }, {
        rentedTo: 'Jack Coleman',
        from: today + 5 * day,
        to: today + 6 * day
    }]
}, {
    model: 'Jaguar E-type',
    current: 0,
    deals: [{
        rentedTo: 'Martin Hammond',
        from: today - 2 * day,
        to: today + 1 * day
    }, {
        rentedTo: 'Linda Jackson',
        from: today - 2 * day,
        to: today + 1 * day
    }, {
        rentedTo: 'Robert Sailor',
        from: today + 2 * day,
        to: today + 6 * day
    }]
}, {
    model: 'Volvo V60',
    current: 0,
    deals: [{
        rentedTo: 'Mona Ricci',
        from: today + 0 * day,
        to: today + 3 * day
    }, {
        rentedTo: 'Jane Dockerman',
        from: today + 3 * day,
        to: today + 4 * day
    }, {
        rentedTo: 'Bob Shurro',
        from: today + 6 * day,
        to: today + 8 * day
    }]
}, {
    model: 'Volkswagen Golf',
    current: 0,
    deals: [{
        rentedTo: 'Hailie Marshall',
        from: today - 1 * day,
        to: today + 1 * day
    }, {
        rentedTo: 'Morgan Nicholson',
        from: today - 3 * day,
        to: today - 2 * day
    }, {
        rentedTo: 'William Harriet',
        from: today + 2 * day,
        to: today + 3 * day
    }]
}, {
    model: 'Peugeot 208',
    current: 0,
    deals: [{
        rentedTo: 'Harry Peterson',
        from: today - 1 * day,
        to: today + 2 * day
    }, {
        rentedTo: 'Emma Wilson',
        from: today + 3 * day,
        to: today + 4 * day
    }, {
        rentedTo: 'Ron Donald',
        from: today + 5 * day,
        to: today + 6 * day
    }]
}];

// Parse car data into series.
const series = cars.map(function (car, i) {
    const data = car.deals.map(function (deal) {
        return {
            id: 'deal-' + i,
            rentedTo: deal.rentedTo,
            start: deal.from,
            end: deal.to,
            y: i,
            name: deal.rentedTo
        };
    });
    return {
        name: car.model,
        data: data,
        current: car.deals[car.current]
    };
});

Highcharts.ganttChart('container', {
    series: series,
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    fontWeight: 'normal'
                }
            }
        }
    },
    title: {
        text: 'Car Rental Schedule'
    },
    tooltip: {
        pointFormat: '<span>Rented To: {point.rentedTo}</span><br/><span>From: {point.start:%e. %b}</span><br/><span>To: {point.end:%e. %b}</span>'
    },
    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.',
                yAxisDescriptionSingular: 'The chart has a tabular Y axis showing a data table row for each point.'
            }
        }
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        point: {
            valueDescriptionFormat: 'Rented to {point.rentedTo} from {point.x:%A, %B %e} to {point.x2:%A, %B %e}.'
        },
        series: {
            descriptionFormat: '{series.name}, car {add series.index 1} of {series.chart.series.length}.'
        }
    },
    xAxis: {
        currentDateIndicator: true
    },
    yAxis: {
        type: 'category',
        grid: {
            columns: [{
                title: {
                    text: 'Model'
                },
                categories: series.map(function (s) {
                    return s.name;
                })
            }, {
                title: {
                    text: 'Rented To'
                },
                categories: series.map(function (s) {
                    return s.current.rentedTo;
                })
            }, {
                title: {
                    text: 'From'
                },
                categories: series.map(function (s) {
                    return dateFormat('%e. %b', s.current.from);
                })
            }, {
                title: {
                    text: 'To'
                },
                categories: series.map(function (s) {
                    return dateFormat('%e. %b', s.current.to);
                })
            }]
        }
    }
});
