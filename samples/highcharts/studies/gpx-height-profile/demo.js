// 2. Optionally define data labels by the index of the track point
var dl = {
    2: {
        enabled: true,
        format: 'Start - Lunde',
        rotation: 45,
        align: 'right',
        crop: false
    },
    31: {
        enabled: true,
        format: 'End of road',
        rotation: 45,
        align: 'right'
    },
    98: {
        enabled: true,
        format: 'Drinking station',
        rotation: 45,
        align: 'right'
    },
    161: {
        enabled: true,
        format: 'Finish - Vidasetvarden ',
        rotation: 0,
        align: 'right'
    }
};

/**
 * Utility function to get the distance between two points
 * http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
 */
function getDistance(pt1, pt2) {
    var toRad = Math.PI / 180;
    var R = 6371; // Radius of the earth in km
    var dLat = (pt2.lat - pt1.lat) * toRad;  // Javascript functions in radians
    var dLon = (pt2.lon - pt1.lon) * toRad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pt1.lat * toRad) * Math.cos(pt2.lat * toRad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km

    return d;
}

$(function () {
    // Internationalization
    Highcharts.setOptions({
        lang: {
            thousandsSep: ' '
        }
    });



    var xml = document.getElementById('data'),
        data = [],
        lastPoint,
        totalDistance = 0,
        trackPoints = xml.getElementsByTagName('trkpt');

    // For this particular gpx, we want to reverse the points
    trackPoints = Array.prototype.slice.call(trackPoints, 0);
    trackPoints.reverse();

    // Iterate over the track points, get cumulative distance and elevation
    $.each(trackPoints, function (i, trkpt) {

        var time = Date.parse(trkpt.getElementsByTagName('time')[0].textContent),
            ele = parseInt(trkpt.getElementsByTagName('ele')[0].textContent, 10),
            lat = parseFloat(trkpt.getAttribute('lat')),
            lon = parseFloat(trkpt.getAttribute('lon')),
            point = {
                lat: lat,
                lon: lon
            },
            distance = lastPoint ? getDistance(lastPoint, point) : 0;

        totalDistance += distance;

        /*console.log(
            'time', time,
            'elevation', ele,
            'lat', lat,
            'lon', lon,
            'distance', distance,
            'totalDistance', totalDistance
        );*/
        data.push({
            x: Math.round(totalDistance * 100) / 100,
            y: ele - 15,
            dataLabels: dl[i]
        });

        lastPoint = point;

    });


    // Now create the chart
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'area'
        },

        xAxis: {
            title: {
                text: 'Distance ( km )'
            },
            minPadding: 0.05
        },

        yAxis: {
            startOnTick: true,
            endOnTick: false,
            minPadding: 0,
            title: {
                text: 'Elevation ( m )'
            },
            labels: {
                align: 'left',
                x: 0,
                y: -2
            }
        },

        title: {
            text: 'Height profile for Vidasete Opp'
        },

        subtitle: {
            text: 'Display GPX data in Highcharts'
        },

        tooltip: {
            headerFormat: '',
            pointFormat: 'Distance: {point.x} km<br/>{point.y} m a. s. l.',
            shared: true
        },

        legend: {
            enabled: false
        },

        series: [{
            data: data,
            name: 'Elevation',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, 'rgba(65, 116, 158, 0.7)'],
                    [1, 'rgba(255, 255, 255, 0.7)']
                ]
            },
            threshold: null,
            turboThreshold: 0
        }]

    });
});