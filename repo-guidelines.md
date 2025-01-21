# Repo guidelines

## Reporting issues

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## Core developers' checklist for new series types

When creating a new official series type, there are some requirements that
should be checked and preferable set up in unit tests:

* If it makes sense for the given chart type, check that it works with
`chart.inverted` and `xAxis/yAxis.reversed`.
* Data labels.
* Dynamic features, test the full lifecycle. Make sure animation runs if
possible.
	* `chart.addSeries`
	* `series.addPoint`
	* `point.update`
	* `point.remove`
	* `series.remove`
* Chart or window resizing. Series should resize with animation on
`chart.setSize()` (n/a on window resize).
* Initial animation. If any, what kind of animation makes sense for the series?
* Crisp shapes. Beware of rectangles and straight lines. Set up crisping logic
like for existing series, and keep styled mode in mind.
* Null points. Use the [isValid](https://github.com/highcharts/highcharts/blob/5468b76e66f926ae8d967b6265a0c0276e492a8c/ts/Series/Pie/PiePoint.ts#L153-L159)
function to do the check.
* Styled mode. Everything that is stylable should be put inside conditional
code. Add appropriate class names to all elements. Set up demo in the `/css`
demo folder.
* Boost module. If it makes sense for the series type, implement boosting.
Otherwise, make sure it is ignored.
* API docs. Test run the new series with `gulp jsdoc --watch` and make sure the
output is correct. Remember to exclude members from the parent.

## Style guide

In general, ESLint picks up and stops styling issues, but some things can be
mentioned in particular.

Style guide excerpt can be found in [Contributing: Style guide](CONTRIBUTING.md#style-guide).

See also: [Coding recommendations](ts/README.md#coding-recommendations).

### Avoid line breaks without paragraphs

In prose text inside doclets, code comments, documentation article markdown and
blog posts, avoid line breaks without paragraphs. Doclets and comments should
wrap at max 80 characters.

Bad (line break inside paragraph):
```
This feature turns something off, so that it does not show.
It is `undefined` by default.
```

Good (single paragraph, break at 80):
```
This feature turns something off, so that it does not show. It is `undefined` by
defalt.
```

Good (two paragraph):
```
This feature turns something off, so that it does not show.

It is `undefined` by default.
```
