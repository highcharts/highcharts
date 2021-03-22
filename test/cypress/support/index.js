Cypress.Commands.add('zoom', chartElement => {
    return cy.get(chartElement)
        .trigger('mousedown', 50)
        .trigger('mousemove', { x: 50, y: 50 })
        .trigger('mouseup')
})

Cypress.Commands.add('pan', chartElement => {
    return cy.get(chartElement)
        .trigger('mousedown', { shiftKey: true })
        .trigger('mousemove', { x: 50, y: 50, shiftKey: true })
        .trigger('mouseup')
})
