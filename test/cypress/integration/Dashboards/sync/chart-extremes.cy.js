/**
* Tests that two charts have the same min and max values on their first x and y axis
*/
function testAxes(currentChart, comparisionChart) {
    ['yAxis', 'xAxis'].forEach(axisName => {
        cy.wrap(currentChart)
            .its(axisName).should('have.length', 1)
            .then((axes) => {
                const [axis] = axes;
                ['min', 'max'].forEach(prop => {
                    cy.wrap(axis).its(prop).should('exist').then(value => {
                        cy.wrap(comparisionChart[axisName][0][prop]).should('eq', value)
                    })
                })
            })
    })

}

describe('Chart extremes sync', () => {
    before(() => {
        cy.visit('/dashboards/cypress/sync-chart-extremes');
    });

    it('Dashboard should be rendered', () => {
        cy.boardRendered()
    });

    /**
     * Notes:
     *  In this sample all the series comes from the same data table,
     *  without any special tinkering, so there should be no issues with varying data sizes between axes.
     */

    it('should sync selection', () => {
        cy.get('.highcharts-container').first().as('firstchart')

        cy.zoom('@firstchart')

        // All charts should now have
        cy.get('.highcharts-reset-zoom').should('have.length', 3)

        cy.window().its('Highcharts.charts').should('not.have.length', 0)
            .then(charts => {

                cy.wrap(charts).each((chart, index, chartList) => {
                    cy.wrap(chart).its('resetZoomButton').should('not.be.undefined');
                    testAxes(chart, chartList[0])
                })
            })


        // Click on reset in the first chart
        cy.get('@firstchart').within(() => {
            cy.get('.highcharts-reset-zoom').click()
        })

        cy.window().its('Highcharts.charts').then(charts => {
            cy.wrap(charts).each((chart, i) => {
                // TODO: update to test that other charts do/don't reset
                if(i === 0){
                    cy.wrap(chart).its('resetZoomButton').should('be.undefined')
                }
            })
        })
    })

    it('should sync panning', () => {
        cy.get('.highcharts-container').first().as('firstchart')
        cy.zoom('@firstchart')

        cy.window().its('Highcharts.charts').then(charts => {
            cy.wrap(charts).each(chart => {
                testAxes(chart, charts[0])
            })
        })
        // Do the pan
        cy.pan('@firstchart')

        cy.window().its('Highcharts.charts').then(charts => {
            cy.wrap(charts).each(chart => {
                testAxes(chart, charts[0])
            })
        })
    })
});

describe('Chart extreme sync zooming when min or max stays the same', () => {
    before(() => {
        cy.visit('/dashboards/demo/sync-extremes');
    });

    it('All charts should be synced', () => {
        cy.boardRendered();
        cy.board().then($el => {
            const chart = $el.mountedComponents[0].component.chart,
                chart2 = $el.mountedComponents[1].component.chart;

            chart.xAxis[0].setExtremes(0, 5);

            assert.closeTo(
                chart2.xAxis[0].min,
                chart.xAxis[0].min,
                0.5,
                'X-axis min should be equal in both charts.'
            );

            assert.closeTo(
                chart2.xAxis[0].max,
                chart.xAxis[0].max,
                0.5,
                'X-axis max should be equal in both charts.'
            );
        });
    });
});
