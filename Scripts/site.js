

$(document).ready(function () {
    // Initialize DataTable
    var table = $('#dataTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Initialize form validation
    $("#contactForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 15
            },
            city: {
                required: true
            },
            address: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Your name must be at least 2 characters long"
            },
            email: {
                required: "Please enter your email address",
                email: "Please enter a valid email address"
            },
            phone: {
                required: "Please enter your phone number",
                digits: "Please enter only digits",
                minlength: "Your phone number must be at least 10 characters long",
                maxlength: "Your phone number must not exceed 15 characters"
            },
            city: {
                required: "Please select your city"
            },
            address: {
                required: "Please enter your address",
                minlength: "Your address must be at least 10 characters long"
            }
        },
        submitHandler: function (form) {
            addContact();
        }
    });

    // Function to add a contact
    function addContact() {
        // Collect form data
        var contact = {
            Name: $("#name").val(),
            Email: $("#email").val(),
            Address: $("#address").val(),
            Phone: $("#phone").val(),
            City: $("#city").val()
        };

        // AJAX request to add contact
        $.ajax({
            url: "/Contact/AddContacts",
            type: "POST",
            contentType: "application/json", // Send data as JSON
            data: JSON.stringify(contact), // Convert object to JSON string
            success: function (response) {
                if (response.success) {
                    // Add new row to DataTable
                    var newRow = [
                        response.contact.Name,
                        response.contact.Email,
                        response.contact.Phone,
                        response.contact.Address,
                        response.contact.City
                    ];
                    table.row.add(newRow).draw(false);

                    // Clear form fields
                    $('#contactForm')[0].reset();

                    // Alert for submission
                    alert('Form submitted successfully!');
                } else {
                    alert('Error submitting form: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle error
                console.error(xhr.responseText);
                alert('Error submitting form. Please try again.');
            }
        });
    }

    // Click handler for additional validation
    $('#validateBtn').click(function () {
        validateInput('#name');
        validateInput('#email');
        validateInput('#phone');
        validateInput('#address');
    });

    // Function to validate input fields
    function validateInput(selector) {
        var inputValue = $(selector).val().trim();
        if (inputValue === '') {
            $(selector).css('border-color', 'red');
            // Optionally, show an error message or perform other actions
        } else {
            $(selector).css('border-color', '');
        }
    }
});










