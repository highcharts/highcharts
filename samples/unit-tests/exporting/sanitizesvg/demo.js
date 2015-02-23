// Implementation
function sanitizeSVG(svg) {
    return Highcharts.Chart.prototype.sanitizeSVG.call(0, svg);
}

$(function () {

    QUnit.test("RGB, Chrome style", function (assert) {
        
        assert.equal(
            sanitizeSVG('text-shadow: rgb(255, 255, 255) 0px 0px 6px, rgb(255, 255, 255) 0px 0px 3px;'),
            'text-shadow: rgb(255, 255, 255) 0px 0px 6px;',
            "Basic rgb"
        );
        assert.equal(
            sanitizeSVG('text-shadow: rgb(255, 255, 255) 0px 0px 6px;'),
            'text-shadow: rgb(255, 255, 255) 0px 0px 6px;',
            "Single"
        );
        assert.equal(
            sanitizeSVG('"text-shadow: rgb(255, 255, 255) 0px 0px 6px,rgb(255, 255, 255) 0px 0px 3px"'),
            '"text-shadow: rgb(255, 255, 255) 0px 0px 6px"',
            "Quoted"
        );
    });

    QUnit.test("RGBA, Chrome style", function (assert) {
        
        assert.equal(
            sanitizeSVG('text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px, rgb(255, 255, 255, 0.5) 0px 0px 3px;'),
            'text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px;',
            "Basic rgba"
        );
    });

    QUnit.test("RGB, Firefox style", function (assert) {
        
        assert.equal(
            sanitizeSVG('text-shadow: 0px 0px 6px rgb(255, 255, 255), 0px 0px 3px rgb(255, 255, 255);'),
            'text-shadow: 0px 0px 6px rgb(255, 255, 255);',
            "Basic rgb"
        );
        
    });


    QUnit.test("Named color", function (assert) {
        
        assert.equal(
            sanitizeSVG('text-shadow:0 0 6px green, 0 0 3px green;'),
            'text-shadow:0 0 6px green;',
            "Named color"
        );
        
    });

    QUnit.test("Multiple replacements", function (assert) {

        
        assert.equal(
            sanitizeSVG('<g style="text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px, rgb(255, 255, 255, 0.5) 0px 0px 3px;"></g>' +     
                '<g style="text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px, rgb(255, 255, 255, 0.5) 0px 0px 3px;"></g>'),
            '<g style="text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px;"></g>' +     
                '<g style="text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 6px;"></g>',
            "Multiple replacements"
        );
    });
});

