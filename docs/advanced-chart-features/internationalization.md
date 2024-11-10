Internationalization
====================

Highcharts allows charts to be presented in any language.

Translation language strings
----------------------------

All GUI elements with strings as well as number specifics can be translated. See the [lang](https://api.highcharts.com/highcharts/lang) options set.

Reversed and bidi text (arabic, hebrew)
---------------------------------------

All modern browsers reliably support bidirectional text in SVG, though there might be problems writing complex HTML strings that are parsed and displayed using SVG. As a workaround for this, in Highcharts all text options are accompanied by an additional option, `useHTML`. When using HTML, all browsers handle bidirectional text without a problem. Note that in order for this to show correctly on exported charts, you need to set the [exporting.allowHTML](https://api.highcharts.com/highcharts/exporting.allowHTML) option. For an overview over the different settings, go to [api.highcharts.com](https://api.highcharts.com) and search for _useHTML_.

In Firefox < 4 there is a bug that completely breaks bidi text in SVG. As a convenient workaround for this, we have added a boolean constant, _Highcharts.hasBidiBug_, that can be used to determine when to use HTML in labels:


    labels: {
        useHTML: Highcharts.hasBidiBug
    }

Reversing the geometry of the chart
-----------------------------------

In RTL languages you may want to put the Y axis on the right side and reverse the X axis so that it flows from right to left. 

*   To move the Y axis to the right side, set [yAxis.opposite](https://api.highcharts.com/highcharts/yAxis.opposite) to true.
*   To reverse the X axis, set [xAxis.reversed](https://api.highcharts.com/highcharts/xAxis.reversed) to true.

Numbers
-------

Numbers can be internationalized by extending the numberFormat function. See the example of [Arabic digits in Highcharts](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/highcharts-numberformat/). 

Live demos
----------

Chart in Arabic language
<iframe style="width: 100%; height: 450px; border: none;" src='https://www.highcharts.com/samples/embed/highcharts/lang/i18n-arabic' allow="fullscreen"></iframe>

Chart in Chinese language
<iframe style="width: 100%; height: 450px; border: none;" src='https://www.highcharts.com/samples/embed/highcharts/lang/i18n-chinese' allow="fullscreen"></iframe>