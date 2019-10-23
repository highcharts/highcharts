Themes
======

A Highcharts theme is a set of pre-defined options that are applied as default Highcharts options before each chart is instanciated. The highcharts.zip package comes with some themes that can easily be applied to your chart by including the follow script tag:

    
    <script src="/js/themes/gray.js"></script>

The themes can also be found on github: [https://github.com/highslide-software/highcharts.com/tree/master/js/themes](https://github.com/highslide-software/highcharts.com/tree/master/js/themes).

Creating your own theme
-----------------------

It can be useful to separate the styling of a chart from the data. Such a separation allows the look and feel of your charts to be shared easily between charts across your website. This can be done by creating a options object and apply it to the chart using the [Highcharts.setOptions](https://api.highcharts.com/highcharts#Highcharts.setOptions()) method (which is done in the theme JavaScript files)

Here is simple example to show the process:

    
    Highcharts.theme = {
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',   
                 '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                ]
            },
        },
        title: {
            style: {
                color: '#000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            style: {
                color: '#666666',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },
    
        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle:{
                color: 'gray'
            }   
        }
    };
    
    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);