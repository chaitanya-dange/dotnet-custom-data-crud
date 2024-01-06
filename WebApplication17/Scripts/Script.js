
var computerInformation = [
    {
        "ComputerName": "DESKTOP-Q459ROD",
        "Group": "Test",
        "Policy": "SP New",
        "OperatingSystem": "Windows 10 64-bit"
    },
    {
        "ComputerName": "LAPTOP-ABC123",
        "Group": "Production",
        "Policy": "Security Policy",
        "OperatingSystem": "Windows 11 64-bit"
    },
    {
        "ComputerName": "SERVER-XYZ789",
        "Group": "Server",
        "Policy": "Server Policy",
        "OperatingSystem": "Windows Server 2019"
    },
    {
        "ComputerName": "PC-123",
        "Group": "Desktop",
        "Policy": "Standard Policy",
        "OperatingSystem": "Windows 10"
    }
    // Add more objects as needed
];



$(document).ready(function () {
    
    // Call the function to populate the table
    populateTable();
});






function populateTable() {
    var table = $("#computerTable tbody");
    var targetTable = $("#computerTableForm3 tbody");
    var secondTableHeader = $("#computerTableForm3 th:eq(1)");

    var searchInput = $("#searchForm2");
    var pager = $("#stepTwoPager");

    // Clear existing rows
    table.empty();
    targetTable.empty();

    // Keep track of selected rows
    var selectedRows = [];

    // Loop through the array and append rows to the table
    $.each(computerInformation, function (index, computerInfo) {
        var row = "<tr class='small-font'>" +
            "<td class='computer-name'>" + computerInfo.ComputerName + "</td>" +
            "<td>" + computerInfo.Group + "</td>" +
            "<td>" + computerInfo.Policy + "</td>" +
            "<td>" + computerInfo.OperatingSystem + "</td>" +
            "</tr>";

        table.append(row);
    });

    // Add click event listener to rows in the computerTable
    searchInput.on("input", function () {
        // Show all rows when the search input is cleared
        if (searchInput.val() === "") {
            table.find("tr").show();
        } else {
            var searchTerm = searchInput.val().toLowerCase();

            table.find("tr").each(function (index, row) {
                var rowText = $(row).text().toLowerCase();

                // Show or hide rows based on search term
                if (rowText.includes(searchTerm)) {
                    $(row).show();
                } else {
                    $(row).hide();
                }
            });
        }

        // Update the pager based on all rows
       
    });

    var totalRows = table.find("tr").length;
    pager.text("Page 1 of 1 (" + totalRows + " items)");

    table.find('tr').click(function (event) {
        // Toggle the 'selected' class on the clicked row
        $(this).toggleClass('selected');

        // Get the computer name from the clicked row
        var computerName = $(this).find('.computer-name').text();

        // Check if the row is selected or not
        if ($(this).hasClass('selected')) {
            // If selected, add the computer name to the selectedRows array
            selectedRows.push(computerName);
        } else {
            // If deselected, remove the computer name from the selectedRows array
            var index = selectedRows.indexOf(computerName);
            if (index !== -1) {
                selectedRows.splice(index, 1);
            }
        }

        // Clear existing rows in the target table
        targetTable.empty();

        // Append rows with the selected computer names to the target table
        $.each(selectedRows, function (index, selectedComputerName) {
            var targetRow = "<tr class='small-font'>" +
                "<td style=' width: 300px; border-left: 2px solid orange;' >" + selectedComputerName + "</td>" +
                "<td class='frmThrSecColVal' style='background-color: #B9D9EB; width: 100px;' ></td>" +
                "</tr>";

            targetTable.append(targetRow);
        });

        // Set the text of the second column heading in the target table
        secondTableHeader.text($("#PackageName").val());
    });
}




function clearDefault(element) {
    if (element.value == element.defaultValue) {
        element.value = '';
    }
}

function setDefault(element) {
    if (element.value === '') {
        element.value = element.defaultValue;
    }
}

function search() {
    // Implement your search logic here
    var searchTerm = document.getElementById('search-box').value;
    alert('Searching for: ' + searchTerm);
}



//------------------------ split dropdown -------------




// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-menu");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

$(document).ready(function () {
    
   

    // Bind the change event to the checkboxes
    $('.data-id').change(function () {
        // Call the function to check the state of checkboxes
        checkCheckboxState();
    });

    // Initial check of checkbox state when the page loads
    checkCheckboxState();
});

