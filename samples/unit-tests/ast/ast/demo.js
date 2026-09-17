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

QUnit.test(
    'AST DOMParser fallback avoids the live document for untrusted markup',
    assert => {
        const originalParseFromString = window.DOMParser.prototype
            .parseFromString;
        const originalCreateElement = document.createElement;
        const originalCreateHTMLDocument = document.implementation
            .createHTMLDocument;
        const markup = '<img src="x" onerror="1">';

        function restore() {
            window.DOMParser.prototype.parseFromString =
                originalParseFromString;
            document.createElement = originalCreateElement;
            document.implementation.createHTMLDocument =
                originalCreateHTMLDocument;
        }

        // Case 1: the first DOMParser attempt throws, simulating the
        // Trusted Types `createHTML` failure during a scripted print
        // (#16931). The AST should retry with the raw markup string
        // instead of falling back at all.
        let parseCallCount = 0;
        window.DOMParser.prototype.parseFromString = function (...args) {
            parseCallCount++;
            if (parseCallCount === 1) {
                throw new Error(
                    'The provided callback is no longer runnable'
                );
            }
            return originalParseFromString.apply(this, args);
        };

        const retryAst = new Highcharts.AST(markup);
        restore();

        assert.ok(
            parseCallCount > 1,
            'DOMParser should be retried with the raw markup string after ' +
            'the first parse attempt fails.'
        );
        assert.strictEqual(
            retryAst.nodes[0] && retryAst.nodes[0].tagName,
            'img',
            'The markup should still be parsed correctly after the retry.'
        );

        // Case 2: DOMParser is entirely unusable. The AST must parse the
        // markup into a detached, inert document (no browsing context, so
        // no resource loads or handlers can ever run there) instead of
        // assigning it to a live document element's innerHTML.
        window.DOMParser.prototype.parseFromString = function () {
            throw new Error('DOMParser unavailable');
        };

        let liveDivCreated = false;
        document.createElement = function (tagName) {
            if (String(tagName).toLowerCase() === 'div') {
                liveDivCreated = true;
            }
            return originalCreateElement.apply(this, arguments);
        };

        let inertDocumentCreated = false;
        document.implementation.createHTMLDocument = function () {
            inertDocumentCreated = true;
            return originalCreateHTMLDocument.apply(this, arguments);
        };

        const inertAst = new Highcharts.AST(markup);
        restore();

        assert.strictEqual(
            inertDocumentCreated,
            true,
            'A detached, inert document should be used when DOMParser is ' +
            'entirely unusable.'
        );
        assert.strictEqual(
            inertAst.nodes[0] && inertAst.nodes[0].tagName,
            'img',
            'The markup should still be parsed correctly via the inert ' +
            'document fallback.'
        );
        assert.strictEqual(
            liveDivCreated,
            false,
            'The live document should never be used to hold unsanitized ' +
            'markup via innerHTML.'
        );
    }
);
