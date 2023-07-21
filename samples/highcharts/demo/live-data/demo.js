const defaultData = 'https://demo-live-data.highcharts.com/time-data.csv';
const urlInput = document.getElementById('fetchURL');
const pollingCheckbox = document.getElementById('enablePolling');
const pollingInput = document.getElementById('pollingTime');

function createChart() {
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Live Data'
        },
        accessibility: {
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (
                    allSeries,
                    newSeries,
                    newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },
        data: {
            csvURL: urlInput.value,
            enablePolling: pollingCheckbox.checked === true,
            dataRefreshRate: parseInt(pollingInput.value, 10)
        }
    });

    if (pollingInput.value < 1 || !pollingInput.value) {
        pollingInput.value = 1;
    }
}

urlInput.value = defaultData;

// We recreate instead of using chart update to make sure the loaded CSV
// and such is completely gone.
pollingCheckbox.onchange = urlInput.onchange =
   pollingInput.onchange = createChart;

// Create the chart
createChart();