// Function to check the state of checkboxes and enable/disable buttons
function checkCheckboxState() {
    var anyCheckboxSelected = $('.data-id:checked').length > 0;
    $('#editBtn, #dltBtnPopUp').prop('disabled', !anyCheckboxSelected);
    /* $('.blur-effect').toggleClass('blur', !anyCheckboxSelected);*/
}



 //------------- delete functinality ------------

$(document).ready(function () {

    $('#editHeaderCloseBtn, #editFooterClose, #dltModalHeaderClose, #dltModalFooterCl').click(function () {

        $('.data-id:checked').prop('checked', false);
        $('#selectAllCheckbox').prop('checked', false);
        
        // Show the modal with ID 'CustomeScriptBtn'
        $('#CustomeScriptBtn').modal('show');
        
        $("#addTopBtn").prop("disabled", false);
        $("#editBtn").prop("disabled", true);
        $("#dltBtnPopUp").prop("disabled", true);
    });



    $('#dltBtnPopUp').click(function () {
        debugger;

        // Get all the selected checkboxes
        var selectedCheckboxes = $('.data-id:checked');

        // Check if at least one checkbox is selected
        if (selectedCheckboxes.length > 0) {
            // Get an array of selected IDs
            var selectedIds = selectedCheckboxes.map(function () {
                return this.value;
            }).get();

            $.ajax({
                url: "/Home/Delete", // Correct the endpoint URL
                method: "GET",
                data: { ids: selectedIds }, // Pass the array of IDs to the server
                traditional: true, // Ensure that the array is serialized correctly
                success: function (response) {
                    debugger;
                    // Handle success
                    console.log(response);
                    // Extract PackageName values from the array of objects
                    var packageNames = response.map(function (item) {
                        return item.PackageName;
                    }).join(', ');

                    $('#delete-dropdown').find('#pkgNameBdl').text(packageNames);
                    $('#delete-dropdown').modal('show');
                },
                error: function (error) {
                    console.error("Error deleting record:", error);
                }
            });
        } else {
            // If no checkbox is selected, show an alert or handle it as needed
            alert('Please select at least one item to delete.');
        }
    });




     // Attach a click event listener to the "Delete" button with id delete-btn
     $('#deleteBtn').click(function () {
         debugger;


         // Get all the selected checkboxes
         var selectedCheckboxes = $('.data-id:checked');

         // Check if at least one checkbox is selected
         if (selectedCheckboxes.length > 0) {
             // Get an array of selected IDs
             var selectedIds = selectedCheckboxes.map(function () {
                 return this.value;
             }).get();

            // var jsonData = JSON.stringify({ ids: selectedIds });


             $.ajax({
                 url: "/Home/delete", // Replace with your server endpoint
                 method: "POST",
                 data: { ids: selectedIds },
                 traditional: true, // Ensure that the array is serialized correctly
                 success: function (response) {
                     // Handle success
                     console.log("Deleted successfully ");
                     $('#delete-dropdown').modal('hide');


                   /*  selectedCheckboxes.prop('checked', false);*/

                     $.ajax({
                         url: '/Home/CustomAppData',
                         type: 'GET',
                         dataType: 'json',
                         success: function (data) {
                             // Clear existing table rows
                             $('#table-body').empty();

                             // Populate table with JSON data
                             $.each(data, function (index, item) {
                                 var row = '<tr class="table-row small-font">' +
                                     '<td class="checkbox-cell"><input type="checkbox" name="selectedIds[]" class="data-id " value="' + item.Id + '" /></td>' +
                                     '<td>' + item.PackageName + '</td>' +
                                     '<td>' + item.Url + '</td>' +
                                     '<td>' + item.Architecture + '</td>' +
                                     '<td>' + item.InstallCommandLine + '</td>' +
                                     '<td>' + item.UninstallCommandLine + '</td>' +
                                     '<td>' + item.Restart + '</td>' +
                                     '<td>' + item.InstallTimeOut + '</td>' +
                                     '<td>' + item.RunAs + '</td>' +
                                     '</tr>';
                                 $('#table-body').append(row);
                             })


                             // Update the item number in the #page-to-page element
                             var itemCount = data.length;
                             var currentPage = 1; // Assuming you are on the first page
                             $('#page-to-page').html('Page ' + currentPage + ' of ' + currentPage + ' (' + itemCount + ' items)');



                             $('#CustomeScriptBtn').modal('show');

                             $("#addTopBtn").prop("disabled", false);
                             $("#editBtn").prop("disabled", true);
                             $("#dltBtnPopUp").prop("disabled", true);
                             $("#dropDownExpBtn").prop("disabled", true);


                             // Show Bootstrap Toast
                             $('#toast-container .toast').toast({ delay: 3000 });
                             $('#toast-container .toast-body').text('Record(s) deleted successfully');
                             $('#toast-container .toast').toast('show');


                             

                         }
                     });

                    

                 },
                 error: function (error) {
                     console.error("Error deleting record:", error);
                 }
             });
         } else {
             // If no checkbox is selected, show an alert or handle it as needed
             alert('Please select at least one item to delete.');
         }

         resetFormData();
     });

     

     // Function to update modal content with data
     function updateModalContent(data) {
         //Assume you're using jQuery
         var editModal = $('#edit-dropbox-modal');
         // Update input values based on returned data
         editModal.find('#Id').val(data.Id);
         editModal.find('#packageName').val(data.PackageName);
         editModal.find('#url').val(data.Url);
         // editModal.find('#architecture').val(data.Architecture).change();
         editModal.find(`#architecture option[value="${data.Architecture}"]`).attr('selected', 'selected');
         editModal.find('#installCommandLine').val(data.InstallCommandLine);
         editModal.find('#uninstallCommandLine').val(data.UninstallCommandLine);
         editModal.find(`#restart option[value="${data.Restart}"]`).attr('selected', 'selected');
         
         editModal.find('#installTimeout').val(parseFloat(data.InstallTimeOut));
         editModal.find(`#runAs option[value="${data.RunAs}"]`).attr('selected', 'selected');
         // ... update other fields similarly ...

         // Show the modal
         editModal.modal('show');
     }

     // Trigger the API call when the edit button is clicked
     $('#editBtn').click(function () {
         debugger

         // Get all the selected checkboxes
         var selectedCheckboxes = $('.data-id:checked');
         console.log(selectedCheckboxes);
         // Check if at least one checkbox is selected
         // Replace 'yourApiUrl' with the actual URL of your Edit API

         if (selectedCheckboxes.length > 0) {
             // Get the value (ID) of the first selected checkbox
             var selectedId = selectedCheckboxes[0].value;
             var apiUrl = '/Home/Edit/' + selectedId;
             $.ajax({
                 url: apiUrl,
                 type: 'GET',
                 success: function (data) {
                     // Call the function to update the modal content
                     updateModalContent(data)

                 },
                 error: function (error) {
                     console.error("Error deleting record:", error);
                 }
             });
         }

     });

     $("#updateBtn").click(function () {
         debugger
         // Capture form data
         var formDt = $("#editForm").serialize();

         // Make an AJAX request to send the form data to the backend
         $.ajax({
             type: "POST",  // Set the HTTP method (POST)
             url: "/Home/Edit",  // Set the URL for your backend endpoint
             data: formDt,
             success: function (response) {
                 // Handle the successful response from the backend
                 console.log("Form data submitted successfully", response);
                 // Optionally, you can close the modal or perform other actions.
                 $('#edit-dropbox-modal').modal('hide');


                 $.ajax({
                     url: '/Home/CustomAppData',
                     type: 'GET',
                     dataType: 'json',
                     success: function (data) {
                         // Clear existing table rows
                         $('#table-body').empty();

                         // Populate table with JSON data
                         $.each(data, function (index, item) {
                             var row = '<tr class="table-row small-font">' +
                                 '<td class="checkbox-cell"><input type="checkbox" name="selectedIds[]" class="data-id " value="' + item.Id + '" /></td>' +
                                 '<td>' + item.PackageName + '</td>' +
                                 '<td>' + item.Url + '</td>' +
                                 '<td>' + item.Architecture + '</td>' +
                                 '<td>' + item.InstallCommandLine + '</td>' +
                                 '<td>' + item.UninstallCommandLine + '</td>' +
                                 '<td>' + item.Restart + '</td>' +
                                 '<td>' + item.InstallTimeOut + '</td>' +
                                 '<td>' + item.RunAs + '</td>' +
                                 '</tr>';
                             $('#table-body').append(row);
                         })


                         // Update the item number in the #page-to-page element
                         var itemCount = data.length;
                         var currentPage = 1; // Assuming you are on the first page
                         $('#page-to-page').html('Page ' + currentPage + ' of ' + currentPage + ' (' + itemCount + ' items)');

                         $('#CustomeScriptBtn').modal('show');
                         $("#addTopBtn").prop("disabled", false);
                         $("#editBtn").prop("disabled", true);
                         $("#dltBtnPopUp").prop("disabled", true);
                         $("#dropDownExpBtn").prop("disabled", true);

                         

                     }
                 });

                
                
             },
             error: function (error) {
                 // Handle errors during the AJAX request
                 console.error("Error submitting form data", error);
             }
         });
     });

 });




