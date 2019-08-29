
# Repo guidelines

## Reporting issues
We use GitHub Issues as our official bug tracker. We strive to keep this a clean, maintainable and searchable record of our open and closed bugs, therefore we kindly ask you to obey some rules before reporting an issue:

1. Make sure the report is accompanied by a reproducible demo. The ideal demo is created by forking [our standard jsFiddle](http://jsfiddle.net/highcharts/LLExL/), adding your own code and stripping it down to an absolute minimum needed to demonstrate the bug.
2. Always add information on what browser it applies to, and other information needed for us to debug.
3. It may be that the bug is already fixed. Try your chart with our latest work from http://github.highcharts.com/master/highcharts.js before reporting.
4. For feature requests, tech support and general discussion, don't use GitHub Issues. See [www.highcharts.com/support](http://www.highcharts.com/support) for the appropriate channels.

## Apply a fix
When an issue is resolved, we commit a fix and mark the issue closed. This doesn't mean that a new release is available with the fix applied, but that it is fixed in the development code and will be added to the next stable release. Stable versions are typically released every 1-3 months. To try out the fix immediately, you can run http://github.highcharts.com/highcharts.js or http://github.highcharts.com/highstock.js from any website, but do not use these URLs in production.

If the fix is critical for your project, we recommend that you apply the fix to the latest stable release of Highcharts or Highstock instead of running the latest file found on GitHub, where other untested changes are also present. Most issues are resolved in single patches that don't conflict with other changes. If you're not into Git and don't want to install and learn that procedure, here's how to apply it quickly with help of online tools:
* Locate your issue on GitHub, for example [#2510](https://github.com/highslide-software/highcharts.com/issues/2510).
* Most issues are closed directly from a commit. Go to that commit, for example [d5e176](https://github.com/highslide-software/highcharts.com/commit/d5e176b5c01bb60402c1f6347993a818e2ab4035).
* Now add `.patch` to the URL to view the [patch file](https://github.com/highslide-software/highcharts.com/commit/d5e176b5c01bb60402c1f6347993a818e2ab4035.patch).
* The patch file will show diffs from all files changed. Here it's important to be aware that `highcharts.src.js`, `highstock.src.js` and `highcharts-more.src.js` are concatenated from parts files. Instead of applying the patches from part files, you only need those from the concatenated files.
* If you need to patch `highcharts.src.js`, copy the diff for that file. Start selecting including the line `diff --git a/js/highcharts.src.js b/js/highcharts.src.js` and select all text until the next diff statement for the next file.
* Now the patch is on your clipboard, open another tab at [i-tools.org/diff](http://i-tools.org/diff).
* Under "Original file", click "By URL" and enter `http://code.highcharts.com/highcharts.src.js` or another source file from the latest stable release, see [code.highcharts.com](http://code.highcharts.com).
* Under "Second file or patch file" click "Direct input" and paste the diff from your clipboard.
* Click the "Patch" button, and if everything is okay you should now have a patched file.
* The next (optional) step is to compile the source code in order to reduce file size. Copy the result from the patched file.
* Go to the [Closure Compiler web app](http://closure-compiler.appspot.com/home).
* Paste the patched file contents to the left and click "Compile".


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
