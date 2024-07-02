let updateIntervalId;

// Custom announce formatter - only report if there is a new point and it is
// above 10. Returning empty string stops announcement, returning false uses
// default announcement.
function onAnnounce(updatedSeries, newSeries, newPoint) {
    return newPoint && newPoint.y > 10 ? 'Alert: ' + newPoint.y : '';
}

// Create the chart
Highcharts.chart('container', {
    title: {
        text: 'Live updating data'
    },
    subtitle: {
        text: 'Points above 10 trigger alert by screen reader'
    },
    accessibility: {
        announceNewData: {
            enabled: true,
            interruptUser: true,
            minAnnounceInterval: 0,
            announcementFormatter: onAnnounce
        }
    },
    chart: {
        type: 'spline'
    },
    yAxis: {
        min: 0,
        max: 12,
        plotLines: [{
            value: 10,
            width: 2,
            color: '#e33'
        }]
    },
    series: [{
        name: 'Random data',
        dataLabels: {
            enabled: true
        },
        data: [1.1]
    }]
});

function startUpdatingData() {
    // Set up the updating of the chart each second
    const chart = Highcharts.charts[0],
        series = chart.series[0];
    updateIntervalId = setInterval(function () {
        series.addPoint(
            Math.round(Math.random() * 110) / 10,
            true,
            series.points.length > 20
        );
    }, 2000);
}

let isUpdating = false;

const toggleButton = document.getElementById('toggle-announce');
toggleButton.addEventListener('click', function () {
    if (isUpdating) {
        clearInterval(updateIntervalId);
        toggleButton.textContent = 'Start updating live data';
        isUpdating = false;
    } else {
        startUpdatingData();
        toggleButton.textContent = 'Stop updating live data';
        isUpdating = true;
    }
});