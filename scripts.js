$(document).ready(function () {

    console.log('System Ready!');

})


// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
    $('#file-name').html(event.target.files[0].name);

    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
    }
    else {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csvData = event.target.result;
            locations = $.csv.toObjects(csvData);
            // console.log(locations[0])

            // count data
            if (locations && locations.length > 0) {
                $('#notification').attr('class', 'notification is-success');
                $('#notification').html('Imported -' + locations.length + '- rows successfully!');
                initMap(locations);
            }
            else {
                $('#notification').attr('class', 'notification is-warning');
                $('#notification').html('No data to import!');
            }
        };
        reader.onerror = function () {
            $('#notification').attr('class', 'notification is-danger');
            $('#notification').html('Unable to read ' + file.fileName);
        };
    }
}

function initMap(locations) {

    locations.forEach(element => {
        element.lat = parseFloat(element.lat)
        element.lng = parseFloat(element.lng)
    });

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: locations[0].lat, lng: locations[0].lng },
        styles: [
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            label: location.name
        });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}
