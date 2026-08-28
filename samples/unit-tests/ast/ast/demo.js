QUnit.test(
    'parseStyle',
    assert => {
        const AST = Highcharts.AST;


        assert.deepEqual(
            AST.parseStyle('display: none; -webkit-mask: url(https://www.example.com/png.png) center center no-repeat'),
            {
                display: 'none',
                WebkitMask: 'url(https://www.example.com/png.png) center center no-repeat'
            },
            'Parse style should handle common patterns'
        );

        // Make all quotation marks parse correctly to DOM (#17627)
        const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        ren.text(
            '<span id="greenText" style="color: green;">green</span>',
            100,
            100
        ).add();

        ren.text(
            '<span class=\'<\' id=\'redText\' style=\'color: red;\'>red</span>',
            200,
            100
        ).add();

        assert.strictEqual(
            document.getElementById('greenText')
                .outerHTML
                .includes(('fill: green')),
            true,
            'Text element should be green (#17627).'
        );

        assert.strictEqual(
            document.getElementById('redText')
                .outerHTML
                .includes(('fill: red')),
            true,
            'Text element should be red (#17627).'
        );

        assert.strictEqual(
            document.getElementById('redText').getAttribute('class'),
            '&lt;',
            '"<" symbol in attribute value should be replaced with &lt; #17753'
        );
    }
);

QUnit.test(
    'AST preserves camelCase SVG tag names (#24702)',
    assert => {
        const container = document.createElement('div');

        new Highcharts.AST(
            '<svg><linearGradient id="grad">' +
                '<stop offset="0" stop-color="red" stop-opacity="1"></stop>' +
            '</linearGradient></svg>'
        ).addToDOM(container);

        const gradient = container.querySelector('#grad');

        assert.strictEqual(
            gradient && gradient.localName,
            'linearGradient',
            'Created element should keep the camelCase, so that the SVG ' +
            'gradient resolves.'
        );

        const stop = container.querySelector('stop');

        assert.deepEqual(
            stop && {
                color: stop.getAttribute('stop-color'),
                opacity: stop.getAttribute('stop-opacity')
            },
            { color: 'red', opacity: '1' },
            'stop-color and stop-opacity should survive attribute filtering.'
        );
    }
);

QUnit.test('Filtering of CSS references', assert => {
    const AST = Highcharts.AST,
        styleOf = markup => {
            const container = document.createElement('div');
            new AST(markup).addToDOM(container);
            return container.querySelector('p').getAttribute('style') || '';
        },
        // A style element at the top level of a markup string is moved to the
        // document head by the HTML parser, so it only reaches the AST when
        // wrapped in another element
        cssTextOf = cssText => {
            const container = document.createElement('div');
            new AST('<div><style>' + cssText + '</style></div>')
                .addToDOM(container);
            const style = container.querySelector('style');
            return style ? style.textContent : '';
        };

    const external = styleOf(
        '<p style="color: red; background: url(https://example.com/x.png)">t' +
        '</p>'
    );

    assert.strictEqual(
        external.indexOf('url(') === -1,
        true,
        'An external CSS reference should be filtered out.'
    );

    assert.strictEqual(
        /color:\s*red/.test(external),
        true,
        'The remaining declarations should survive the filtering.'
    );

    assert.strictEqual(
        styleOf(
            '<p style="background: u\\72 l(https://example.com/x.png)">t</p>'
        ).indexOf('url(') === -1,
        true,
        'An escaped reference should be filtered out, as `u\\72 l(` and ' +
        '`url(` are equivalent to the browser.'
    );

    assert.strictEqual(
        styleOf('<p style="filter: url(#blur)">t</p>').indexOf('#blur') > -1,
        true,
        'A same-document reference should be applied, as gradients, ' +
        'patterns and filters rely on it.'
    );

    assert.strictEqual(
        cssTextOf('.a { background: url(https://example.com/b.png) }'),
        '',
        'The CSS text of a style element should be filtered out when it ' +
        'holds an external reference.'
    );

    assert.strictEqual(
        cssTextOf('@import "data:text/css;base64,I2Mge30=";'),
        '',
        'An @import should be filtered out even for an allowed reference, ' +
        'as the content of the imported style sheet cannot be checked.'
    );

    assert.strictEqual(
        cssTextOf('.a { filter: url(#blur) }'),
        '.a { filter: url(#blur) }',
        'A same-document reference should keep the CSS text, as styled mode ' +
        'definitions rely on it.'
    );
});

QUnit.test('Opting in to CSS references', assert => {
    const AST = Highcharts.AST,
        references = AST.allowedCSSReferences.slice(),
        markup = '<p style="background: url(https://cdn.example.com/x.png)">' +
            't</p>',
        styleOf = () => {
            const container = document.createElement('div');
            new AST(markup).addToDOM(container);
            return container.querySelector('p').getAttribute('style') || '';
        };

    try {
        AST.allowedCSSReferences.push('https://cdn.example.com/');

        assert.strictEqual(
            styleOf().indexOf('https://cdn.example.com/x.png') > -1,
            true,
            'An allowed reference should be applied.'
        );
    } finally {
        AST.allowedCSSReferences.length = 0;
        references.forEach(reference => {
            AST.allowedCSSReferences.push(reference);
        });
    }

    AST.bypassHTMLFiltering = true;
    try {
        assert.strictEqual(
            styleOf().indexOf('https://cdn.example.com/x.png') > -1,
            true,
            'bypassHTMLFiltering should bypass the filtering of styles.'
        );
    } finally {
        AST.bypassHTMLFiltering = false;
    }
});
