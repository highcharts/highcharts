ExportingTest = TestCase("ExportingTest");

ExportingTest.prototype.hasSVG = function () {
	var SVG_NS = 'http://www.w3.org/2000/svg';
	return !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect;
};

ExportingTest.prototype.testOverrideDefaultLangOptions = function () {
	assertUndefined(this.chartContainer);
	/*:DOC += <div id="chartContainer" style="height: 200px; width: 200px"></div>*/
	var chartContainer = document.getElementById('chartContainer');
	assertNotNull(chartContainer);
	var options = {
		chart : {
			renderTo : 'chartContainer'
		},
		lang : {
			downloadPNG : 'Download as PNG image',
			downloadJPEG : 'Download as JPEG image',
			downloadPDF : 'Download PDF document',
			downloadSVG : 'Download as SVG vector image',
			exportButtonTitle : 'Apples',
			printButtonTitle : 'Bananas'
		}
	};
	var chart = new Highcharts.Chart(options);

	if (this.hasSVG()) {
		var rects = chart.container.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect");
		for (var i = 0; i < rects.length; i++) {
			if (rects[i].getAttribute('id') === 'exportButton') {
				assertEquals(options.lang.exportButtonTitle, rects[i].getAttribute('title'));
			}
			if (rects[i].getAttribute('id') === 'printButton') {
				assertEquals(options.lang.printButtonTitle, rects[i].getAttribute('title'));
			}
		}
	}
	// TODO-CLC Test the hover menu options
};

ExportingTest.prototype.testDefaultLangOptions = function () {
	assertUndefined(this.chartContainer);
	/*:DOC += <div id="chartContainer" style="height: 200px; width: 200px"></div>*/
	var chartContainer = document.getElementById('chartContainer');
	assertNotNull(chartContainer);
	var options = {
		chart : {
			renderTo : 'chartContainer'
		}
	};
	var chart = new Highcharts.Chart(options);

	if (this.hasSVG()) {
		var rects = chart.container.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect");
		for (var i = 0; i < rects.length; i++) {
			if (rects[i].getAttribute('id') === 'exportButton') {
				assertEquals('Default export title', Highcharts.getOptions().lang.exportButtonTitle, rects[i].getAttribute('title'));
			}
			if (rects[i].getAttribute('id') === 'printButton') {
				assertEquals('Default print title', Highcharts.getOptions().lang.printButtonTitle, rects[i].getAttribute('title'));
			}
		}
	}
};
