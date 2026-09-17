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
    'AST DOMParser fallback never executes unsanitized markup (#22354)',
    assert => {
        const originalParseFromString = window.DOMParser.prototype
            .parseFromString;
        const maliciousMarkup =
            '<img src="x" onerror="window.astXssExecuted = true">';

        function assertMarkupIsSafe(container, message) {
            const img = container.querySelector('img');

            assert.notOk(
                img && img.getAttribute('onerror'),
                `${message} - onerror attribute should be stripped.`
            );
            assert.strictEqual(
                window.astXssExecuted,
                false,
                `${message} - markup should never execute.`
            );
        }

        // Case 1: the first DOMParser attempt throws, simulating the
        // Trusted Types `createHTML` failure during a scripted print
        // (#16931). The AST should retry with the raw markup string
        // instead of giving up.
        let callCount = 0;
        window.DOMParser.prototype.parseFromString = function (...args) {
            callCount++;
            if (callCount === 1) {
                throw new Error(
                    'The provided callback is no longer runnable'
                );
            }
            return originalParseFromString.apply(this, args);
        };

        window.astXssExecuted = false;
        const retryContainer = document.createElement('div');

        try {
            new Highcharts.AST(maliciousMarkup).addToDOM(retryContainer);
        } finally {
            window.DOMParser.prototype.parseFromString =
                originalParseFromString;
        }

        assert.ok(
            callCount > 1,
            'DOMParser should be retried with the raw markup string after ' +
            'the first parse attempt fails.'
        );
        assertMarkupIsSafe(retryContainer, 'Retry fallback');

        // Case 2: DOMParser is entirely unusable. The AST must parse into
        // a detached, inert document rather than assigning the markup to
        // a live element's innerHTML.
        window.DOMParser.prototype.parseFromString = function () {
            throw new Error('DOMParser unavailable');
        };

        window.astXssExecuted = false;
        const inertContainer = document.createElement('div');

        try {
            new Highcharts.AST(maliciousMarkup).addToDOM(inertContainer);
        } finally {
            window.DOMParser.prototype.parseFromString =
                originalParseFromString;
        }

        assertMarkupIsSafe(inertContainer, 'Inert document fallback');

        delete window.astXssExecuted;
    }
);
