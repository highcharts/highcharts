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
};

RendererTest.prototype.tearDown = function () {
	this.renderer.destroy();
	this.renderer = null;
};

/**
 * Test that css attributes are merged together.
 */
RendererTest.prototype.testCssFontSize = function () {
	var textElement = this.renderer.text('Hello World', 100, 90),
		undefinedFontSize = 'font-size',
		definedFontSize = 'fontSize',
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

	textElement.destroy();
};

RendererTest.prototype.testTransparancy = function () {
	var rect = this.renderer.rect(100, 100, 100, 100, 5);

	// Set the stroke to a transparent color
	rect.attr({
		'stroke-width': 2,
		stroke: 'rgba(255,255,255,0)'
	});

	// Set it back to a solid color
	rect.attr({
		stroke: '#aabbcc'
	});

	// Make sure there is no stray opacity (this is SVG case)
	assertFalse('There is a stray opacity value', rect.element.hasAttribute('stroke-opacity'));

	// Make sure there is no stray opacity (this is VML case)
	var strokeElement = rect.element.getElementsByTagName('stroke')[0];
	if (strokeElement) {
		assertEquals('There is a stray opacity value', 1, strokeElement.opacity);
	}

	rect.destroy();
};

RendererTest.prototype.testGroupWithoutName = function () {
	var namedGroup = this.renderer.g('myName'),
		group;
	assertNotUndefined(namedGroup);

	try {
		group = this.renderer.g();
		assertNotUndefined(group);
	} catch (exception) {
		fail('unnamed group failed.')
	}

	namedGroup.destroy();
	if (group) {
		group.destroy();
	}
};
