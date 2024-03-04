// Appointments Class
class Appointments {

    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('citas')) || [];
    }

    getAppointment(id) {
        return this.appointments.filter(appointment => appointment.id === Number(id))[0];
    }

    setAppointment(object) {
        // Add Id to each appointment
        this.appointments = [...this.appointments, {...object, id: Date.now()}];
        // Set localStorage
        localStorage.setItem('citas', JSON.stringify(this.appointments));
        // Create html
        ui.createHTML(this.appointments);
        // Show success message
        ui.showMessage('Cita creada correctamente', 'success');
    }

    updateAppointment(object) {
        // Map recorre el arreglo y devuelve un nuevo arreglo
        // Recorre el arreglo
        // si el id es igual al id de la cita que queremos actualizar
        // de lo contrario, devuelve la misma cita
        this.appointments = this.appointments.map(appointment => Number(appointment.id) === Number(object.id) ? object : appointment);
        // Set localStorage
        localStorage.setItem('citas', JSON.stringify(this.appointments));
        // Create html
        ui.createHTML(this.appointments);
        // Show success message
        ui.showMessage('Cita actualizada correctamente', 'success');
    }

    deleteAppointment(id) {
        // Filter appointments
        this.appointments = this.appointments.filter(appointment => appointment.id !== Number(id));
        // Set localStorage
        localStorage.setItem('citas', JSON.stringify(this.appointments));
        // Create html
        ui.createHTML(this.appointments);
        // Show success message
        ui.showMessage('Cita eliminada correctamente', 'success');
    }

    syncronize() {
        if (this.appointments.length !== 0) {
            ui.createHTML(this.appointments);
        }
    }
}
// UI Class
class UI {

    init () {
        this.form = document.querySelector('#form-appointment');
        this.citasList = document.querySelector('#citas');
        // Delete course
        this.citasList.addEventListener('click', this.actionsAppointments.bind(this) );
    }

    createHTML(appointments) {
        const html = appointments.map(appointment => {
            return `
                <li class="list-group-item">
                    <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${appointment.name}</span></p>
                    <p class="font-weight-bold">Propietario: <span class="font-weight-normal">${appointment.owner}</span></p>
                    <p class="font-weight-bold">Teléfono: <span class="font-weight-normal">${appointment.phone}</span></p>
                    <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${appointment.date}</span></p>
                    <p class="font-weight-bold">Hora: <span class="font-weight-normal">${appointment.time}</span></p>
                    <p class="font-weight-bold">Sintomas: <span class="font-weight-normal">${appointment.symptoms}</span></p>
                    <div class="row justify-content-center">
                        <button class="btn btn-danger btn-delete btn-sm mx-1" data-id="${appointment.id}">Eliminar &times;</button>
                        <button class="btn btn-success btn-edit btn-sm mx-1" data-id="${appointment.id}">Editar &check;</button>
                    </div>
                </li>
            `;
        });
        const list = document.querySelector('#citas');
        list.innerHTML = html.join('');
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
        document.querySelector('.agregar-cita').insertBefore(div, this.form);
        // Remove alert after 3 seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
        // Reset form
        this.form.reset();
    }

    actionsAppointments(e) {
        // Delete Course
        if (e.target.classList.contains('btn-delete')) {
            const courseId = e.target.getAttribute('data-id');
            appointment.deleteAppointment(courseId);
        }

        // Edit Course
        if (e.target.classList.contains('btn-edit')) {
            const courseId = e.target.getAttribute('data-id');
            validateForm.editAppointment(courseId);
        }
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

    editAppointment(id) {
        // Get appointment
        const appo = new Appointments();
        const appointment = appo.getAppointment(id);
        // Set values in inputs
        this.inputs.forEach(input => input.value = appointment[input.name]);
        // Set ID in hidden input   
        this.form.querySelector('input[name="id"]').value = id;
        // change send button text
        this.send.innerText = 'Actualizar Cita';
        // Enable send button
        this.send.removeAttribute('disabled');
        this.send.classList.remove('opacity-50');
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
        if(e.target.type !== 'hidden' && e.target.value.trim() === '') {
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
        const emptyInputs = [...inputs].filter(input => {
            if (input.type !== 'hidden') {
                input.value.trim() === ''
            }
        });
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
        // Create object
        const obj = {};
        this.inputs.forEach(input => obj[input.name] = input.value);

        if (this.form.querySelector('input[name="id"]').value !== '') {
            // Update appointment
            appointment.updateAppointment({...obj});
        } else {
            // Create appointment
            appointment.setAppointment({...obj});
        }
        // Hide spinner after 3 seconds
        setTimeout(() => {
            this.spinner.classList.add('hidden');
            // reset form
            this.resetForm();
        }, 3000);
    }

}

// Instanciar Clases
const ui = new UI();
const appointment = new Appointments();
const validateForm = new Validate_Form();

// Init
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
    validateForm.init();
    appointment.syncronize();
});
