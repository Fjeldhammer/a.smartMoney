function displayMessage() {
    let inputBox = document.getElementById('message');

    let message = inputBox.value;

    Swal.fire(
        {
            backdrop: false,
            title: 'Smart Money',
            text: message
        }
    );
}

