describe('Adding custom indicator on a separate axis through indicator popup, #15804.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('#15730: Should close popup after hiding annotation', () => {
        // Add custom indicator which should use another axis.
        cy.window().then((win) => {
            const H = win.Highcharts,
                bindingsUtils =
                    H._modules['Extensions/Annotations/NavigationBindings.js']
                        .prototype.utils;

            H.seriesType(
                'customIndicatorBasedOnRSI',
                'rsi',
                {
                    name: 'Custom Indicator',
                    color: 'red'
                },
                {}
            );
            bindingsUtils.indicatorsWithAxes.push('customIndicatorBasedOnRSI');
        });

        cy.openIndicators();
        cy.get('.highcharts-indicator-list')
            .contains('CUSTOMINDICATORBASEDONRSI')
            .click();
        cy.addIndicator();

        cy.chart().should((chart) =>
            assert.strictEqual(
                chart.yAxis.length,
                4,
                `After adding a custom indicator that is based on other oscillators,
                another axis should be added.`
            )
        );
    });
});
