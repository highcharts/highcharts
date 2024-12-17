Custom Preprocessing
====================

When implementing your own data sources, there may be cases where our built-in [Data module](https://highcharts.com/docs/working-with-data/data-module) doesn't work. This may be if a CSV file is formatted in a certain way that the data module isn't able to read, if you have data passed in a certain XML format, or your data source is something completely different. Below are some examples trying to shed light on the process of parsing custom data.

*   [Preprocess data using CSV](#1)
*   [Preprocess data using XML](#2)
*   [Preprocess data using JSON](#3)

Preprocess data using CSV
-------------------------

Warning: As of Highcharts 4.0, this particular sample is much more easily implemented using the [Data module](https://highcharts.com/docs/working-with-data/data-module). The following description is however still valid as a proof of concept of authoring your own parser function for data with non-standard syntax that the data module can't read.

This example shows how to set up the basic chart options first, then do an ajax call for the data, parse the data and add them in the proper format to the options. The example can be seen live at [data-from-csv.htm](https://highcharts.com/studies/data-from-csv.htm).

1.  **Create an external CSV file** containing only the data. In this example, the file looks like below. The first line lists the categories with a dummy name in the first position. The subsequent lines list the data series name in the first position and values in the subsequent positions. In real life, you will often create the contents of this file using PHP or other server side programming languages. Or you may choose to use other markup formats like XML or JSON. In those cases, jQuery can also parse the data for you natively.

```csv
Categories,Apples,Pears,Oranges,Bananas
John,8,4,6,5
Jane,3,4,2,3
Joe,86,76,79,77
Janet,3,16,13,15
```
    

2.  **Define the initial, basic options.** Note that we create empty arrays for the categories and series objects, so that we can just push values to them later.

```js
var options = {
    chart: {
        defaultSeriesType: 'column'
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: 'Units'
        }
    },
    series: []
};
```
    

3.  **Put it all together.** We use the Highcharts.ajax method to get the contents of the data.csv file. In the success callback function, we parse the returned string, add the results to the categories and series members of the options object, and create the chart. Note that we can't create the chart outside the Ajax callback, as we have to wait for the data to be returned from the server.

```js
Highcharts.ajax({  
    url: 'data.csv',  
    dataType: 'text',  
    success: function(data) {  
        // Split the lines  
        var lines = data.split('\n');  
        lines.forEach(function(line, lineNo) {  
            var items = line.split(',');  
              
            // header line contains categories  
            if (lineNo == 0) {  
                items.forEach(function(item, itemNo) {  
                    if (itemNo > 0) options.xAxis.categories.push(item);  
                });  
            }  
              
            // the rest of the lines contain data with their name in the first position  
            else {  
                var series = {   
                    data: []  
                };  
                items.forEach(function(item, itemNo) {  
                    if (itemNo == 0) {  
                        series.name = item;  
                    } else {  
                        series.data.push(parseFloat(item));  
                    }  
                });  
                  
                options.series.push(series);  
    
            }  
              
        });  
          
        Highcharts.chart('container', options);  
    },  
    error: function (e, t) {  
        console.error(e, t);  
    }  
});
```
    

Preprocess data using JSON
--------------------------

JSON has the advantage of already being JavaScript, meaning that in many cases no preprocessing is needed.

Here is a basic example with a JSON file containing the data shown and using the Highcharts.ajax function to load it.

*   The JSON file

```json
[
[1,12],
[2,5],
[3,18],
[4,13],
[5,7],
[6,4],
[7,9],
[8,10],
[9,15],
[10,22]
]
```
    

*   Using getJSON to preprocess the options and then create the chart.

```js
document.addEventListener('DOMContentLoaded', function () {

    var options = {
        chart: {
            type: 'spline'
        },
        series: [{}]
    };

    Highcharts.ajax({  
        url: 'data.json',  
        success: function(data) {
            options.series[0].data = data;
            Highcharts.Chart('container', options);
        }  
    });

});
```
    

There are two things to note here:

1.  The data from the external JSON file should be loaded into the chart options before the chart is created. This is a best practice suggestion, since creating the chart and then loading the data into it requires means drawing the chart twice.
2.  The data.json file in the example is on the same domain as the chart itself. When loading data across domains, use either [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) or [JSONP](https://en.wikipedia.org/wiki/JSONP).

Preprocess data using XML
-------------------------

Loading data from an XML file is similar to the CSV approach. Since Highcharts does not come with a predefined XML data syntax, it is entirely up to you to write the XML and to define a parsing function for it. The downside of using XML over CSV is that it adds some markup to the data, leaving a larger footprint. How large the extra footprint is depends on how you mark up your data. For example, if you wrap each point with a `<point>` tag and load 1000 points, it will add some weight. If however you add a comma separated list of point values, it doesn't. The upside to using XML, at least for small data sets, is that you don't have to manually parse the incoming data. You can utilize jQuery's existing DOM parsing abilities to access the XML tree. We set up a live example for this at [data-from-xml.htm](https://highcharts.com/studies/data-from-xml.htm). The data can be viewed at [data.xml](https://highcharts.com/studies/data.xml). Below is the function used to parse the XML data and adding it to the options object.

```js
// Load the data from the XML file 
$.get('data.xml', function(xml) {
    
    // Split the lines
    var $xml = $(xml);

    // push categories
    $xml.find('categories item').each(function(i, category) {
        options.xAxis.categories.push($(category).text());
    });

    // push series
    $xml.find('series').each(function(i, series) {

        var seriesOptions = {
            name: $(series).find('name').text(),
            data: []
        };

        // push data points
        $(series).find('data point').each(function(i, point) {
            seriesOptions.data.push(
                parseInt($(point).text())
            );
        });

        // add it to the options
        options.series.push(seriesOptions);
    });

    var chart = new Highcharts.Chart(options);
});
```