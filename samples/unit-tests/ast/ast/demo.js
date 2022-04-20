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
    }
);
