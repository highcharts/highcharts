Range selector (Highstock only)
================

The range selector is a tool for selecting ranges to display within the chart. It provides buttons to select pre-configured ranges in the chart, like 1 day, 1 week, 1 month, etc. It also provides input boxes where min and max dates can be manually input.

![rangeSelector.png](rangeSelector.png) 

Vertical position
-----------------

The range selector box can be positioned vertically.

Allowed properties are:

*   top (by default)
*   middle
*   bottom

```js
rangeSelector: {
	verticalAlign: ‘top’,
	x: 0,
	y: 0
},
```    

Use the x and y options to customise position. The x and y options offset the selector by pixels from the given alignment.

![ROoULLX-uFGoOnxAlv8P7GRHrBrjyAMVVBXFLry5o5a1nLQAnUkR7uMEOOuclKI_VC5zr6_3D0B1hbbK9tSts58z5ayk-OVx8gLgIyxAau5oAXQIID8IgIdObQM1SD2qHSj12JaH](https://lh3.googleusercontent.com/ROoULLX-uFGoOnxAlv8P7GRHrBrjyAMVVBXFLry5o5a1nLQAnUkR7uMEOOuclKI_VC5zr6_3D0B1hbbK9tSts58z5ayk-OVx8gLgIyxAau5oAXQIID8IgIdObQM1SD2qHSj12JaH)

Floating
--------

The option allows to skip adding extra space for range selector. [See a live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/rangeselector/floating/).

```js
rangeSelector: {
	floating: true,
	y: 250 
},
```   

![DDz6GfTHnK-F2thKxueqGuU0qLQ-aLHBYUlWqyAOu34_V45k8UXoITv4uNjg6WAQtMHdKPkC7K6ZFpc1QD7siVGBCZi9oirugTMmIreYN1Q-HDZKp2f_ghcM2RpK30z3bnYb23R1](https://lh3.googleusercontent.com/DDz6GfTHnK-F2thKxueqGuU0qLQ-aLHBYUlWqyAOu34_V45k8UXoITv4uNjg6WAQtMHdKPkC7K6ZFpc1QD7siVGBCZi9oirugTMmIreYN1Q-HDZKp2f_ghcM2RpK30z3bnYb23R1) 

Input position / button position
--------------------------------

The input boxes, which handle the `from` and `to` dates, can be positioned individually using the following options:

*   align (left, center, right)
*   x
*   y

For example, we can make them swap places like this:

```js
rangeSelector: {
	inputPosition: {
		align: ‘left’,
		x: 0,
		y: 0
	},
	buttonPosition: {
		align: ‘right’,
		x: 0,
		y: 0
	},
},
```

![RXAXKRKmXdJAoJfEZIsYiuFOJu7_-8SQ98TIZfdhGBhu9hsRXCJwlBg-3V8BfTY4u30XIwhpeLnsMq0mMnDdzGMQ9T7O_bqsjKjGF2xbmKA0az-a77snT9_40wgdSbaSypH_XSTw](https://lh5.googleusercontent.com/RXAXKRKmXdJAoJfEZIsYiuFOJu7_-8SQ98TIZfdhGBhu9hsRXCJwlBg-3V8BfTY4u30XIwhpeLnsMq0mMnDdzGMQ9T7O_bqsjKjGF2xbmKA0az-a77snT9_40wgdSbaSypH_XSTw)

Custom button click event
-------------------------

Each range selector button can get a custom action as shown in this example:

```js
rangeSelector: {
	buttons: [{
		type: 'month',
		count: 1,
		text: '1m',
		events: {
			click: function() {
				alert(‘Clicked button’);
			}
		}
	}, {
		type: 'month',
		count: 3,
		text: '3m'
	}, {
		type: 'month',
		count: 6,
		text: '6m'
	}, {
		type: 'ytd',
		text: 'YTD'
	}, {
		type: 'year',
		count: 1,
		text: '1y'
	}, {
		type: 'all',
		text: 'All'
	}]
},
```

See the [API reference](https://api.highcharts.com/highstock/rangeSelector) for the rangeSelector option for more information on how to set up the range selector tool.
