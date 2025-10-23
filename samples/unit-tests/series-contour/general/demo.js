QUnit.test('General contour stuff', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                type: 'contour',
                showContourLines: true,
                lineColor: '#FF0000',
                lineWidth: 2,
                contourInterval: 2,
                data: [
                    [
                        0,
                        0,
                        7.34668824095249
                    ],
                    [
                        0,
                        1,
                        4.0732136818333045
                    ],
                    [
                        0,
                        2,
                        5.645209185465146
                    ],
                    [
                        0,
                        3,
                        0.6531039553870279
                    ],
                    [
                        0,
                        4,
                        5.905892479218316
                    ],
                    [
                        0,
                        5,
                        7.1922400528224415
                    ],
                    [
                        0,
                        6,
                        2.6266556338884994
                    ],
                    [
                        0,
                        7,
                        6.488295069124517
                    ],
                    [
                        1,
                        0,
                        7.274288607458964
                    ],
                    [
                        1,
                        1,
                        5.925074201030078
                    ],
                    [
                        1,
                        2,
                        2.322211381330443
                    ],
                    [
                        1,
                        3,
                        7.962847743567572
                    ],
                    [
                        1,
                        4,
                        2.3035421267695515
                    ],
                    [
                        1,
                        5,
                        1.9757895777117556
                    ],
                    [
                        1,
                        6,
                        1.9281256617428655
                    ],
                    [
                        1,
                        7,
                        4.2389188006004455
                    ],
                    [
                        2,
                        0,
                        6.630037718439121
                    ],
                    [
                        2,
                        1,
                        3.839968835663197
                    ],
                    [
                        2,
                        2,
                        5.923041415424212
                    ],
                    [
                        2,
                        3,
                        7.304737264880014
                    ],
                    [
                        2,
                        4,
                        3.8741151678994026
                    ],
                    [
                        2,
                        5,
                        6.132014594995307
                    ],
                    [
                        2,
                        6,
                        6.8905128380136995
                    ],
                    [
                        2,
                        7,
                        5.185940495537069
                    ],
                    [
                        3,
                        0,
                        2.8437539433958294
                    ],
                    [
                        3,
                        1,
                        3.804331329860097
                    ],
                    [
                        3,
                        2,
                        1.9574805353569324
                    ],
                    [
                        3,
                        3,
                        4.046322607986509
                    ],
                    [
                        3,
                        4,
                        4.062710992427242
                    ],
                    [
                        3,
                        5,
                        2.9524520523954614
                    ],
                    [
                        3,
                        6,
                        3.6556173879867924
                    ],
                    [
                        3,
                        7,
                        0.9293558271302143
                    ],
                    [
                        4,
                        0,
                        7.34779883325283
                    ],
                    [
                        4,
                        1,
                        5.131719897196758
                    ],
                    [
                        4,
                        2,
                        7.1328674977186965
                    ],
                    [
                        4,
                        3,
                        2.565068313420274
                    ],
                    [
                        4,
                        4,
                        7.937464995929352
                    ],
                    [
                        4,
                        5,
                        6.452668553548035
                    ],
                    [
                        4,
                        6,
                        5.945457986597645
                    ],
                    [
                        4,
                        7,
                        1.1699994404030605
                    ],
                    [
                        5,
                        0,
                        2.3493612412736127
                    ],
                    [
                        5,
                        1,
                        5.680550439668167
                    ],
                    [
                        5,
                        2,
                        5.141595223648208
                    ],
                    [
                        5,
                        3,
                        4.6585002106515105
                    ],
                    [
                        5,
                        4,
                        5.348229984537647
                    ],
                    [
                        5,
                        5,
                        3.6538870738936335
                    ],
                    [
                        5,
                        6,
                        3.9979759460413273
                    ],
                    [
                        5,
                        7,
                        5.197937657449703
                    ],
                    [
                        6,
                        0,
                        3.8111978780918703
                    ],
                    [
                        6,
                        1,
                        5.878996266052528
                    ],
                    [
                        6,
                        2,
                        5.877453303918838
                    ],
                    [
                        6,
                        3,
                        7.125268832643529
                    ],
                    [
                        6,
                        4,
                        7.060825086726281
                    ],
                    [
                        6,
                        5,
                        7.334468779205147
                    ],
                    [
                        6,
                        6,
                        7.176975186571491
                    ],
                    [
                        6,
                        7,
                        7.323677917035098
                    ],
                    [
                        7,
                        0,
                        1.4763499528064346
                    ],
                    [
                        7,
                        1,
                        6.4255371428399215
                    ],
                    [
                        7,
                        2,
                        2.104872353304838
                    ],
                    [
                        7,
                        3,
                        7.377494226460208
                    ],
                    [
                        7,
                        4,
                        2.892481758260259
                    ],
                    [
                        7,
                        5,
                        6.466018194137946
                    ],
                    [
                        7,
                        6,
                        1.7855049791429165
                    ],
                    [
                        7,
                        7,
                        1.5474326845678545
                    ]
                ]
            }]
        }),
        contour = chart.series[0],
        p = contour.points[63],
        tc = new TestController(chart);

    tc.moveTo(p.plotX + chart.plotLeft, p.plotY + chart.plotTop);

    contour.renderPromise.then(function () {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = contour.canvas.width;
        canvas.height = contour.canvas.height;
        ctx.drawImage(contour.image.element, 0, 0);

        const imgData = ctx.getImageData(
                p.plotX,
                p.plotY,
                canvas.width,
                canvas.height
            ).data,
            len = imgData.length;

        let lines = false;
        for (let i = 0; i < len; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];

            if (r === 255 && g === 0 && b === 0 && a === 255) {
                lines = true;
                break;
            }
        }

        assert.strictEqual(
            lines,
            true,
            'Contour lines should be rendered in correct color.'
        );
    });

    assert.strictEqual(
        chart.tooltip.label.text.textStr,
        // eslint-disable-next-line max-len
        '<span style="color: rgba(56.37076208068613,56.37076208068613,56.37076208068613, 1);">################</span>',
        'Tooltip should be colored correctly.'
    );
});