$(document).ready(function () {
    // Bind a click event to the cancel button in the "add-staticBackdrop" modal
    $(" #cancel-add-btn,#addHeaderCloseBtn").click(function () {
        debugger;
        // Show the "abortAppSetup" modal
        $("#abortAppSetup").modal("show");
        

        return false;
    });


   
   

    
    $("#cancel-final-Btn").click(function () {

        // Reload the page
       /* location.reload();*/

        debugger;
        // Hide modals
        $("#abortAppSetup, #add-staticBackdrop,#edit-dropbox-modal ").modal("hide");
        
        $('#CustomeScriptBtn').modal('show');
        resetFormData();


        
    });

});


function resetFormData() {
    debugger

    $("#step-1-form").css("display", "block");
    $("#step-2-form").css("display", "none");
    $("#step-3-form").css("display", "none");
    $("#left-side-bar div").removeClass("active-step").css("color", "black");
    $("#left-side-bar div:nth-child(1)").addClass("active-step").css("color", "#6CB4EE");

    

   

    // Reset input values
    $('#myForm input').val('');

    // Uncheck radio buttons
    $('#add-radio-button input:first').prop('checked', true);


    // Reset select options
   /* $('#Architecture, #Restart, #RunAs').val('');*/
    $('#Architecture option:first').val();
    $(' #Restart option:first').val();
    $(' #RunAs option:first').val();

    hideErrorMessage("PackageName");
    hideErrorMessage("Url");
    hideErrorMessage("InstallTimeOut");
    removeErrorBorder("PackageName");
    removeErrorBorder("Url");
    removeErrorBorder("InstallTimeOut");

    $('#step-2-form table tbody tr').removeClass('selected');

    $('#frmThrSecColVal').text("");
    $('#formThreeCtn1').css('display', 'block');
    $('#formThreeCtn2').css('display', 'none');

    // Empty the form 2 and form 3 table by removing all its child elements (rows)
    $("#computerTable tbody").empty();
    $("#computerTableForm3 tbody").empty();

    /*populateTable();*/



    $("#okAddButton").hide();
    /*$("#nextButton").show();*/
    // Set the display property of the button with ID 'nextButton' to 'block'
    $('#nextButton').css('display', 'block');

    /*checkCheckboxState();*/
    

}


    








