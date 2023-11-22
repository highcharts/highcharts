describe('KPI Component test', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/kpi-with-connector');
    });

    it('KPI Component should have a last value of the point when connector attached.', () => {
        cy.get('#kpi .highcharts-dashboards-component-kpi-value')
            .should('be.visible')
            .should('have.text', 1200);

        cy.get('#kpi-2 .highcharts-dashboards-component-kpi-value')
            .should('be.visible')
            .should('have.text', 'OTHER_VALUE');
    });

    it('KPI Component\'s value should change after selection to last visible point.', () => {
        cy.chart().then(chart => {
            chart.xAxis[0].setExtremes(null, Date.UTC(2019, 0, 7));
            cy.get('#kpi .highcharts-dashboards-component-kpi-value').should('have.text', 700);
            cy.get('#kpi-2 .highcharts-dashboards-component-kpi-value').should('have.text', 'OTHER_VALUE');
        });
    });
});

describe('Linking KPI value to chart point test', () => {
    before(() => {
        cy.visit('/dashboards/kpi-component/linked-value-to');
    });

    it('Value of the selected point should be equal to the KPI Component value', () => {
        cy.get('#kpi .highcharts-dashboards-component-kpi-value')
            .should('be.visible')
            .should('have.text', 1200);

        cy.chart().then(chart => {
            assert.strictEqual(
                chart.series[1].points[2].y,
                1200,
                'The point value is equal to the KPI value.'
            );
        });
    });

    it('The synced point should update with a change of the KPI value in extremes sync.', () => {
        cy.board().then(board => {
            const chartComponent = board.mountedComponents[1].component;
            const kpiComponent = board.mountedComponents[0].component;

            chartComponent.chart.xAxis[0].setExtremes(null, Date.UTC(2019, 0, 7));
            assert.strictEqual(
                kpiComponent.chart.series[1].points[2].y,
                700,
                'The point value is equal to the KPI value.'
            );

            kpiComponent.update({
                linkedValueTo: {
                    enabled: false
                }
            });

            chartComponent.chart.xAxis[0].setExtremes(null, Date.UTC(2019, 0, 12));
            assert.strictEqual(
                kpiComponent.chart.series[1].points[2].y,
                700,
                'The point Y value should remain the same after turning off the linkedValueTo option.'
            );
        });
    });
});