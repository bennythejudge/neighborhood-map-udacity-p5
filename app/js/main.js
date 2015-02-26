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
9) add a custom control to center the map (https://developers.google.com/maps/documentation/javascript/examples/control-custom)
icons:
restaurants
https://maps.google.com/mapfiles/kml/shapes/dining.png
coffee.png
large_red.png
yellow
green
blue
purple
10) ajax time out can be too long - make it shorter

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
        // to set the map bounds
        self.bounds = new google.maps.LatLngBounds();
        // one single infowindow object shared
        self.infowindow = new google.maps.InfoWindow();
        // observables
        self.errorMessage = ko.observable('All is ok!');
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
                {cat: 'ben\'s favorites', name: 'Barbican Cinemas Cafe', address: 'Beech Street', city: 'london', lat: 51.5205906, lng: -0.09486970000000383, description: '<p>Besides movies of great quality from all over the world, this is also a friendly space open</p><p> to the public used by people to work, teach, learn, meet etc...</p><p>I do a lot of coding here...</p>', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: 51.52567029999999, lng: -0.08756149999999252, description: 'London\'s answer to Silicon Valley. Dirty, smogged, dangerous, noisy. Ugly!', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: 51.52338, lng: -0.07521999999994478, description: 'HERE BE HIPSTERS!', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: 51.5142651, lng: -0.14222989999996116, description: 'First store to open in Europe in 2004', url: 'http://tinyurl.com/kwo7qnz', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: 51.52338109999999, lng: -0.07573070000000826, description: 'popup stores and interesting street foods. very HIP! do not come here unless you sport a modern beard', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: 51.5217064,lng:  -0.0722892999999658, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'Royal Festival Hall', address: 'SE1 8XX', city: 'london', lat: 51.5055375,lng: -0.1156066, description: '', url: '', img: '', type:'readonly',visible:true},
                {cat: 'ben\'s favorites', name: 'London Hackspace', address: 'E2 9DY', city: 'london', lat: 51.531801,lng: -0.060318, description: 'Great space for hacking and building things.', url: 'https://london.hackspace.org.uk/', img: '', type:'readonly',visible:true},
        ]);
        self.typesSelection = ko.observableArray([]);
        self.foursquarecategories = ko.observable([ 'coworking']);
        // 4square locations
        self.locations = ko.observableArray();
        self.locations.subscribe(function(value){
            
        })
        self.query = ko.observable('');
        self.computedLocations = ko.computed(function(){
            return ko.utils.arrayFilter(self.locations(), function(entry){
                // console.log('inside computed filter >'+self.query()+'< >'+entry.name);
                return entry.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            })
        });
        // get the ajax data
        ko.utils.arrayForEach(self.foursquarecategories(), function(cat) {
            console.log('now searching 4square with '+cat);
            var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
            var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
            var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
            'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET +
            '&v=20150101&ll='+self.mainLocation().lat+','+self.mainLocation().lng+
             '&radius=2500' + '&query='+cat;
            var jqxr = $.getJSON(foursquareUrl)
            .fail(function(e){
                alert('We are experiencing problems with the FourSquare interface. We apologise for the inconvenience. Please try again later');
                console.log("error " + e);
            })
            .done(function(data){
                // console.log(data);
                // console.log(self.locations());
                // console.log(data);
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
                        marker: {},
                        
                    };
                    // console.log(loc);
                    // pleaseHandleThisDisaster(loc);
                    self.locations.push(loc);
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
            var showMarker = function(location) {
                var markergreen = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                var markerred = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                var markerpurple = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
                var mIcon = markerred;
                var ll = new google.maps.LatLng(
                  location.lat,
                  location.lng
                );
                console.log(location.cat)
                if (location.cat ===  "Coworking Space") {
                    mIcon = markerpurple;
                } else {
                    mIcon = markergreen;
                }
                var marker = new google.maps.Marker({
                    map: self.map,
                    animation: google.maps.Animation.DROP,
                    position: ll,
                    title: location.name,
                    icon: mIcon,
                });
                location.marker=marker;
                self.bounds.extend(ll);
                console.log('before--------');
                console.log(self.bounds);
                console.log('before--------');
                var url = (! location.url) ? '<p>no url</p>' : '<p>url: <a href="'  + 
                                                            location.url + 
                                                            '" target="_blank">' + 
                                                            location.url + 
                                                            '<a></p>';
                var contentString = '<div id="content">' + 
                    '<p>name: ' + location.name + '</p>' +
                    '<p>category: ' + location.cat + '</p>' +
                    url +
                    '<p>source: ' + location.type + '</p>' +
                    '<p>'+ location.description + '</p>' +
                    '</div>';
                marker.info = new google.maps.InfoWindow({
                    content: contentString
                });
                google.maps.event.addListener(marker, 'click', function() {
                    // console.log(marker.info.content);
                    self.infowindow.setContent(marker.info.content);
                    self.infowindow.open(self.map,marker);
                 });
            };
            $.each(self.myLocations(),function(k,v){
                showMarker(v);
            });
            $.each(self.computedLocations(),function(k,v){
                showMarker(v);
            });
            console.log('after--------');
            console.log(self.bounds);
            console.log(self.map);
            console.log(self.bounds.getCenter());
            console.log('after--------');
            self.map.fitBounds(self.bounds);
            self.map.setCenter(self.bounds.getCenter());
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
                if (v.visible) {
                    v.marker.setMap(null);
                    v.visible=false;
                }
            });
            $.each(self.computedLocations(),function(k,v){
                // console.log('next one is 184');
                // console.log(v);
                // console.log(self.map);
                if (v.marker && !v.visible) {
                    v.marker.setMap(self.map);
                    v.visible=true;
                    // we need to change the bounds
                    // 
                    self.bounds.extend(v.marker.position);
                }
            });
            self.map.fitBounds(self.bounds);
            self.map.setCenter(self.bounds.getCenter());
        };
    };   // end of the viewModel
    var vm = new viewModel();
    ko.applyBindings(vm);
});
