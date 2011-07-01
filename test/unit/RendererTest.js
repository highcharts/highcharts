RendererTest = TestCase("RendererTest");

/**
 * Setup:
 * - Creates the container div object on the page.
 * - Creates a renderer instance.
 */
RendererTest.prototype.setUp = function() {
	assertUndefined(this.container);
	/*:DOC container = <div style="height: 200px; width: 200px"></div>*/
	assertNotUndefined(this.container);

	this.renderer = new Renderer(this.container, 200, 200);
	assertNotUndefined(this.renderer);
}

/**
 * Test that css attributes are merged together.
 */
RendererTest.prototype.testCssFontSize = function () {
	var textElement = this.renderer.text('Hello World', 100, 90),
		isSvg = this.renderer.box.nodeName === 'svg',
		undefinedFontSize = isSvg ? 'fontSize' : 'font-size',
		definedFontSize = isSvg ? 'font-size' : 'fontSize',
		defaultFontSize = defaultOptions.chart.style.fontSize;

	assertNotUndefined(textElement);
	assertEquals('x value', 100, textElement.x);
	assertEquals('y value', 90, textElement.y);

	// Before css the font size should be the default (12px)
	assertUndefined(undefinedFontSize + ' should be undefined', textElement.styles[undefinedFontSize])
	assertEquals('Default font size', defaultFontSize, textElement.styles[definedFontSize]);

	// Apply a new font size
	textElement.css({
		fontSize: '21px'
	});

	assertUndefined(undefinedFontSize + ' should be undefined', textElement.styles[undefinedFontSize])
	assertEquals('Changed font size', '21px', textElement.styles[definedFontSize]);

	// Apply a color and make sure the font size stays the same
	textElement.css({
		color: 'red'
	});

	assertUndefined(undefinedFontSize + ' should be undefined', textElement.styles[undefinedFontSize])
	assertEquals('Changed font size', '21px', textElement.styles[definedFontSize]);
}