$(document).ready(function () {
    // Set initial state
    $("#step-1-form").css("display", "block");
    $("#step-2-form").css("display", "none");
    $("#step-3-form").css("display", "none");
    $("#left-side-bar div").removeClass("active-step");
    $("#left-side-bar div:nth-child(1)").addClass("active-step").css("color", "#6CB4EE");

    $("#PackageName, #Url, #InstallTimeOut").on("change", function () {
        // Validate the specific input field that triggered the change event
        validateStep1Fields();
    });


    $("#nextButton").click(function () {
        // Check which step is currently displayed
        if ($("#step-1-form").css("display") == "block") {
            // Validate Step 1 fields before proceeding to the next step
            if (!validateStep1Fields()) {
                // Prevent moving to the next step if validation fails
                return;
            }
            populateTable();


            // Step 1 is visible, update the left-side-bar accordingly
            $("#left-side-bar div").removeClass("active-step");
            $("#left-side-bar div:nth-child(1)").addClass("active-step").css("color", ""); // Remove blue color

            // Toggle visibility of steps
            $("#step-1-form").css("display", "none");
            $("#step-2-form").css("display", "block");
            $("#left-side-bar div:nth-child(2)").addClass("active-step").css("color", "#6CB4EE");
        } else if ($("#step-2-form").css("display") == "block") {
            // Validate Step 2 fields before proceeding to the next step
            //if (!validateStep2Fields()) {
            //    // Prevent moving to the next step if validation fails
            //    return;
            //}

            // Step 2 is visible, update the left-side-bar accordingly
            $("#left-side-bar div").removeClass("active-step");
            $("#left-side-bar div:nth-child(2)").addClass("active-step").css("color", ""); // Remove blue color
            $("#left-side-bar div:nth-child(1)").addClass("active-step").css("color", "");

            // Toggle visibility of steps
            $("#step-2-form").css("display", "none");
            $("#step-3-form").css("display", "block");
            $("#left-side-bar div:nth-child(3)").addClass("active-step").css("color", "#6CB4EE");

            // Hide the nextButton
            $("#nextButton").hide();

            $("#okAddButton").click(function () {
                
                debugger
                // Capture form data
                var formData = $("#myForm").serialize();
                $("#nextButton").show();
                $("#okAddButton").hide();
               


                // Make an AJAX request to send the form data to the backend
                $.ajax({
                    type: "POST",  // Set the HTTP method (POST)
                    url: "/Home/CustomeApp",  // Set the URL for your backend endpoint
                    data: formData,
                    success: function (response) {
                        // Handle the successful response from the backend
                        console.log("Form data submitted successfully", response);
                        // Optionally, you can close the modal or perform other actions.
                        

                        $.ajax({
                            url: '/Home/CustomAppData',
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                // Clear existing table rows
                                $('#table-body').empty();

                                // Populate table with JSON data
                                $.each(data, function (index, item) {
                                    var row = '<tr class="table-row small-font">' +
                                        '<td class="checkbox-cell"><input type="checkbox" name="selectedIds[]" class="data-id " value="' + item.Id + '" /></td>' +
                                        '<td>' + item.PackageName + '</td>' +
                                        '<td>' + item.Url + '</td>' +
                                        '<td>' + item.Architecture + '</td>' +
                                        '<td>' + item.InstallCommandLine + '</td>' +
                                        '<td>' + item.UninstallCommandLine + '</td>' +
                                        '<td>' + item.Restart + '</td>' +
                                        '<td>' + item.InstallTimeOut + '</td>' +
                                        '<td>' + item.RunAs + '</td>' +
                                        '</tr>';
                                    $('#table-body').append(row);
                                })

                                // Update the item number in the #page-to-page element
                                var itemCount = data.length;
                                var currentPage = 1; // Assuming you are on the first page
                                $('#page-to-page').html('Page ' + currentPage + ' of ' + currentPage + ' (' + itemCount + ' items)');


                                $('#add-staticBackdrop').modal('hide');
                                $('#CustomeScriptBtn').modal('show');
                                resetFormData();
                                



                            }
                        });

                        

                    },
                    error: function (error) {
                        // Handle errors during the AJAX request
                        console.error("Error submitting form data", error);
                    }
                });
            });

        }
    });

   
});




