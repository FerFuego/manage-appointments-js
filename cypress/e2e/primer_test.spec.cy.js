/// <reference types="cypress" />

context('Test Appointments', () => {
	beforeEach(() => {
		cy.visit('http://127.0.0.1:5500/manage-appointments-js/index.html')
	})

	it('Test Heading', () => {
		// Validar el encabezado simple
		//cy.get('h2.titulo').contains('Administrador de Pacientes de Veterinaria')

		// Validar el encabezado mejorada
		cy.get('h2.titulo')
			.invoke('text')
			.should('equal', 'Administrador de Pacientes de Veterinaria')

		cy.get('h2.titulo')
			.invoke('text')
			.should('not.equal', 'administrador de pacientes de veterinaria')

		// Validar que el form sea visible
		cy.get('#form-appointment').should('be.visible')

		// Validar el encabezado mejorada
		cy.get('[data-cy="citas-heading"]')
			.invoke('text')
			.should('equal', 'Administra tus Citas')

	})

	it('Test Form Error', () => {
		// Validar que el submit no funcione
		cy.get('button[type=submit]').should('be.disabled')

		// interactuar con el form (insertar datos)
		cy.get('#form-appointment').within(() => {
			cy.get('#name').type('Firulais')
			cy.get('#owner').click()
			cy.get('#phone').click()
		})

		cy.get('button[type=submit]').should('be.disabled')

		// cy.get('button[type=submit]').click()

		// Use once() binding for just this fail
		// cy.once('fail', (err) => {
		// Capturing the fail event swallows it and lets the test succeed
		// Now look for the expected messages
		//   expect(err.message).to.include('cy.click() failed because this element is not clickable at point');
		//   done();
		// });

		// comprueba que no se haya agregado las citas
		cy.get('#citas li').should('have.length', 0)
	})

	it('Test Insert Appointment', () => {
		// Validar que el submit no funcione
		cy.get('button[type=submit]').should('be.disabled')

		// interactuar con el form (insertar datos)
		cy.get('#form-appointment').within(() => {
			cy.get('#name').type('Firulais')
			cy.get('#owner').type('Fer')
			cy.get('#phone').type('1234567890')
			cy.get('#date').type('2022-01-01')
			cy.get('#time').type('10:00')
			cy.get('#symptoms').type('Dolor de cabeza')
			cy.get('#name').click()
			cy.get('button[type=submit]').click()
		})

		// Validar que se hayan agregado las citas
		cy.get('#citas li').should('have.length', 1)
	})

	it('Test Edit Appointment', () => {
		// Agregar una nueva cita
		cy.get('#form-appointment').within(() => {
			cy.get('#name').type('Firulais')
			cy.get('#owner').type('Fer')
			cy.get('#phone').type('1234567890')
			cy.get('#date').type('2022-01-01')
			cy.get('#time').type('10:00')
			cy.get('#symptoms').type('Dolor de cabeza')
			cy.get('#name').click()
			cy.get('button[type=submit]').click()
		})
		// Validar que se hayan agregado las citas
		cy.get('#citas li').should('have.length', 1)
		// Validar que se hayan citas
		cy.get('#citas li').should('have.length', 1)
		// Editar la nueva cita
		cy.get('#citas li').first().find('button.btn-edit').click()
		cy.get('#symptoms').clear().type('Dolor de pata')
		cy.get('form button[type=submit]').click()
		// Validar que se hayan editado las citas
		cy.get('#citas li').should('have.length', 1)
		// Validar que se hayan editado las citas
		cy.get('#citas li').first().find('p span').eq(5).should('have.text', 'Dolor de pata')
	})

	it('Test Delete Appointment', () => {
		// Agregar una nueva cita
		cy.get('#form-appointment').within(() => {
			cy.get('#name').type('Firulais')
			cy.get('#owner').type('Fer')
			cy.get('#phone').type('1234567890')
			cy.get('#date').type('2022-01-01')
			cy.get('#time').type('10:00')
			cy.get('#symptoms').type('Dolor de cabeza')
			cy.get('#name').click()
			cy.get('button[type=submit]').click()
		})
		// Validar que se hayan citas
		cy.get('#citas li').should('have.length', 1)
		// Eliminar la nueva cita
		cy.get('#citas li').first().find('button.btn-delete').click()
		// Validar que se hayan eliminado las citas
		cy.get('#citas li').should('have.length', 0)
	})
})