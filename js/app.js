// UI Class
class UI {

    constructor () {
        this.form = document.querySelector('#form-appointment');
    }

    showMessage (message, type) {
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');
        if (type === 'error') {
            div.classList.add('alert-danger');
        } else {
            div.classList.add('alert-success');
        }
        // Add text
        div.appendChild(document.createTextNode(message));
        // Insert into DOM
        document.querySelector('.primario').insertBefore(div, this.form);
        // Remove alert after 3 seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
        // Reset form
        this.form.reset();
    }
}

// Form Class
/**
 * Custom class to validate form
 * Form Page - Singleton Pattern
 * @author Fer Catalano
 */
class Validate_Form {

    form = null;
    inputs = null;
    send = null;
    reset = null;
    spinner = null;
    instance = null;
    
    constructor() {

        // Singleton Pattern
        if (typeof Validate_Form.instance === "object") {
            return Validate_Form.instance;
        }

        Validate_Form.instance = this;
    }
    
    init() {
        this.form = document.getElementById('form-appointment');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.send = document.getElementById('submit');
        this.spinner = document.getElementById('spinner');
        // Listeners
        this.eventsListener();
    }

    eventsListener() {
        // Loop on inputs to add event listener
        this.inputs.forEach(input => input.addEventListener('blur', this.validate.bind(this)) );
        // Add event listener
        this.send.addEventListener('click', this.sendForm.bind(this));
    }

    validate(e) {
        // Check complete form
        if(!this.checkCompleteForm()) {
            // Disable send button
            this.send.setAttribute('disabled', true);
            this.send.classList.add('opacity-50');
        }

        // Remove error
        this.removeError(e.target);

        // Validate required
        if(e.target.value.trim() === '') {
            // Add error input
            e.target.classList.remove('bg-green-300');
            e.target.classList.add('border-red-600');
            // Show error
            this.showAlert(`El campo ${e.target.name} es requerido`, e.target);
            return;
        }

        // Validate email
        if(e.target.type === 'email' && !this.validateEmail(e.target)) {
            // Add error input
            e.target.classList.remove('bg-green-300');
            e.target.classList.add('border-red-600');
            // Show error
            this.showAlert('The email is not valid', e.target);
            return;
        }

        // Check complete form
        if(this.checkCompleteForm()) {
            // Enable send button
            this.send.removeAttribute('disabled');
            this.send.classList.remove('opacity-50');
        }
    }

    validateEmail(elem) {
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        if(!regex.test(elem.value)) return false;
        return true;
    }

    showAlert(message, elem, status = 'error') {
        // Check if there is already an error
        const parent = elem.parentElement;
        if (parent.querySelectorAll('.text-danger').length > 0) return;
        // Create notification
        const notif = document.createElement('p');
        notif.textContent = message;
        if (status === 'success') {
            notif.classList.add('text-green', 'text-center');
        } else {
            notif.classList.add('text-danger','text-red','text-right');
        }
        // Insert error before send button in form
        parent.appendChild(notif);
    }

    removeError(elem) {    
        elem.classList.remove('border-red-600');
        elem.classList.add('bg-green-300');
        const parent = elem.parentElement;
        const error = parent.querySelector('.text-danger');
        if(error) parent.removeChild(error);
    }

    /**
     * Checks if the form is complete by looking for error messages.
     *
     * @return {boolean} true if the form is complete, false otherwise
     */
    checkCompleteForm() {
        const errors = this.form.querySelectorAll('.text-danger');
        const inputs = this.form.querySelectorAll('input, textarea');

        // Check if there are errors
        if(errors.length > 0) return false;

        // Check if there are empty inputs
        const emptyInputs = [...inputs].filter(input => input.value.trim() === '');
        if(emptyInputs.length > 0) return false;

        return true;
    }

    resetForm() {
        // Remove notifications
        const notifs = document.querySelectorAll('.text-danger, .text-green');
        if(notifs.length > 0) {
           notifs.forEach(notif => notif.remove());
        }
        // Reset form fields
        this.inputs.forEach(input => input.value = '');
        // Disable send button
        this.send.setAttribute('disabled', true);
        this.send.classList.add('opacity-50');
    }

    sendForm(e) {
        e.preventDefault();
        // Show spinner
        this.spinner.classList.remove('hidden');
        // Hide spinner after 3 seconds
        setTimeout(() => {
            this.spinner.classList.add('hidden');
            // reset form
            this.resetForm();
            // Show success message
            this.showAlert('Cita creada correctamente', this.form, 'success');
        }, 3000);

        setTimeout(() => this.resetForm(), 5000);
    }

}

// Variables Globales
let ui = new UI();

// Events
document.addEventListener('DOMContentLoaded', () => {
    let validateForm = new Validate_Form();
    validateForm.init();
});
