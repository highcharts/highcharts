
# Repo guidelines

## Reporting issues
We use GitHub Issues as our official bug tracker. We strive to keep this a clean, maintainable and searchable record of our open and closed bugs, therefore we kindly ask you to obey some rules before reporting an issue:

1. Make sure the report is accompanied by a reproducible demo. The ideal demo is created by forking [our standard jsFiddle](http://jsfiddle.net/highcharts/LLExL/), adding your own code and stripping it down to an absolute minimum needed to demonstrate the bug.
2. Always add information on what browser it applies to, and other information needed for us to debug.
3. It may be that the bug is already fixed. Try your chart with our latest work from http://github.highcharts.com/master/highcharts.js before reporting.
4. For feature requests, tech support and general discussion, don't use GitHub Issues. See [www.highcharts.com/support](http://www.highcharts.com/support) for the appropriate channels.

## Test a fix
When an issue is resolved, we commit a fix and mark the issue closed. This doesn't mean that a new release is available with the fix applied, but that it is fixed in the development code and will be added to the next stable release. Stable versions are typically released every 1-3 months. To try out the fix immediately, you can run http://github.highcharts.com/highcharts.js or http://github.highcharts.com/highstock.js from any website, but do not use these URLs in production.

# Core developers' checklist for new series types

When creating a new official series type, there are some requirements that should be checked and preferable set up in unit tests:

* If it makes sense for the given chart type, check that it works with `chart.inverted` and `xAxis/yAxis.reversed`.
* Data labels.
* Dynamic features, test the full lifesycle. Make sure animation runs if possible.
	* `chart.addSeries`
	* `series.addPoint`
	* `point.update`
	* `point.remove`
	* `series.remove`
* Chart or window resizing. Series should resize with animation on `chart.setSize()` (n/a on window resize).
* Initial animation. If any, what kind of animation makes sense for the series?
* Crisp shapes. Beware of rectangles and straight lines. Set up crisping logic like for existing series, and keep styled mode in mind.
* Null points. Use the [isValid](https://github.com/highcharts/highcharts/blob/v5.0.14/js/parts/PieSeries.js#L607-L612) function to do the check.
* Styled mode. Everything that is stylable should be put inside conditional code. Add appropriate class names to all elements. Set up demo in the `/css` demo folder.
* Boost module. If it makes sense for the series type, implement boosting. Otherwise, make sure it is ignored.
* API docs. Test run the new series with `gulp jsdoc --watch` and make sure the output is correct. Remember to exclude members from the parent.


# Style guide

In general, ESLint picks up and stops styling issues, but some things can be mentioned in particular.

#### 1. Avoid line breaks without paragraphs
In prose text inside doclets, code comments, documentation article markdown and blog posts, avoid line breaks without paragraphs. Doclets and comments should wrap at max 80 characters.

Bad (line break inside paragraph):
```
This feature turns something off, so that it does not show.
It is `undefined` by defalt.
```

Good (single paragraph, break at 80):
```
This feature turns something off, so that it does not show. It is `undefined` by
defalt.
```

Good (two paragraph):
```
This feature turns something off, so that it does not show.

It is `undefined` by defalt.
```
