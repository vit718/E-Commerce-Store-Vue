describe('Desktop: Empty cart - customer', () => {
	beforeEach(() => {
		cy.viewport('macbook-15')
	})
	it('wont see checkout button in cart.', () => {
		cy.visit('/')
		cy.get('[data-test="cart-button"]').click()
		cy.get('[data-test="cart-checkout-button"]').should('not.exist')
	})

	it('gets alert upon pressing pay in checkout without cart items.', () => {
		cy.visit('/checkout')
		cy.get('[data-test="checkout-button"]').click()
		cy.on('window:alert', (str) => {
			expect(str).to.equal('Shopping cart is empty!')
		})
	})
})

describe('Desktop: Filled cart - customer', () => {
	beforeEach(() => {
		cy.viewport('macbook-15')
		cy.visit('/keyboards')
		cy.get('[data-test="quick-add-keyboards-0"]').click().click()
		cy.get('[data-test="nav-deskmats"]').click()
		cy.get('[data-test="quick-add-deskmats-0"]').click()
		cy.get('[data-test="cart-bubble"]').contains(3)
		cy.get('[data-test="cart-button"]').click()
		cy.get('[data-test="cart-checkout-button"]').click()
		cy.get('[data-test="checkout-summary"]')
			.children()
			.should('contain', 'XX59')
			.and('contain', 'Grrr')
			.and('be.visible')
	})
	it('doesnt see "Required" labels upon first checkout visit.', () => {
		cy.url().should('include', '/checkout')
		cy.get('[data-test="text-input-name"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-email"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-phone"]')
			.contains('Required.')
			.should('not.not.be.visible')
		cy.get('[data-test="text-input-address"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-zip"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-city"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-country"]')
			.contains('Required.')
			.should('not.be.visible')
	})
	it('types in correct data, pays and goes back to home with button', () => {
		cy.get('[data-test="checkout-button"]').click()
		cy.url().should('include', '/checkout')
		cy.get('[data-test="text-input-field-name"]').type('Steven Bruben')
		cy.get('[data-test="text-input-field-email"]').type('steve@bruben.com')
		cy.get('[data-test="text-input-field-address"]').type('Alexanderplatz 12')
		cy.get('[data-test="text-input-field-zip"]').type('10178')
		cy.get('[data-test="text-input-field-city"]').type('Berlin')
		cy.get('[data-test="text-input-field-country"]').type('Germany')
		cy.get('[data-test="form-button-cash"]').click()
		cy.get('[data-test="form-text-area"]').type('Please send some stickers')
		cy.get('[data-test="checkout-button"]').click()
		cy.get('[data-test="checkout-success-modal"]')
			.children()
			.should('contain', 'XX59')
			.and('contain', 'and 1 other item')
			.and('be.visible')
		cy.get('[data-test="checkout-success-modal-button"]').click()
		cy.url().should('eq', 'http://localhost:5173/')
	})
	it('doesnt fill form, clicks pay without success and sees required fields.', () => {
		cy.get('[data-test="checkout-button"]').click()
		cy.url().should('include', '/checkout')
		cy.get('[data-test="checkout-success-modal"]').should('not.exist')
		cy.get('[data-test="text-input-name"]')
			.contains('Required.')
			.should('be.visible')
		cy.get('[data-test="text-input-email"]')
			.contains('Required.')
			.should('be.visible')
		cy.get('[data-test="text-input-phone"]')
			.contains('Required.')
			.should('not.be.visible')
		cy.get('[data-test="text-input-address"]')
			.contains('Required.')
			.should('be.visible')
		cy.get('[data-test="text-input-zip"]')
			.contains('Required.')
			.should('be.visible')
		cy.get('[data-test="text-input-city"]')
			.contains('Required.')
			.should('be.visible')
		cy.get('[data-test="text-input-country"]')
			.contains('Required.')
			.should('be.visible')
	})
	it('types in partially correct and some missing data, attempts to pay without success, fixes input and succeeds.', () => {
		cy.get('[data-test="checkout-button"]').click()
		cy.url().should('include', '/checkout')
		cy.get('[data-test="text-input-field-name"]').type('Steven Bruben')
		cy.get('[data-test="text-input-field-email"]').type('steve@bruben')
		cy.get('[data-test="text-input-field-address"]').type('Alexanderplatz 12')
		cy.get('[data-test="text-input-field-zip"]').type('10178')
		cy.get('[data-test="text-input-field-country"]').type('10178')
		cy.get('[data-test="form-button-emoney"]').click()
		cy.get('[data-test="form-text-area"]').type('Please send some stickers')
		cy.get('[data-test="checkout-button"]').click()
		cy.get('[data-test="checkout-success-modal"]').should('not.exist')

		cy.get('[data-test="text-input-name"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-email"]')
			.contains('Must be a valid email address.')
			.should('be.visible')
		cy.get('[data-test="text-input-email"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-phone"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-address"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-zip"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-city"]')
			.contains('Required.')
			.should('be.visible')

		cy.get('[data-test="text-input-country"]')
			.contains('Must contain non-special characters.')
			.should('be.visible')

		cy.get('[data-test="text-input-country"]')
			.contains('Required.')
			.should('not.be.visible')

		cy.get('[data-test="text-input-field-email"]')
			.clear()
			.type('steve@bruben.com')
		cy.get('[data-test="text-input-field-city"]').type('Berlin')
		cy.get('[data-test="text-input-field-country"]').clear().type('Germany')
		cy.get('[data-test="checkout-button"]').click()

		cy.get('[data-test="checkout-success-modal"]')
			.children()
			.should('contain', 'XX59')
			.and('contain', 'and 1 other item')
			.and('be.visible')
		cy.get('[data-test="checkout-success-modal-button"]').click()

		cy.url().should('eq', 'http://localhost:5173/')
	})
})
// describe('Mobile: checkout', () => {
// 	it('alerts when no items in cart', () => {
// 		cy.visit('/')
// 	})
// })
