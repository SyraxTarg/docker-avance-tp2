describe('Navigation to events page', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.get('a[href*="/events"]').first().click()

    cy.url().should('include', '/events')
  })
})