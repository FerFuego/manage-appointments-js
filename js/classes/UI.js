import {validateForm} from "../app.js";
import {appointment} from "../app.js";

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

export default UI;