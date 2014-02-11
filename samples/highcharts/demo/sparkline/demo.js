
$(function () {
/*
===============================
=== Creating random data to use
===============================
*
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var regions = ["Alabama", "Alaska ", "Arizona ", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
jQuery(regions).each(function () {
    var income_q = '',
        income_t = 0,
        cost_q = '',
        cost_t = 0,
        result_q = '',
        result_t = 0,
        row = '',
        seperator = ', ';
    for (i = 0; i < 4; i++) {
        if (i == 3) {
            seperator = ' ';
        }
        income = getRandomInt(0, 100);
        cost = getRandomInt(0, 100);
        result = income - cost;
        income_q += income + seperator;
        income_t += income;
        cost_q += cost + seperator;
        cost_t += cost;
        result_q += result + seperator;
        result_t += result;
    }
    row = '<tr><th>' + this + '</th><td>' + income_t + '</td><td data-sparkline="' + income_q + '"></td><td>' + cost_t + '</td><td data-sparkline="' + cost_q + '"></td><td>' + result_t + '</td><td data-sparkline="' + result_q + '; column"></td></tr>';
    jQuery("#table-sparkline").append(row);
});
return;
*/
/*
===================================
=== END Creating random data to use
===================================
*/
/*
==========================
=== Sparkling Magic Begins
==========================
*/
Highcharts.SparkLine = function (options, callback) {
    var defaultOptions = {
        chart: {
            renderTo: this,
            type: 'area',
            margin: [0, 0, 0, 0]
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            title: {
                text: null
            }
        },
        yAxis: {
            maxPadding: 0,
            minPadding: 0,
            endOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2
                        }
                    }
                }
            },
            column: {
                negativeColor: 'red'
            }
        },
        series: [{
            color: '#666',
            fillColor: 'rgba(204,204,204,.25)'
        }]
    };
    options = Highcharts.merge(defaultOptions, options);
    return new Highcharts.Chart(options, callback);
};
console.time('sparkline');
jQuery("td[data-sparkline]").each(function () {
    stringdata = jQuery(this).data('sparkline');
    arr = stringdata.split('; ');
    data = jQuery.map(arr[0].split(', '), function (value) {
        return parseFloat(value);
    });
    chart = {};
    if (arr[1]) {
        chart.type = arr[1];
    }
    $(this).highcharts('SparkLine', {
        series: [{
            data: data
        }],
        chart: chart
    });
});
console.timeEnd('sparkline');
/*
==============================
=== END Sparkling magic begins
==============================
*/
});