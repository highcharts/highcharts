ExportingTest = TestCase("ExportingTest");

ExportingTest.prototype.testOverrideDefaultLangOptions = function () {
	assertUndefined(this.container);
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
	// jstestdriver.console.log(chart.container.innerHTML);
	var rects = chart.container.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect");
	for (var i = 0; i < rects.length; i++) {
		if (rects[i].getAttribute('id') === 'exportButton') {
			assertEquals(options.lang.exportButtonTitle, rects[i].getAttribute('title'));
		}
		if (rects[i].getAttribute('id') === 'printButton') {
			assertEquals(options.lang.printButtonTitle, rects[i].getAttribute('title'));
		}
	}
	// TODO-CLC Test the hover menu options
}