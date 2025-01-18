document.querySelector('form').addEventListener('submit', (event) => {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    if (!isValid) {
        event.preventDefault();
        alert('Please fill all required fields');
    }
});