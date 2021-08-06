Cypress.Commands.add('zoom', chartElement => {
    return cy.get(chartElement)
        .trigger('mouseenter')
        .trigger('mousedown', 50)
        .trigger('mousemove', 50, 50)
        .trigger('mouseup')
})

Cypress.Commands.add('pan', chartElement => {
    return cy.get(chartElement)
        .trigger('mouseenter')
        .trigger('mousedown', { shiftKey: true })
        .trigger('mousemove', { x: 50, y: 50, shiftKey: true })
        .trigger('mouseup')
})

Cypress.Commands.add('chart', () =>
    cy.window().then(win => new Cypress.Promise((resolve, reject) => {
        const H = win.Highcharts;
        if (H) {
            if (H.charts[0]) {
                resolve(H.charts[0]);
            } else {
                const unbind = H.addEvent(H.Chart, 'load', function() {
                    unbind();
                    resolve(this);
                });
            }
        } else {
            reject(new Error('No Highcharts :('));
        }
    }))
);

Cypress.Commands.add('openIndicators', () =>
    cy.get('.highcharts-indicators .highcharts-menu-item-btn')
        .click()
);

Cypress.Commands.add('addIndicator', () =>
    cy.get('.highcharts-popup-rhs-col')
        .children('.highcharts-popup button')
        .eq(0)
        .click()
);
