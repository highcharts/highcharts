var today = +Date.now(),
    minutes = 60 * 1000,
    hours = 60 * minutes,
    days = 24 * hours;

var information = {
    events: {
        loading: {
            color: '#395627'
        },
        ladenVoyage: {
            color: '#558139'
        },
        unloading: {
            color: '#aad091'
        },
        ballastVoyage: {
            color: '#c6dfb6'
        }
    },
    vessels: [{
        name: 'Vessel 1',
        trips: [{
            start: today + days,
            loading: 1 * days + 2 * hours + 45 * minutes,
            ladenVoyage: 21 * days,
            unloading: 1 * days + 5 * hours,
            ballastVoyage: 14 * days
        }, {
            start: today + 50 * days,
            loading: 2 * days,
            ladenVoyage: 10 * days,
            unloading: 1 * days,
            ballastVoyage: 5 * days
        }]
    }, {
        name: 'Vessel 2',
        trips: [{
            start: today - 5 * days,
            loading: 1 * days + 2 * hours + 45 * minutes,
            ladenVoyage: 21 * days,
            unloading: 1 * days + 5 * hours,
            ballastVoyage: 14 * days
        }, {
            start: today + 45 * days,
            loading: 2 * days,
            ladenVoyage: 10 * days,
            unloading: 1 * days,
            ballastVoyage: 5 * days
        }]
    }]
};

var getPointsFromTrip = function (trip, groups, vessel, y) {
    var start = trip.start,
        events = Object.keys(groups);
    return events.reduce(function (points, key) {
        var group = groups[key],
            duration = trip[key],
            end = start + duration,
            point = {
                start: start,
                end: end,
                color: group.color,
                vessel: vessel.name,
                y: y
            };
        // Update start for the next iteration
        start = end;

        // Add the point
        points.push(point);
        return points;
    }, []);
};

var convertInformationToSeries = function (info) {
    var events = info.events,
        vessels = info.vessels;
    return vessels.reduce(function (series, vessel, i) {
        var data = [];

        vessel.trips.forEach(function (trip) {
            var points = getPointsFromTrip(trip, events, vessel, i);
            data = data.concat(points);
        });

        series.push({
            name: vessel.name,
            data: data
        });
        return series;
    }, []);
};

Highcharts.ganttChart('container', {
    plotOptions: {
        series: {
            borderRadius: 0,
            borderWidth: 0,
            pointPadding: 0
        }
    },
    legend: {
        enabled: false
    },
    series: convertInformationToSeries(information),
    xAxis: [{
        type: 'datetime',
        currentDateIndicator: true,
        grid: false,
        labels: {
            format: undefined
        },
        tickInterval: undefined
    }],
    yAxis: [{
        type: 'grid',
        maxPadding: 0,
        grid: {
            columns: [{
                categories: ['Vessel 1', 'Vessel 2']
            }, {
                categories: ['Info 1', 'Info 2']
            }]
        }
    }]
});
