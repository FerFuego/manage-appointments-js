import UI from "./classes/UI.js";
import Appointments from "./classes/Appointments.js";
import Validate_Form from "./classes/Validate_Form.js";

// Instanciar Clases
export const ui = new UI();
export const appointment = new Appointments();
export const validateForm = new Validate_Form();

// Init
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
    validateForm.init();
    appointment.syncronize();
});
