/** 
 * this is the viewModel
 * defined EVERYTHING inside here: methods, both public and private
 * callback functions
 */
$(document).ready(function() {
    ko.applyBindings(new (function viewModel() {
        'use strict';
        var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
        var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
        /** save the "this" for when the context changes */
        var self = this;
        
        self.typesSelection = ko.observableArray([]);
        
        /** 
         * create a single infowindow object to be reused - according to google the right
         * way to have only one infowindow open at any given time
         */
        var infoWindow = new google.maps.InfoWindow();
        self.bounds = new google.maps.LatLngBounds();
        self.locations = ko.observableArray([
                {cat: 'culture', name: 'Barbican Centre', address: 'EC2Y 8DS', city: 'london', lat: 51.5204543, long: -0.0937136999999666, description: 'Great venue for music, cinema and exhibitions.', url: 'http://www.barbican.org.uk/', img: '', type:'readonly',visible:'true'},
                {cat: 'companies', name: 'Google', address: 'SW1W 9tq', city: 'london', lat: 51.49496560000001, long: -0.14667389999999614, description: 'The Mothership', url: 'https://www.google.com', img: '', type:'readonly',visible:'true'},
                {cat: 'coding spaces', name: 'Barbican Cinemas Cafe', address: 'Beech Street', city: 'london', lat: 51.5205906, long: -0.09486970000000383, description: '<p>Not just great movies: a friendly space open</p><p> to the public used by people to work, teach, learn, meet etc...</p><p>I do a lot of coding here...</p>', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'companies', name: 'Amazon Development Centre', address: 'EC1A 4JU', city: 'london', lat: 51.5216718, long: -0.09826629999997749, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'places', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: 51.52567029999999, long: -0.08756149999999252, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'places', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: 51.52338, long: -0.07521999999994478, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'stores', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: 51.5142651, long: -0.14222989999996116, description: 'First store to open in Europe in 2004', url: 'http://tinyurl.com/kwo7qnz', img: '', type:'readonly',visible:'true'},
                {cat: 'stores', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: 51.52338109999999, long: -0.07573070000000826, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'events', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: 51.5217064,long:  -0.0722892999999658, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'coding spaces', name: 'Royal Festival Hall', address: 'SE1 8XX', city: 'london', lat: 51.5055375,long:  -0.1156066, description: '', url: '', img: '', type:'readonly',visible:'true'},
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
                          console.log('geocoding: ' + status + ' ' + latlng + ' ' + location.name);
                          addMarker(latlng,location);
                          // console.log(location.name);
                          // add to geolocation observablearray
                          self.geolocations().push({name: location.name, latlng: latlng});
                      } else {
                        alert("Geocode was not successful for the following reason: " + status);
                      }
                });
            });
        };
        function addMarker(latlng,location) {
            // console.log(self.geolocations());
            // if the location is marked 'not visible', skip it
            if (!location.visible) {
                return false;
            }
            var currentMarker;
            var marker = new google.maps.Marker({
                map: self.map,
                animation: google.maps.Animation.DROP,
                position: latlng,
                title: location.name,
            });
            self.bounds.extend(latlng);
            self.map.fitBounds(self.bounds);
            self.map.setCenter(new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].long));
            var contentString = 
                '<div id="content">'+
                '<h2>'+location.name+'</h2>'+
                '<div id="bodyContent">'+
                '<p>'+location.description+'</p>'+
                '<a href="'+location.url+'" target="_blank">'+location.url+'</a>'+
                '</div>'+
                '</div>';
            // console.log(contentString);
            google.maps.event.addListener(marker, 'click', function() {
                  infoWindow.setContent(contentString);
                  infoWindow.open(self.map,this);
                  currentMarker = this;
            });
        };
        /** 
         * IIFE so it's executed immediately
         */
        var initMap = function() {
            //geocoding();
            self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            ko.utils.arrayForEach (self.locations(), function(location) {
                var latlng =  new google.maps.LatLng(location.lat,location.long);
                // console.log(location.name);
                addMarker(latlng,location);
            });
        }();
        
        /**
          * access foursquare
          */
        var foursquareQuery = function() {
            var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
                'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + 
                '&v=20150101&ll='+self.locations()[0].lat+','+
                self.locations()[0].long+
                '&query=coworking';
            $.getJSON(foursquareUrl, function(data){
                console.log(data)
                // TODO:
                // extract the data you want to show
                // push the data into the locations array
                // and then what?? need to update the map
                // 
            }).fail(function(e){
                alert('We are experiencing problems with the FourSquare interface. We apologise for the inconvenience. Please try again later');
                console.log("error " + e);
            });
        }();
        
        /**
          * access TFL
          */
        // access the tfl with a timer; get the trains stopping at Barbican station; 
        // could you show the trains between moorgate, barbican and farringdon?
        

        /**
         * update map bounds on page resize
         */
        window.addEventListener('resize', function(e) {
            // console.log(self.bounds);
             self.map.fitBounds(self.bounds);
             self.map.setCenter(new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].long));
             // $("#map-canvas").height($(window).height());
        });
    }));
});
