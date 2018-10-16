// Set to 00:00:00:000 today
var today = new Date(),
    day = 1000 * 60 * 60 * 24,
    map = Highcharts.map,
    dateFormat = Highcharts.dateFormat,
    series,
    cars;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

cars = [{
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
    model: 'Peaugeot 208',
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
series = cars.map(function (car, i) {
    var data = car.deals.map(function (deal) {
        return {
            id: 'deal-' + i,
            rentedTo: deal.rentedTo,
            start: deal.from,
            end: deal.to,
            y: i
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
    title: {
        text: 'Car Rental Schedule'
    },
    tooltip: {
        pointFormat: '<span>Rented To: {point.rentedTo}</span><br/><span>From: {point.start:%e. %b}</span><br/><span>To: {point.end:%e. %b}</span>'
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
                categories: map(series, function (s) {
                    return s.name;
                })
            }, {
                title: {
                    text: 'Rented To'
                },
                categories: map(series, function (s) {
                    return s.current.rentedTo;
                })
            }, {
                title: {
                    text: 'From'
                },
                categories: map(series, function (s) {
                    return dateFormat('%e. %b', s.current.from);
                })
            }, {
                title: {
                    text: 'To'
                },
                categories: map(series, function (s) {
                    return dateFormat('%e. %b', s.current.to);
                })
            }]
        }
    }
});
