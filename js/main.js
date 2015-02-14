/** 
 * this is the viewModel
 * defined EVERYTHING inside here: methods, both public and private
 * callback functions
 */

$(document).ready(function() {
    ko.applyBindings(new (function viewModel() {
        'use strict';
        /** save the "this" for when the context changes */
        var self = this;
        self.locations = ko.observableArray([
                {cat: 'culture', name: 'Barbican Centre', address: 'EC2Y 8DS', city: 'london', lat: 51.5204543, long: -0.0937136999999666, description: '', url: '', img: ''},
                {cat: 'culture', name: 'Barbican Cinemas', address: 'Beech Street', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'companies', name: 'Amazon Development Centre', address: 'EC1A 4JU', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'places', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'places', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'stores', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'companies', name: 'Google', address: 'SW1W 9tq', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'stores', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
                {cat: 'events', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: NaN, long: NaN, description: '', url: '', img: ''},
        ]);
        self.geolocations = ko.observableArray([]);
        /** 
         * geocode the locations
         */
        function geocoding() {
            var geocoder = new google.maps.Geocoder();
            ko.utils.arrayForEach (self.locations(), function(location) {
                // console.log(location.name);
                var locaddress = location.address + ' ' + location.city;
                geocoder.geocode( { 'address': locaddress}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          var latlng =  new google.maps.LatLng(results[0].geometry.location['k'], results[0].geometry.location['D']);
                          // console.log('geocoding: ' + status + ' ' + latlng);
                          addMarker(latlng);
                          // add to geolocation observablearray
                          self.geolocations().push({name: location.name, latlng: latlng});
                      } else {
                        alert("Geocode was not successful for the following reason: " + status);
                      }
                });
            });
        };
    
        function addMarker(latlng) {
            // console.log(self.geolocations());
            var marker = new google.maps.Marker({
                        map: self.map,
                        animation: google.maps.Animation.DROP,
                        position: latlng,
            });
            self.bounds.extend(latlng);
        };
    
        /** 
         * IIFE so it's executed immediately
         */
        var initMap = function() {
            geocoding();
            self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            self.bounds = new google.maps.LatLngBounds();
        }();
    
        /**
         * update map bounds on page resize
         */
        window.addEventListener('resize', function(e) {
            console.log(self.bounds);
             self.map.fitBounds(self.bounds);
             self.map.setCenter(new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].long));
             $("#map-canvas").height($(window).height());
        });
    }));
});
