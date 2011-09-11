ExportingTest = TestCase("ExportingTest");

ExportingTest.getRectsIn = function (element) {
	return hasSVG
		? element.getElementsByTagNameNS(SVG_NS, "rect")
		: element.getElementsByTagName("shape");
};

ExportingTest.getTitleIn = function (element) {
	var titleElements = hasSVG
		? element.getElementsByTagNameNS(SVG_NS, "title")
		: element.getElementsByTagName("title");
	return isIE ? titleElements[0].text : titleElements[0].textContent;
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
	var rects = ExportingTest.getRectsIn(chart.container);
	for (var i = 0; i < rects.length; i++) {
		if (rects[i].getAttribute('id') === 'exportButton') {
			if (hasSVG) {
				assertEquals('Custom export title element', options.lang.exportButtonTitle, ExportingTest.getTitleIn(rects[i]));
			}
			assertEquals('Custom export title attribute', options.lang.exportButtonTitle, rects[i].getAttribute('title'));
		}
		if (rects[i].getAttribute('id') === 'printButton') {
			if (hasSVG) {
				assertEquals('Custom print title element', options.lang.printButtonTitle, ExportingTest.getTitleIn(rects[i]));
			}
			assertEquals('Custom print title attribute', options.lang.printButtonTitle, rects[i].getAttribute('title'));
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
	var rects = ExportingTest.getRectsIn(chart.container);
	for (var i = 0; i < rects.length; i++) {
		if (rects[i].getAttribute('id') === 'exportButton') {
			if (hasSVG) {
				assertEquals('Default export title element', Highcharts.getOptions().lang.exportButtonTitle, ExportingTest.getTitleIn(rects[i]));
			}
			assertEquals('Default export title attribute', Highcharts.getOptions().lang.exportButtonTitle, rects[i].getAttribute('title'));
		}
		if (rects[i].getAttribute('id') === 'printButton') {
			if (hasSVG) {
				assertEquals('Default print title element', Highcharts.getOptions().lang.printButtonTitle, ExportingTest.getTitleIn(rects[i]));
			}
			assertEquals('Default print title attribute', Highcharts.getOptions().lang.printButtonTitle, rects[i].getAttribute('title'));
		}
	}
};

ExportingTest.prototype.testIssue431 = function () {
	if (hasSVG) {
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
		var rects = ExportingTest.getRectsIn(chart.container);
		for (var i = 0; i < rects.length; i++) {
			if (rects[i].getAttribute('id') === 'exportButton' || rects[i].getAttribute('id') === 'printButton') {
				assertEquals(1, rects[i].getElementsByTagName('title').length);
				assertEquals('title', rects[i].firstChild.nodeName);
			}
		}
	}
};
