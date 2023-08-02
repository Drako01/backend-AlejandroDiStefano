function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.toggle-password');
    const isPasswordVisible = passwordInput.getAttribute('type') === 'text';

    if (isPasswordVisible) {
        passwordInput.setAttribute('type', 'password');
        passwordToggle.innerHTML = 'Ver'; // Remove the text content
        
    } else {
        passwordInput.setAttribute('type', 'text');
        passwordToggle.innerHTML = ''; // Remove the text content
        passwordToggle.innerHTML = 'Ocultar'; 
    }
}

