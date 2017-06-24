markerCluster = null;

function new_map($el) {

    // var
    var $markers = $el.find('.marker');

    var stylesArray = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]

    // vars
    var args = {
        zoom: 16,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: stylesArray,
        scrollwheel: false
    };

    // create map
    var map = new google.maps.Map($el[0], args);

    // add a markers reference
    map.markers = [];

    // add markers
    $markers.each(function () {
        add_marker($(this), map);
    });

    markerCluster = new MarkerClusterer(map, map.markers,
        {
            imagePath: '/wp-content/themes/denicler/images/pins/',
            styles: [{
                height: 55,
                url: "/wp-content/themes/denicler/images/pins/1.png",
                width: 55,
                textColor: '#fff',
                textSize: 22
            }]
        }
    );

    // center map
    center_map(map);

    // return
    return map;

}

/*
 *  add_marker
 */

var prev_infowindow =false;

function add_marker($marker, map) {

    // var
    var latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));

    var iconBase = js_img_SRC;

    var markerType = $($marker).attr('data-point-type');

    var icons = {
        deni: {
            icon: iconBase + 'deni-icon.png'
        },
        user: {
            icon: iconBase + 'user-icon.png'
        }
    };

    // create marker
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        pointType: $($marker).attr('data-point-type'),
        icon: icons[markerType].icon,

    });

    // add to array
    map.markers.push(marker);

    // if marker contains HTML, add it to an infoWindow
    if ($marker.html()) {

        // create info window
        var infowindow = new google.maps.InfoWindow({
            content: $marker.html()
        });

        // show info window when marker is clicked
        google.maps.event.addListener(marker, 'click', function () {

            if( prev_infowindow) {
                prev_infowindow.close();
            }

            infowindow.open(map, marker);
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            var closeBtn = iwOuter.next();
            iwBackground.children(':nth-child(2)').css({'display' : 'none'});
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});
            closeBtn.css({'right' : '45px'});
            closeBtn.css({'top' : '30px'});

            prev_infowindow = infowindow;

        });
    }

}

/*
 *  center_map
 */

function center_map(map) {

    // vars
    var bounds = new google.maps.LatLngBounds();

    // loop through all markers and create bounds
    $.each(map.markers, function (i, marker) {

        var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

        bounds.extend(latlng);

    });

    // only 1 marker?
    if (map.markers.length == 1) {
        // set center of map
        map.setCenter(bounds.getCenter());
        map.setZoom(16);
    }
    else {
        // fit to bounds
        map.fitBounds(bounds);
    }

}
