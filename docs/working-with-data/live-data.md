Live data
=========

There are basically two ways of working with a live data feed from the server in Highcharts.

1.  Use the **data module and polling**. This is the simple, configuration-only way.
2.  Set up your own data connection and use Highcharts' **API methods** to keep the chart updated. This allows for more programmatic control.

## 1. Data module and polling


This feature was introduced in v6.1. The [data module](https://www.highcharts.com/docs/working-with-data/data-module) can load data directly from files and services online, and keep the chart updated by polling the server periodically. The chart can load data through one of the [data.csv](https://api.highcharts.com/highcharts/data.csv), [data.rows](https://api.highcharts.com/highcharts/data.rows), [data.columns](https://api.highcharts.com/highcharts/data.columns) or [data.googleSpreadsheetKey](https://api.highcharts.com/highcharts/data.googleSpreadsheetKey) options, and keep it updated by setting [data.enablePolling](https://api.highcharts.com/highcharts/data.enablePolling) to true. This feature also supports flexibility to the data structure. Data points can be shifted, typically old data points removed and new ones added, and the chart will animate to visualize what changed. A benefit of using this feature is that it is purely declarative, which makes it a good match for graphical user interfaces where chart editors set up a chart based on known sources.

<iframe style="width: 100%; height: 650px; border: none;" src=https://www.highcharts.com/samples/highcharts/data/livedata-columns/ allow="fullscreen"></iframe>

## 2. API methods

If the declarative live charts don't cut it, you can set up your own data connection. After a chart has been defined by the configuration object, optionally preprocessed and finally initialized and rendered using Highcharts.chart(), we have the opportunity to alter the chart using a toolbox of API methods. The chart, axis, series and point objects have a range of methods like update, remove, [addSeries](https://api.highcharts.com/highcharts/Chart.addSeries), [addPoint](https://api.highcharts.com/highcharts/Series.addPoint) and so on. The complete list can be seen in [class reference](https://api.highcharts.com/class-reference)

The following example uses jQuery for convenience to run the ajax feature. It shows how to run a live chart with data retrieved from the server each second, or more precisely, one second after the server's last reply. It is done by setting up a custom function, requestData, that initially is called from the chart's load event, and subsequently from its own Ajax success callback function. You can see the results live at [live-server.htm](https://highcharts.com/studies/live-server.htm).

1.  **Set up the server.** In this case, we have a simple PHP script returning a JavaScript array with the JavaScript time and a random y value. This is the contents of the [live-server-data.php](https://highcharts.com/studies/live-server-data.php) file:

    ```php
    <?php
    // Set the JSON header
    header("Content-type: text/json");

    // The x value is the current JavaScript time, which is the Unix time multiplied   
    // by 1000.
    $x = time() * 1000;
    // The y value is a random number
    $y = rand(0, 100);

    // Create a PHP array and echo it as JSON
    $ret = array($x, $y);
    echo json_encode($ret);
    ?>
    ```
    

2.  **Define the chart variable globally**, as we want to access it both from the document ready function and our requestData funcion. If the chart variable is defined inside the document ready callback function, it will not be available in the global scope later.

    ```js
    var chart; // global
    ```
    

3.  **Set up the requestData function.** In this case it uses jQuery's $.ajax method to handle the Ajax stuff, but it could just as well use any other Ajax framework. When the data is successfully received from the server, the string is eval'd and added to the chart's first series using the Highcharts addPoint method. If the series length is greater than 20, we shift off the first point so that the series will move to the left rather than just cram the points tighter.

    ```js
    /**
     * Request data from the server, add it to the graph and set a timeout   
        * to request again
     */
    function requestData() {
        $.ajax({
            url: 'live-server-data.php',
            success: function(point) {
                var series = chart.series[0],
                    shift = series.data.length > 20; // shift if the series is   
                                                        // longer than 20  
                // add the point
                chart.series[0].addPoint(point, true, shift);
                
                // call it again after one second
                setTimeout(requestData, 1000);    
            },
            cache: false
        });
    }
    ```
    

4.  **Create the chart.** Notice how our requestData function is initially called from the chart's load event. The initial data is an empty array.

    ```js
    document.addEventListener('DOMContentLoaded', function() {
        chart = Highcharts.chart('container', {
            chart: {
                type: 'spline',
                events: {
                    load: requestData
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                maxZoom: 20 * 1000
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                title: {
                    text: 'Value',
                    margin: 80
                }
            },
            series: [{
                name: 'Random data',
                data: []
            }]
        });        
    });
    ```