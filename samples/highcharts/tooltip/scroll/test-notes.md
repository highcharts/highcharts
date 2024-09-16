This is a test replacement for failing test (samples\unit-tests\pointer\scroll\demo.js) on CI/Linux.
Try replacing it back in Chrome v129+. See #21808.

Hover the top chart with the tooltip showing. Scroll down to the second chart until the tooltip shows there.
The tooltip for the chart that is no longer hovered over should NOT have the tooltip blocked and showing when a new tooltip shows.
The top tooltip hides and the bottom one shows after scroll as it should when just moving the cursor.