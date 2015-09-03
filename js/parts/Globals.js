(function () {
	var SVG_NS = 'http://www.w3.org/2000/svg',
		svg = !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect,
		isIE = /(msie|trident)/i.test(userAgent) && !window.opera,
		useCanVG = !svg && !isIE && !!document.createElement('canvas').getContext,
		vml = !svg && !useCanVG,
		userAgent = navigator.userAgent,
		isFirefox = /Firefox/.test(userAgent),
		hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4; // issue #38

window.Highcharts = window.Highcharts ? window.Highcharts.error(16, true) : {
	product: '@product.name@',
	version: '@product.version@',
	deg2rad: Math.PI * 2 / 360,
	hasBidiBug: hasBidiBug,
	isIE: isIE,
	isWebKit: /AppleWebKit/.test(userAgent),
	isFirefox: isFirefox,
	isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
	SVG_NS: SVG_NS,
	idCounter: 0,
	chartCount: 0,
	seriesTypes: {},
	svg: svg,
	useCanVG: useCanVG,
	vml: vml,
	charts: [],
	noop: function () {}
};

	return window.Highcharts;
}());