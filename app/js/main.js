/*
TODO: 
1) each category has its own marker
2) entries in the list of locations have the category in bracket
barbican (ben's favorites)
3) the list of location is shown in a small window with sliding 
4) dovrai riaffrontare il mostro dei bounds
5) un altro mostro: centering the map
6) hovering on the choices changes the color
7) infowindow
8) clikcing on an entry opens the infowindow and makes the marker jump
9) search function

/** 
 * this is the viewModel
 * defined EVERYTHING inside here: methods, both public and private
 * callback functions
 */
$(document).ready(function() {
    'use strict';
    var viewModel = function(Model,mapObject) {
        // console.log('inside viewModel');
        /** save the "this" for when the context changes */
        var self = this;
        // google maps
        var map;
        // one single infowindow object shared
        var infowindow = new google.maps.InfoWindow({
          content: null
        });
        // observables
        // my main location in London
        self.mainLocation = ko.observable({
            cat: 'culture', 
            name: 'Barbican Centre', 
            address: 'EC2Y 8DS', 
            city: 'london', 
            lat: 51.5204543, 
            lng: -0.0937136999999666, 
            description: 'Great venue for music, cinema and exhibitions.', 
            url: 'http://www.barbican.org.uk/', 
            img: '', 
            type:'readonly',
            visible:true,
        });
        // my favourite locations in London
        self.myLocations = ko.observableArray([
                {cat: 'ben\'s favorites', name: 'Barbican Centre', address: 'EC2Y 8DS', city: 'london', lat: 51.5204543, lng: -0.0937136999999666, description: 'Great venue for music, cinema and exhibitions.', url: 'http://www.barbican.org.uk/', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Google', address: 'SW1W 9tq', city: 'london', lat: 51.49496560000001, lng: -0.14667389999999614, description: 'The Mothership', url: 'https://www.google.com', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Barbican Cinemas Cafe', address: 'Beech Street', city: 'london', lat: 51.5205906, lng: -0.09486970000000383, description: '<p>Not just great movies: a friendly space open</p><p> to the public used by people to work, teach, learn, meet etc...</p><p>I do a lot of coding here...</p>', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Amazon Development Centre', address: 'EC1A 4JU', city: 'london', lat: 51.5216718, lng: -0.09826629999997749, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: 51.52567029999999, lng: -0.08756149999999252, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: 51.52338, lng: -0.07521999999994478, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: 51.5142651, lng: -0.14222989999996116, description: 'First store to open in Europe in 2004', url: 'http://tinyurl.com/kwo7qnz', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: 51.52338109999999, lng: -0.07573070000000826, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: 51.5217064,lng:  -0.0722892999999658, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Royal Festival Hall', address: 'SE1 8XX', city: 'london', lat: 51.5055375,lng: -0.1156066, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'London Hackspace', address: 'E2 9DY', city: 'london', lat: 51.531801,lng: -0.060318, description: 'Great space for hacking and building things.', url: 'https://london.hackspace.org.uk/', img: '', type:'readonly',visible:true},
        ]);
        self.typesSelection = ko.observableArray([]);
        self.foursquarecategories = ko.observable([ 'coworking']);
        // 4square locations
        self.locations = ko.observableArray();
        self.query = ko.observable('');
        self.computedLocations = ko.computed(function(){
            return ko.utils.arrayFilter(self.locations(), function(entry){
                // console.log('inside computed filter >'+self.query()+'< >'+entry.name);
                return entry.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            })
        });
        // needed later on
        var pleaseHandleThisDisaster = function(a){
            // console.log(a);
            // console.log(self.locations());
            self.locations.push(a);
            // console.log(self.locations());
        }
        // get the ajax data
        ko.utils.arrayForEach(self.foursquarecategories(), function(cat) {
            // console.log('now searching 4square with '+cat);
            var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
            var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
            var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
            'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET +
            '&v=20150101&ll='+self.mainLocation().lat+','+self.mainLocation().lng+
            '&query='+cat;
            var jqxr = $.getJSON(foursquareUrl)
            .fail(function(e){
                alert('We are experiencing problems with the FourSquare interface. We apologise for the inconvenience. Please try again later');
                console.log("error " + e);
            })
            .done(function(data){
                // console.log(data);
                // console.log(self.locations());
                $.each(data.response.groups['0'].items, function(k,v){
                    // console.log(v);
                    var loc = {
                        cat:v.venue.categories['0'].name,
                        name: v.venue.name,
                        address: v.venue.location.address,
                        city: v.venue.location.city+' '+v.venue.location.country,
                        lat: v.venue.location.lat,
                        lng: v.venue.location.lng,
                        description: '',
                        url: v.venue.url,
                        img: '',
                        type:'foursquare',
                        visible: true,
                        displayed: false,
                        marker: ''
                    };
                    // console.log(loc);
                    pleaseHandleThisDisaster(loc);
                });
                pleaseShowTheMarkers();
                self.computedLocations.subscribe(function(value){
                    // console.log('computed has changed');
                    // console.log(self.computedLocations());
                    updateMarkers();
                });
            });
        });
        var showMap = function() {
            // console.log('inside showMap');
            self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(self.mainLocation().lat,self.mainLocation().lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        }();
        var pleaseShowTheMarkers = function() {
            var addInfoWindow = function(location){
                console.log('adding infowindow');
                console.log(location);
            };
            var showMarker = function(location) {
                var ll = new google.maps.LatLng(
                  location.lat,
                  location.lng
                );
                var marker = new google.maps.Marker({
                    map: self.map,
                    animation: google.maps.Animation.DROP,
                    position: ll,
                    title: location.name,
                });
                location.marker=marker;
            };
            $.each(self.myLocations(),function(k,v){
                showMarker(v);
            });
            $.each(self.computedLocations(),function(k,v){
                showMarker(v);
            });
        };
        var updateMarkers = function() {
            // console.log('locations: ' + self.locations().length);
            // console.log('locations');
            // console.log(self.locations());
            // calculate the difference between locations and computedLocations 
            // setMap(null) for those on locations but not on computedLocations
            var diff = $(self.locations()).not(self.computedLocations()).get();
            // console.log('diff');
            // console.log(diff[1]);
            $.each(diff,function(k,v){
                v.marker.setMap(null);
            });
            $.each(self.computedLocations(),function(k,v){
                v.marker.setMap(self.map);
            });
        };
    };   // end of the viewModel
    var vm = new viewModel();
    ko.applyBindings(vm);
});