function validateStep1Fields() {
    var packageName = $("#PackageName").val().trim();
    var url = $("#Url").val().trim();
    var installTimeout = $("#InstallTimeOut").val().trim();
    var isValid = true;

    // Reset error messages and borders
    hideErrorMessage("PackageName");
    hideErrorMessage("Url");
    hideErrorMessage("InstallTimeOut");
    removeErrorBorder("PackageName");
    removeErrorBorder("Url");
    removeErrorBorder("InstallTimeOut");

    if (packageName === "") {
        displayErrorMessage("PackageName", "Please enter a valid Package Name.");
        addErrorBorder("PackageName");
        isValid = false;
    }

    // Validate the Url field using regex
    var urlRegex = /^(http:\/\/|https:\/\/|sftp:\/\/|\\\\)([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    if (!urlRegex.test(url)) {
        displayErrorMessage("Url", "Please enter a valid URL starting with http://, https://, sftp://, or UNC path.");
        addErrorBorder("Url");
        isValid = false;
    }

    // Validate Install Timeout
    var installTimeoutValue = parseInt(installTimeout, 10);
    if (isNaN(installTimeoutValue) || installTimeoutValue < 5 || installTimeoutValue > 15) {
        displayErrorMessage("InstallTimeOut", "Please enter a valid timeout value between 5 and 15.");
        addErrorBorder("InstallTimeOut");
        isValid = false;
    }

    return isValid;
}



function displayErrorMessage(fieldId, message) {
    $("#" + fieldId + "-error").text(message);
}

function hideErrorMessage(fieldId) {
    $("#" + fieldId + "-error").text("");
}

function addErrorBorder(fieldId) {
    $("#" + fieldId).addClass("error-border");
}

function removeErrorBorder(fieldId) {
    $("#" + fieldId).removeClass("error-border");
}


function filterTable(tableId, tbodyId, query) {
    $('#' + tbodyId + ' tr').each(function () {
        var rowText = $(this).text().toLowerCase();
        if (rowText.includes(query)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


$(document).ready(function () {


    function updateSelectAllCheckbox() {
        var allCheckboxes = $('.data-id');
        var allChecked = allCheckboxes.length > 0 && allCheckboxes.filter(':checked').length === allCheckboxes.length;

        $('#selectAllCheckbox').prop('checked', allChecked);
    }


    // Handle click event for the select all checkbox
    $("#selectAllCheckbox").click(function () {
        var isChecked = $(this).prop("checked");

        // Set the checked property of all checkboxes in the table body
        $("tbody input[type='checkbox']").prop("checked", isChecked);
    });




    


   
    // Event listener for table rows
    $('#table-body').on('click', 'tr', function () {
        debugger
        // Toggle the checkbox within the clicked row
        var checkbox = $(this).find('.data-id');
        checkbox.prop('checked', !checkbox.prop('checked'));

        // Apply styles directly based on the checkbox state

        $(this).toggleClass('selected-row', checkbox.prop('checked'));

        // Update button and row styles based on checkbox state
        checkCheckboxState()

        // Update state of "Select All" checkbox
        updateSelectAllCheckbox();
    });

    




    // Event listener for individual checkboxes
    $('#table-body').on('click', '.data-id', function (event) {
        // Prevent the event from propagating to the tr
        event.stopPropagation();

        // Toggle the "selected" class of the row based on the checkbox state
        $(this).closest('tr').toggleClass('selected-row', this.checked);

        // Update button styles based on checkbox state
        checkCheckboxState();

        // Update state of "Select All" checkbox
        updateSelectAllCheckbox();

    });

    // Event listener for "Select All" checkbox in the header

    $('#selectAllCheckbox').click(function () {
        var isChecked = $(this).prop('checked');

        // Set the checked property of all checkboxes in the table body
        $('.data-id').prop('checked', isChecked);

        // Toggle the "selected" class of all rows based on the "Select All" checkbox
        $('#table-body tr').toggleClass('selected-row', isChecked);

        // Update button styles based on checkbox state
        checkCheckboxState()
    });


    




    // Attach click event to the button with id 'btnCustomScript'
    $('#btnCustomScript').on('click', function () {debugger
        // Make an AJAX request to fetch JSON data
        $.ajax({
            url: '/Home/CustomAppData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Clear existing table rows
                $('#table-body').empty();

                // Populate table with JSON data
                $.each(data, function (index, item) {
                    var row = '<tr class="table-row small-font">' +
                        '<td class="checkbox-cell"><input type="checkbox" name="selectedIds[]" class="data-id " value="' + item.Id + '" /></td>' +
                        '<td>' + item.PackageName + '</td>' +
                        '<td>' + item.Url + '</td>' +
                        '<td>' + item.Architecture + '</td>' +
                        '<td>' + item.InstallCommandLine + '</td>' +
                        '<td>' + item.UninstallCommandLine + '</td>' +
                        '<td>' + item.Restart + '</td>' +
                        '<td>' + item.InstallTimeOut + '</td>' +
                        '<td>' + item.RunAs + '</td>' +
                        '</tr>';
                    $('#table-body').append(row);
                })

                // Update the item number in the #page-to-page element
                var itemCount = data.length;
                var currentPage = 1; // Assuming you are on the first page
                $('#page-to-page').html('Page ' + currentPage + ' of ' + currentPage + ' (' + itemCount + ' items)');

                // Call the function to check the state of checkboxes
                checkCheckboxState();

                

            }
        });
    });

    $('#searchInput').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();
        filterTable('myTable', 'table-body', searchTerm);
    });



    $('table').on('change', 'input[type="checkbox"]', function () {
        $(this).closest('tr').toggleClass('selected', this.checked);
    });

    

    // Use event delegation to handle checkbox changes within the table
    //$('#table-body').on('change', 'input.data-id', function () {
    //    debugger
    //    // Call the function to check the state of checkboxes
    //    checkCheckboxState();
    //});

    // Function to check the state of checkboxes
    function checkCheckboxState() {
        debugger
        var anyCheckboxSelected = $('.data-id:checked').length > 0;

        $('#editBtn, #dltBtnPopUp, #copyMainBtn, #dropDownExpBtn').prop('disabled', !anyCheckboxSelected);
        $('#addTopBtn').prop('disabled', anyCheckboxSelected);

        // Update row styles based on checkbox state
        //$('#table-body tr').each(function () {
        //    var checkbox = $(this).find('.data-id');
        //    $(this).toggleClass('selected-row', checkbox.prop('checked'));
        //});

    }

    // Initial check of checkbox state when the page loads
    checkCheckboxState();


    //$('#table-body').on('click', '.table-row', function () {
    //    debugger;

       

    //    var clickedCheckbox = $(this).find('.data-id');

       

    //    // Toggle the checked state of the checkbox
    //    if (clickedCheckbox.prop('checked')) {
    //        // If checkbox is currently checked, uncheck it
    //        clickedCheckbox.prop('checked', false);
    //        clickedCheckbox.addClass('hidden-checkbox');
    //        clickedCheckbox.removeClass('row-highlight');
    //    } else {
    //        // If checkbox is currently unchecked, check it
    //        clickedCheckbox.prop('checked', true);
    //        clickedCheckbox.removeClass('hidden-checkbox');
    //        clickedCheckbox.addClass('row-highlight');
    //    }

       
    //    checkCheckboxState();
    //});



});


/*---------  copy dropdown ---------------  */

$(document).ready(function () {
    $("#mainDiv").click(function () {
        $("#dropdownMenu").toggle();
    });

    // Hide the dropdown when clicking outside of it
    $(document).on("click", function (event) {
        if (!$(event.target).closest("#mainDiv").length && !$(event.target).closest("#dropdownMenu").length) {
            $("#dropdownMenu").hide();
        }
    });
});


/*---------------- Copy functionality ----------------*/
function openCopyToSitesModal() {
    $('#coptToSites').modal('show');
}


//--------------   functionlity for copy to site ---------------

$(document).ready(function () {
    // Array of labels
    var labelsArray = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5",
        "Label 6", "Label 7", "Label 8", "Label 9", "Label 10",
        "Label 11", "Label 12", "Label 13", "Label 14", "Label 15"];

    // Container for checkboxes
    var checkboxList = $(".checkbox-list");

    // Dynamically create checkboxes based on the labels array
    $.each(labelsArray, function (index, label) {
        var checkbox = $("<div class='form-check cpSiteIpLbProp'>" +
            "<input type='checkbox' class='form-check-input' id='checkbox" + index + "' name='checkbox" + index + "'>" +
            "<label class='form-check-label' for='checkbox" + index + "'>" + label + "</label>" +
            "</div>");

        checkboxList.append(checkbox);
    });

    // Search functionality
    $("#srcInputCopyModal").on("input", function () {
        var searchTerm = $(this).val().toLowerCase();

        checkboxList.find(".form-check").each(function () {
            var label = $(this).text().toLowerCase();

            // Toggle visibility based on the search term
            $(this).toggle(label.includes(searchTerm));
        });
    });


});




/*----------- getting data to copy functionality  -------*/

$(document).ready(function () {
    $('#duplicateOptPrs').click(function () {
        debugger;

        // Get all the selected checkboxes
        var selectedCheckboxes = $('.data-id:checked');
        console.log(selectedCheckboxes);

        // Check if at least one checkbox is selected
        if (selectedCheckboxes.length > 0) {
            // Get the value (ID) of the first selected checkbox
            var selectedId = selectedCheckboxes[0].value;
            var apiUrl = '/Home/copy/' + selectedId;

            // Trigger AJAX request
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (data) {
                    debugger;
                    // Handle the response data here
                    console.log(data);

                    // Modify the data
                    data.PackageName = data.PackageName + "(1)";
                    delete data.Id;

                    // Make another AJAX call with the modified data
                    $.ajax({
                        type: "POST",
                        url: "/Home/CustomeApp",
                        data: data,
                        success: function (response) {
                            // Handle the successful response from the second AJAX call
                            console.log("Form data submitted successfully", response);
                            // Optionally, you can close the modal or perform other actions.
                            $('#add-staticBackdrop').modal('hide');

                            $.ajax({
                                url: '/Home/CustomAppData',
                                type: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    // Clear existing table rows
                                    $('#table-body').empty();

                                    // Populate table with JSON data
                                    $.each(data, function (index, item) {
                                        var row = '<tr class="table-row small-font">' +
                                            '<td class="checkbox-cell"><input type="checkbox" name="selectedIds[]" class="data-id " value="' + item.Id + '" /></td>' +
                                            '<td>' + item.PackageName + '</td>' +
                                            '<td>' + item.Url + '</td>' +
                                            '<td>' + item.Architecture + '</td>' +
                                            '<td>' + item.InstallCommandLine + '</td>' +
                                            '<td>' + item.UninstallCommandLine + '</td>' +
                                            '<td>' + item.Restart + '</td>' +
                                            '<td>' + item.InstallTimeOut + '</td>' +
                                            '<td>' + item.RunAs + '</td>' +
                                            '</tr>';
                                        $('#table-body').append(row);
                                    })

                                    // Update the item number in the #page-to-page element
                                    var itemCount = data.length;
                                    var currentPage = 1; // Assuming you are on the first page
                                    $('#page-to-page').html('Page ' + currentPage + ' of ' + currentPage + ' (' + itemCount + ' items)');

                                    $('#CustomeScriptBtn').modal('show');
                                    $("#addTopBtn").prop("disabled", false);
                                    $("#editBtn").prop("disabled", true);
                                    $("#dltBtnPopUp").prop("disabled", true);
                                    $("#dropDownExpBtn").prop("disabled", true);

                                    // Call the function to check the state of checkboxes
                                    checkCheckboxState();



                                }
                            });
                            $('#CustomeScriptBtn').modal('show');

                        },
                        error: function (error) {
                            // Handle errors during the second AJAX request
                            console.error("Error submitting form data", error);
                        }
                    });

                    //$('#CustomeScriptBtn').modal('show');
                    //$("#addTopBtn").prop("disabled", false);
                    //$("#editBtn").prop("disabled", true);
                    //$("#dltBtnPopUp").prop("disabled", true);
                    //$("#dropDownExpBtn").prop("disabled", true);

                },
                error: function (xhr, status, error) {
                    // Handle errors here
                    console.error("Error: " + error);
                }
            });
        }
    });
});




