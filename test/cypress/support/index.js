import "@cypress-audit/lighthouse/commands";

const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand();

Cypress.Commands.add('board', () =>
    cy.window().its('Dashboards.boards').should('have.length.gte', 1).then(boards => {
        const [board] = boards;
        return board;
    })
);

Cypress.Commands.add('boardRendered', () =>
    cy.board().then(async board => {
        await Cypress.Promise.all(
            board.mountedComponents.map(async ({ component }) => {
                return new Cypress.Promise((resolve, reject) => {
                    let attempts = 0;

                    setInterval(() => {
                        // If highcharts component, wait for chart to be rendered
                        if (component.type === 'Highcharts') {
                            const allSeriesRendered = component.chart.series.every(
                                series => series.hasRendered && series.finishedAnimating
                            );

                            if (allSeriesRendered) {
                                resolve(component)
                            }

                        } else if (component) {
                            resolve(component)
                        }

                        attempts++;

                        if (attempts > 10) {
                            reject('Took more than 10 attempts')
                        }

                    }, 400)

                })
            }
            )
        )
    })
);

Cypress.Commands.add('toggleEditMode', () => {
    cy.get('body').then($body => {
        const $toggle = $body.find('.highcharts-dashboards-edit-toggle-container:visible');
        if ($toggle.length) {
            cy.get('.highcharts-dashboards-edit-toggle-container').click();
        } else {
            cy.get('.highcharts-dashboards-edit-context-menu-btn').click();
            cy.get('.highcharts-dashboards-edit-toggle-slider').first().click();
        }
    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})
