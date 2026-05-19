# Chart constructor called in non-browser environment

This error occurs when attempting to create a chart during server-side rendering (SSR) or in other environments without DOM support.

Highcharts requires a browser environment to render charts. If using server-side rendering frameworks, ensure that chart initialization only occurs client-side.