/*----------- form 3 data visibility----*/




//$(document).ready(function () {
//    // Other code within document.ready, if any

//    $("#cancel-add-btn").click(function () {
//        //$('#add-staticBackdrop').hide();
//        //$('#CustomeScriptBtn').show();

//        $('#add-staticBackdrop').modal('hide');
//        $('#CustomeScriptBtn').modal('show');
//    });
//});



// Assuming the populateTable function is already defined as in the previous response

$(document).ready(function () {
    // Your existing code...

    // Add click event listener for the "Install" button
    $('#installFinalLevelBtn').click(function () {
        

       
        $('.frmThrSecColVal').text("Waiting");
        
        $('#conformInstallApp').modal('hide');
        $('#add-staticBackdrop').modal('show');

        setTimeout(function () {
            $('.frmThrSecColVal').text("Downloading");
            setTimeout(function () {
                $('.frmThrSecColVal').text("Installing");

                // Set another timeout for 2 seconds and change the text to "1.2.20"
                setTimeout(function () {
                    $('.frmThrSecColVal').text("1.2.20");
                    $('#formThreeCtn1').css('display', 'none');
                    $('#formThreeCtn2').css('display', 'block');
                    $('#okAddButton').show();
                }, 2000); // 2000 milliseconds = 2 seconds
            }, 2000);
        }, 2000);
        

       



    });

    // Function to generate a random value (x.x)
    
});

/*-------- search for form 2 -------*/

$(document).ready(function () {
    // Assuming your table has an id of "computerTable" and search input has id "searchForm2"
    var table = $("#computerTable tbody");
    var searchInput = $("#searchForm2");

    searchInput.on("input", function () {
        var searchTerm = searchInput.val().toLowerCase();

        table.find("tr").each(function (index, row) {
            var rowText = $(row).text().toLowerCase();

            // Show or hide rows based on search term
            if (rowText.includes(searchTerm)) {
                $(row).show();
            } else {
                $(row).hide();
            }
        });
    });
});




