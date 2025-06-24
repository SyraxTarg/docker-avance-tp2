import React from 'react'
import Footer from '@/app/components/footer'


describe('<Footer />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Footer />)
  })
})
