$(document).ready(function() {
    const sellingPoints = [];

    $('#list-view-button').click(function() {
        $('.list-view').show();
        $('.map-view').hide();
        updateSellingPointsTable();

    });

    $('#map-view-button').click(function() {
        $('.list-view').hide();
        $('.map-view').show();
        plotSellingPointsOnMap();
    });

     // Fetch selling points from the backend API and populate the local array
     function fetchSellingPoints() {
        $.ajax({
            type: 'GET',
            url: '/api/coconut-selling-points', // Change this to your actual API endpoint
            success: function(response) {
                sellingPoints.length = 0; // Clear the existing array
                sellingPoints.push(...response); // Populate the array with fetched data
                updateSellingPointsTable(); // Update the table view
            },
            error: function(error) {
                console.error('Error fetching selling points:', error);
            }
        });
    }

    // Initial fetching of selling points
    fetchSellingPoints();

    // Handle form submission for adding selling points
    $('#add-selling-point-form').submit(function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const mobile = $('#mobile').val();
        const address = $('#address').val();
        const latitude = parseFloat($('#latitude').val());
        const longitude = parseFloat($('#longitude').val());
        const upi = $('#upi').val();

        // Create a new selling point object
        const newSellingPoint = {
            name: name,
            mobile: mobile,
            address: address,
            latitude: latitude,
            longitude: longitude,
            upi: upi
        };

        // Send the new selling point data to the backend API
        $.ajax({
            type: 'POST',
            url: '/api/coconut-selling-points', // Change this to your actual API endpoint
            data: JSON.stringify(newSellingPoint),
            contentType: 'application/json',
            success: function(response) {
                // Assuming your API returns the ID of the newly added point
                newSellingPoint.id = response.id;

                // Add the new selling point to the list
                sellingPoints.push(newSellingPoint);
                updateSellingPointsTable();

                // Clear the form inputs
                $('#name').val('');
                $('#mobile').val('');
                $('#address').val('');
                $('#latitude').val('');
                $('#longitude').val('');
                $('#upi').val('');

                // Plot the selling points on the map
                plotSellingPointsOnMap();
            },
            error: function(error) {
                console.error('Error adding selling point:', error);
            }
        });
    });

    function updateSellingPointsTable() {
        const sellingPointsTable = $('#selling-points-table tbody');
        sellingPointsTable.empty();
        sellingPoints.forEach(point => {
            const row = $('<tr>').append(
                $('<td>').text(point.name),
                $('<td>').text(point.mobile),
                $('<td>').text(point.address),
                $('<td>').text(point.latitude),
                $('<td>').text(point.longitude),
                $('<td>').text(point.upi)
            );
            sellingPointsTable.append(row);
        });
    }

    function plotSellingPointsOnMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: { lat: sellingPoints[0].latitude, lng: sellingPoints[0].longitude }
        });
        sellingPoints.forEach(point => {
            new google.maps.Marker({
                position: { lat: point.latitude, lng: point.longitude },
                map: map,
                title: point.name
            });
        });
    }
});
