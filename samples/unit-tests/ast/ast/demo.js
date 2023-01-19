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
