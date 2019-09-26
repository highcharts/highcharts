Responsive charts
===

Since Highcharts 5.0 you can create responsive charts much the same way you work with responsive web pages. A top-level option, [responsive](https://api.highcharts.com/highcharts/responsive), exists in the configuration.

It lets you define a set of rules, each with a [condition](https://api.highcharts.com/highcharts/responsive.rules.condition), for example _maxWidth: 500_, and a separate set of [chartOptions](https://api.highcharts.com/highcharts/responsive.rules.chartOptions) that is applied on top of the general chart options. The _chartOptions_ work as overrides to the regular chart options, which apply when the rule applies. For example, the following rule will hide the legend for charts less than 500 pixels wide: 

    
    responsive: {  
      rules: [{  
        condition: {  
          maxWidth: 500  
        },  
        chartOptions: {  
          legend: {  
            enabled: false  
          }  
        }  
      }]  
    }

One of the most handy options is [chart.className](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/responsive/classname/) that can be used to control the style of all other elements in Highcharts styled mode.

In general, the _responsive_ configuration lets you define size-dependent settings for all aspects of the chart. Typical use could be to [move the legend](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/responsive/legend/) or modify how much space [the axes take up](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/responsive/axis/). Responsiveness is also a great concept in charts with many graphical elements, like [stock charts](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/stock/demo/responsive/).

What what happens to the legend in this sample as you scale up or down the browser window size:

<iframe style="width: 100%; height: 500px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/responsive/legend allow="fullscreen"></iframe>
