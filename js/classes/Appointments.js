import {ui} from "../app.js"; // Import UI instance from app.js

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

export default Appointments;