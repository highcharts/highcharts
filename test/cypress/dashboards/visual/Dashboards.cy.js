describe('Dashboards climate demo visual tests', () => {
    const VP_TIMEOUT = 5000;

    before(() => {
        cy.intercept('/**/*.csv').as('getData');
        cy.visit('/dashboards/demo/climate');
        cy.wait('@getData', {timeout: 100000}) // wait for data to be loaded
    });

    it('Climate demo', () => {
        cy.boardRendered();
        cy.get('g.highcharts-markers.highcharts-series-1.highcharts-mappoint-series')
            .children('.highcharts-point', { timeout: 10000 }).should('have.length', 6);
        cy.get('#demo-content').compareSnapshot('dashboard-climate-loaded', 0.1);
    });

    it('edit mode', () => {
        cy.toggleEditMode();
        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('#demo-content').compareSnapshot('dashboard-climate-edit-mode', 0.1);
    });

    it('small screen vertical', () => {
        cy.toggleEditMode();
        cy.viewport('iphone-x').wait(VP_TIMEOUT);
        cy.get('#demo-content').compareSnapshot('dashboard-climate-mobile-vertical', 0.1);
    });

    it('small screen horizontal', () => {
        cy.viewport('iphone-x', 'landscape').wait(VP_TIMEOUT);
        cy.get('#demo-content').compareSnapshot('dashboard-climate-mobile-horizontal', 0.1);
    });
});

describe('Test the rest', () => {
    const DEMOS_TO_VISUALLY_TEST = [
        '/dashboards/demo/minimal',
        '/dashboards/responsive/responsive-breakpoints'
    ];
    const VP_TIMEOUT = 5000;

    for (const demo of DEMOS_TO_VISUALLY_TEST) {
        const name = demo.replace('/', '').replace(/\//g, '-');

        it('visually comparison after load ' + demo, () => {
            cy.visit(demo);
            cy.boardRendered();
            cy.get('#demo-content').compareSnapshot(name + '-loaded', 0.1);
        });

        it('small screen vertical ' + demo, () => {
            cy.viewport('iphone-x').wait(VP_TIMEOUT);
            cy.get('#demo-content').compareSnapshot(name + '-mobile-vertical', 0.1);
        });

        it('small screen horizontal ' + demo, () => {
            cy.viewport('iphone-x', 'landscape').wait(VP_TIMEOUT);
            cy.get('#demo-content').compareSnapshot(name + '-mobile-horizontal', 0.1);
        });
    }
});

