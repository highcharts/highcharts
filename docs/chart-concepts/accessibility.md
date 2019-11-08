#### In many situations, web page content needs to be accessible to users with various disabilities and limitations. Since version 5.0, Highcharts, Highstock and Highmaps come with an Accessibility module to help you make your charts accessible to the broadest range of users possible. 

Using the Accessibility module
===

To start using the Accessibility module, simply include the following files after including Highcharts, Highstock or Highmaps:

    
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

The export-data plugin is an optional dependency, required for the "View as data table" and related features.

Once the above files are included, any subsequent charts will have keyboard navigation support, support for navigating and reading the charts with a screen reader, and also include a hidden HTML screen reader information section above the chart with details about the chart structure and content.

Configuring an accessible chart
-------------------------------

The most important option to configure in order for your charts to be accessible is the [`chart.description`](https://api.highcharts.com/highcharts/chart.description) option. This option should be set to a text description of the chart and its contents. If you can convey the meaning of the chart in text, screen reader users can still get the main takeaway from the chart, even if certain details are unclear.

There are also related `series.description` and `point.description` options for describing individual series and points to screen reader users.

For more configuration options related to the Accessibility module, see [the API documentation](https://api.highcharts.com/highcharts/accessibility).

Live demos of accessible charts:

*   [Accessible line chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-line/)
*   [Accessible pie chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-pie/)
*   [Complex accessible chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/accessibility/advanced-accessible/)
*   [Accessible map](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/maps/accessibility/accessible-map/)
*   [Accessible stock chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/stock/accessibility/accessible-stock/)

Standards compliance
--------------------

Enabling the Accessibility module goes a long way to ensure that your charts comply with existing accessibility standards, including the Section 508 standard of the US Government, and the international WCAG 2.0 standard. We are also proud to be part of ongoing work in developing new standards for SVG chart accessibility, and are bringing our experiences from this work into the Accessibility module continuously. Due to the flexible nature of Highcharts, however, the final responsibility for standards compliance has to be with the implementer. Certain design decisions, such as which colors are used in your chart, could potentially violate aspects of the standards. Custom plugins and new functionality could also affect chart accessibility. We therefore always recommend checking your design against established standards, and testing your charts with the latest screen readers to verify that they are accessible.

Loading data from a table
-------------------------

In some cases it could be useful to load the chart data from a table, rather than generating the table from the chart data. In this case, all you need to do is make the [data.table](https://api.highcharts.com/highcharts/data.table) option point to the id of the table:


        Highcharts.chart('container', {
            data: {
                table: 'datatable'
            },
            title: {
                text: 'Data extracted from a HTML table in the page'
            }
        });

View a live sample of [data fetched from a table](https://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/column-parsed/).

Greater contrast or patterns
----------------------------

The default palette of Highcharts is designed with accessibility in mind, so that any two neighbor colors are tested for different types of color blindness. In addition to that, there are a few ways to increase contrast, both for the visually impaired, but also for the charts to be more readable on greyscale prints.

*   Apply [dash styles](https://api.highcharts.com/highcharts/plotOptions.line.dashStyle) to line series. This will make lines distinguishable even on poor black/white prints. See the [live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/plotoptions/series-dashstyle/). 
*   Apply a pattern fill to areas, columns or plot bands. This can be accomplished through the featured [pattern fill plugin](plugin-registry/single/9/Pattern-Fill).

Keep in mind that pattern fills and dash styles could make your charts confusing and less accessible to some users, especially for certain chart types.