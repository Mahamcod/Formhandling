


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
        submitHandler: function (form, event) {
            event.preventDefault();
            var contactId = $("#contactForm").data("id");

            if (contactId) {
                editContact(contactId);
            } else {
                addContact();
            }
        }
    });

    // Function to add a contact
    function addContact() {
        var contact = {
            Name: $("#name").val(),
            Email: $("#email").val(),
            Address: $("#address").val(),
            Phone: $("#phone").val(),
            City: $("#city").val()
        };

        $.ajax({
            url: "/Contact/AddContacts",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(contact),
            success: function (response) {
                if (response.success) {
                    var newRow = [
                        response.contact.Id,
                        response.contact.Name,
                        response.contact.Email,
                        response.contact.Phone,
                        response.contact.Address,
                        response.contact.City,
                        '<button class="btn-edit">Edit</button>' +
                        '<button class="btn-delete">Delete</button>'
                    ];
                    table.row.add(newRow).draw(false);
                    $('#contactForm')[0].reset();
                    $("#contactForm").data("id", "");
                    alert("Contact added successfully");
                } else {
                    console.error("Error adding contact:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error adding contact:", xhr.responseText);
            }
        });
    }




    // Function to delete a contact
    function deleteContact(id) {
        if (confirm("Are you sure you want to delete this contact?")) {
            $.ajax({
                url: '/Contact/DeleteContact/' + id,
                type: 'DELETE',
                success: function (result) {
                    if (result.success) {
                        var row = $('#dataTable').find('tr[data-id="' + id + '"]');
                        table.row(row).remove().draw(false);

                        alert("Contact deleted successfully");

                        // Delay the page reload to ensure the alert is displayed first
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        console.error("Error deleting contact:", result.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error deleting contact:", xhr.responseText);
                }
            });
        }
    }


    // Function to edit a contact
    //function editContact(id) {
    //    var contact = {
    //        Id: id,
    //        Name: $("#name").val(),
    //        Email: $("#email").val(),
    //        Phone: $("#phone").val(),
    //        Address: $("#address").val(),
    //        City: $("#city").val()
    //    };

    //    $.ajax({
    //        url: "/Contact/EditContact",
    //        type: "PUT",
    //        contentType: "application/json",
    //        data: JSON.stringify(contact),
    //        success: function (response) {
    //            if (response.success) {
    //                var row = table.row($('#dataTable').find('tr[data-id="' + id + '"]')).data([
    //                    response.contact.Id,
    //                    response.contact.Name,
    //                    response.contact.Email,
    //                    response.contact.Phone,
    //                    response.contact.Address,
    //                    response.contact.City,
    //                    '<button class="btn-edit">Edit</button>' +
    //                    '<button class="btn-delete">Delete</button>'
    //                ]).draw(false);
    //                alert("Contact updated successfully");

    //                $('#contactForm')[0].reset();
    //                $("#contactForm").data("id", "");
    //                $("#submitBtn").show();
    //                $("#updateBtn").hide();
    //            } else {
    //                console.error("Error updating contact:", response.message);
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            console.error("Error updating contact:", xhr.responseText);
    //        }
    //    });
    //}



    // Function to edit a contact
    function editContact(id) {
        var contact = {
            Id: id,
            Name: $("#name").val(),
            Email: $("#email").val(),
            Phone: $("#phone").val(),
            Address: $("#address").val(),
            City: $("#city").val()
        };

        console.log('Editing contact:', contact); // Debug statement

        $.ajax({
            url: "/Contact/EditContact",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(contact),
            success: function (response) {
                console.log('AJAX response:', response); // Debug statement

                if (response.success) {
                    var row = table.row($('#dataTable').find('tr[data-id="' + id + '"]')).data([
                        response.contact.Id,
                        response.contact.Name,
                        response.contact.Email,
                        response.contact.Phone,
                        response.contact.Address,
                        response.contact.City,
                        '<button class="btn-edit">Edit</button>' +
                        '<button class="btn-delete">Delete</button>'
                    ]).draw(false);
                    console.log('Before alert'); // Debug statement
                    alert("Contact updated successfully");
                    console.log('After alert'); // Debug statement

                    $('#contactForm')[0].reset();
                    $("#contactForm").data("id", "");
                    $("#submitBtn").show();
                    $("#updateBtn").hide();
                } else {
                    console.error("Error updating contact:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating contact:", xhr.responseText);
            }
        });
    }

    

    // Delegate edit and delete button clicks to the DataTable
    $('#dataTable').on('click', '.btn-edit', function () {
        var data = table.row($(this).closest('tr')).data();
        $("#name").val(data[1]);
        $("#email").val(data[2]);
        $("#phone").val(data[3]);
        $("#address").val(data[4]);
        $("#city").val(data[5]);
        $("#contactForm").data("id", data[0]);
        $("#submitBtn").hide();
        $("#updateBtn").show();
    });

    $('#dataTable').on('click', '.btn-delete', function () {
        var data = table.row($(this).closest('tr')).data();
        deleteContact(data[0]);
    });

    // Update button click event
    $("#updateBtn").on("click", function () {
        var contactId = $("#contactForm").data("id");
        if (contactId) {
            editContact(contactId);
        }

       
    });
});
