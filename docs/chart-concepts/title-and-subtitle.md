Title and subtitle
==================

The title is by default displayed at the top of the chart, and an optional subtitle can be shown beneath it.

![titleandsubtitle.png](titleandsubtitle.png)

The title and subtitle can be set as shown in the example below.


    title: {
        text: 'My custom title'
    },
    subtitle: {
        text: 'My custom subtitle'
    }

By default, since version 12, the title and subtitle have adaptive alignment to best fit the length of the text and the width of the chart. The following rules apply:
* The title is aligned to the center for short text.
* If the title is about to overflow, it is scaled down to fit, until the limit set in the `title.minScale` option. It defaults to 0.67, which is the scale when the title has the same font size as the subtitle.
* If the title still doesn't fit after scaling down, it is wrapped into multiple lines. Now the text is left-aligned for a cleaner look.
* The subtitle by default (and dynamically) applies the same alignment as the main title.

All of these rules can be overridden by explicitly setting the title or subtitle `align` property, or setting the `title.minScale`, for example to 1 to disallow scaling down.

The title and subtitle can also be moved around by the default attributes of the title and subtitle options (`align`, `float`, `margin`, `verticalAlign`, `x`, `y`). For all available options, see [options.title](https://api.highcharts.com/highcharts/title) and [options.subtitle](https://api.highcharts.com/highcharts/subtitle).

Titles can be modified dynamically after render time by the [Chart.setTitle](https://api.highcharts.com/class-reference/Highcharts.Chart#setTitle) method.