(function () {
	var SVG_NS = 'http://www.w3.org/2000/svg',
		userAgent = navigator.userAgent,
		svg = !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect,
		isMS = /(edge|msie|trident)/i.test(userAgent) && !window.opera,
		useCanVG = !svg && !isMS && !!document.createElement('canvas').getContext,
		vml = !svg && !useCanVG,
		isFirefox = /Firefox/.test(userAgent),
		hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4; // issue #38

window.Highcharts = window.Highcharts ? window.Highcharts.error(16, true) : {
	product: '@product.name@',
	version: '@product.version@',
	deg2rad: Math.PI * 2 / 360,
	hasBidiBug: hasBidiBug,
	isMS: isMS,
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
	marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
	noop: function () {
		return undefined;
	}
};

	return window.Highcharts;
}());
