describe('Dashboards climate demo visual tests', () => {
    before(() => {
        cy.intercept('/**/*.csv').as('getData');
        cy.visit('/dashboards/demo/climate');
        cy.wait('@getData', {timeout: 100000}) // wait for data to be laoded
    })

    it('Climate demo', () => {
        cy.boardRendered()
        cy.get('#demo-content')
            .compareSnapshot('dashboard-climate-loaded', 0.1);
    })

    it('edit mode', () => {
        cy.toggleEditMode()
        cy.get('.highcharts-dashboards-component').first().click()
        cy.get('#demo-content')
            .compareSnapshot('dashboard-climate-edit-mode', 0.1);

    })
});

describe('Test the rest', () => {
    const DEMOS_TO_VISUALLY_TEST = [
        '/dashboards/demo/minimal'
    ]

    for (const demo of DEMOS_TO_VISUALLY_TEST) {
        it('visually comparison after load ' + demo, () => {
            cy.visit(demo);
            cy.boardRendered();

            cy.get('#demo-content')
                .compareSnapshot(
                    demo.replace('/', '')
                        .replace(/\//g, '-') + '-loaded',
                    0.1
                );
        })
    }
})
