Your first chart
===

With Highcharts included in your webpage you are ready to create your first chart.

We will start off by creating a simple bar chart.

1.  Add a div in your webpage. Give it an id and set a specific width and height which will be the width and height of your chart. 

    ```html
        <div id="container" style="width:100%; height:400px;"></div>
    ```
    
2.  A chart is initialized by adding the JavaScript tag, `<script> </script>`, anywhere in a webpage, containing the following code. The div from #1 is referenced in the constructor. 

    ```js
        document.addEventListener('DOMContentLoaded', function () {
            var myChart = Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: ['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    name: 'Jane',
                    data: [1, 0, 4]
                }, {
                    name: 'John',
                    data: [5, 7, 3]
                }]
            });
        });
    ```
    
    If you are inserting a Stock chart, there is a separate constructor method called Highcharts.stockChart. In these charts, typically the data is supplied in a separate JavaScript array, either taken from a separate JavaScript file or by an XHR call to the server.
    
    ```js
        var chart1; // globally available
        document.addEventListener('DOMContentLoaded', function() {
            chart1 = Highcharts.stockChart('container', {
                rangeSelector: {
                    selected: 1
                },
                series: [{
                    name: 'USD to EUR',
                    data: usdtoeur // predefined JavaScript array
               }]
           });  
        });
    ```
3.  You should now see this chart on your webpage:
    
    ![bar-fruit-consumption.png](https://assets.highcharts.com/images/bar-fruit-consumption.png)
    
4.  Optionally, you can apply a global theme to your charts. A theme is just a set of options that are applied globally through the [Highcharts.setOptions](https://api.highcharts.com/highcharts#Highcharts.setOptions()) method. The download package comes with four predefined themes. To apply a theme from one of these files, add this directly after the highcharts.js file inclusion:

    ```html
        <script type="text/javascript" src="/js/themes/gray.js"></script>
    ```

For more details on how the options or settings in Highcharts work see [How to set options](https://highcharts.com/docs/getting-started/how-to-set-options).

Below is a list of online examples of the examples shown in this article:

*   [Simple bar chart](https://jsfiddle.net/highcharts/kh5jY/)
*   [Highstock Example](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/stock/demo/basic-line/)
