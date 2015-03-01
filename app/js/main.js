/*
TODO: 
2) entries in the list of locations have the category in bracket
ex: barbican (ben's favorites)
6) hovering on the choices changes the color
9) add a custom control to center the map (https://developers.google.com/maps/documentation/javascript/examples/control-custom)
12) a media query is required for smaller screens (iphone or similar). ipad seems ok. - resize the sidebar fonts
13) check for all possible errors and failures
- disconnect wifi 
- google maps (google not defined in particular)
14) highlight entry in sidebar when it's selected
15) think event! what event could be triggered and how do you handle it?
- resizing (c'e' gia' un handler ma non fa niente)
- clicking
- dragging the map
????
16) the infowindow is not working for small screen 320x480 sembra che si veda solo a partire da 401 x anything?
17) must change format for smallerscrens
18) keep the map centered and within the bounds as it is resized


/** 
 * this is the viewModel
 * defined EVERYTHING inside here: methods, both public and private
 * callback functions, observable, global variables etc.
 */
$(document).ready(function() {
    'use strict';
    try {
            var viewModel = function(Model,mapObject) {
            // save the "this" for when the context changes
            var self = this;
            // google maps
            var map;
            // array to set the map bounds
            self.bounds = new google.maps.LatLngBounds();
            // one single infowindow object shared, so that only one
            // infowindow can be open at any time 
            self.infowindow = new google.maps.InfoWindow();
            // observables *********************************************
            // my main location in London
            self.mainLocation = ko.observable({
                cat: 'my favorites', 
                name: 'Barbican Centre', 
                address: 'EC2Y 8DS', 
                city: 'london', 
                lat: 51.5204543, 
                lng: -0.0937136999999666, 
                description: 'Great venue for music, cinema and exhibitions.', 
                url: 'http://www.barbican.org.uk/', 
                img: '', 
                type:'my favorites',
                visible:true,
            });
            // ftse ticker
            self.ticker = ko.observable('Real Time FTSE Ticker');
            ko.bindingHandlers.flash = {
                update: function(element,valueAccessor) {
                    ko.utils.unwrapObservable(valueAccessor());
                    $(element).hide().fadeIn(700);
                }
            };
            // lse location
            self.lselocation = ko.observable({
                cat: 'live data', 
                name: 'London Stock Exchange', 
                address: 'EC2Y 8DS', 
                city: 'London', 
                lat: 51.515053,
                lng: -0.099034, 
                description: '', 
                url: 'http://www.londonstockexchange.com/home/homepage.htm', 
                img: '', 
                type:'my favorites',
                visible:true,
            });
            // my favourite locations in London
            self.myLocations = ko.observableArray([
                    {cat: 'my favorites', name: 'Barbican Centre', address: 'EC2Y 8DS', city: 'london', lat: 51.5204543, lng: -0.0937136999999666, description: 'Great venue for music, cinema and exhibitions.', url: 'http://www.barbican.org.uk/', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Google', address: 'SW1W 9tq', city: 'london', lat: 51.49496560000001, lng: -0.14667389999999614, description: 'The Mothership', url: 'https://www.google.com', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Barbican Cinemas Cafe', address: 'Beech Street', city: 'london', lat: 51.5205906, lng: -0.09486970000000383, description: '<p>Besides showing movies of great quality from all over the world, this is also a friendly space open</p><p> to the public used by people to work, teach, learn, meet etc...</p><p>I do a lot of coding here...</p>', url: '', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: 51.52567029999999, lng: -0.08756149999999252, description: 'London\'s answer to Silicon Valley. Dirty, smogged, dangerous, noisy. Ugly!', url: '', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: 51.52338, lng: -0.07521999999994478, description: 'HERE BE HIPSTERS!', url: '', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: 51.5142651, lng: -0.14222989999996116, description: 'First store to open in Europe in 2004', url: 'http://tinyurl.com/kwo7qnz', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: 51.52338109999999, lng: -0.07573070000000826, description: 'popup stores and interesting street foods. very HIP! do not come here unless you sport a modern beard', url: '', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: 51.5217064,lng:  -0.0722892999999658, description: '', url: '', img: '', type:'readonly',visible:true},
                    {cat: 'my favorites', name: 'Royal Festival Hall', address: 'SE1 8XX', city: 'london', lat: 51.5055375,lng: -0.1156066, description: '', url: '', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'London Hackspace', address: 'E2 9DY', city: 'london', lat: 51.531801,lng: -0.060318, description: 'Great space for hacking and building things.', url: 'https://london.hackspace.org.uk/', img: '', type:'my favourites',visible:true},
                    {cat: 'my favorites', name: 'Impact Hub Westminster', address: 'SW1Y 4TE', city: 'london', lat: 51.5078348,lng: -0.1316065, description: '', url: 'http://westminster.impacthub.net/', img: '', type:'my favourites',visible:true},
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
            // observables *********************************************
            // methods ==========================================================
            // get 4square data
            ko.utils.arrayForEach(self.foursquarecategories(), function(cat) {
                // console.log('now searching 4square with '+cat);
                var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
                var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
                var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
                'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET +
                '&v=20150101&ll='+self.mainLocation().lat+','+self.mainLocation().lng+
                 '&radius=2500' + '&query='+cat;
                 // using ajax instead of getJSON (which is a wrapper anyway) so that
                 // I can set a timeout
                 var jqxr = $.ajax({
                   dataType: 'json',
                   url: foursquareUrl,
                   timeout: 6000
                 })
                 .fail(function(e){
                    alert('We are experiencing problems with the FourSquare interface. We apologise for the inconvenience. Please try again later');
                    // console.log("error " + e);
                    // we still have the local data, so show it
                    pleaseShowTheMarkers();
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
                try {
                    self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                        zoom: 15,
                        center: new google.maps.LatLng(self.mainLocation().lat,self.mainLocation().lng),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                } catch(e) {
                    alert('We are experiencing problems with the Google Maps interface. We apologise for the inconvenience. Please try again later');
                };
                /**
                * THIS ONE NEEDS SOME ATTENTION ***************
                */
                // google.maps.event.addListener(self.map, 'bounds_changed', function() {
                //     console.log('map resized');
                // });
                /**
                * THIS ONE NEEDS SOME ATTENTION ***************
                */
            }(); // end showMap
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
                    // console.log(location.cat)
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
                    // console.log('before--------');
                    // console.log(self.bounds);
                    // console.log('before--------');
                    var url = (! location.url) ? '<p>no url</p>' : '<p><a href="'  + 
                                                                location.url + 
                                                                '" target="_blank">' + 
                                                                location.url + 
                                                                '<a></p>';
                    var contentString = '<div id="infowindow">' + 
                        '<p>'+ location.name + '</p>' +
                        '<p>' + location.cat + '</p>' +
                        url +
                        '<p>'+ location.description + '</p>' +
                        '</div>';
                    marker.info = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 274,
                    });
                    marker.infocontent = contentString;
                    google.maps.event.addListener(marker, 'click', function() {
                        openInfoWindow(marker,self.map);
                    });
                }; 
                $.each(self.myLocations(),function(k,v){
                    showMarker(v);
                });
                $.each(self.computedLocations(),function(k,v){
                    showMarker(v);
                });
                self.map.fitBounds(self.bounds);
                self.map.setCenter(self.bounds.getCenter());
            }; // end pleaseShowTheMarkers()
            var openInfoWindow = function(marker,map) {
                self.infowindow.setContent(marker.info.content);
                self.infowindow.open(map,marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){ marker.setAnimation(null); }, 710);
            };
            var updateMarkers = function() {
                var diff = $(self.locations()).not(self.computedLocations()).get();
                $.each(diff,function(k,v){
                    if (v.visible) {
                        v.marker.setMap(null);
                        v.visible=false;
                    }
                });
                $.each(self.computedLocations(),function(k,v){
                    if (v.marker && !v.visible) {
                        v.marker.setMap(self.map);
                        v.visible=true;
                        // we need to change the bounds
                        self.bounds.extend(v.marker.position);
                    }
                });
                self.map.fitBounds(self.bounds);
                self.map.setCenter(self.bounds.getCenter());
            };
            self.locationClickHandler = function(location) {
                openInfoWindow(location.marker,self.map);
            };
            // IIFE
            var backgroundTask = function() {
                var fetchData = function() {
                    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quoteslist%20where%20symbol%3D\'%5EFTSE\'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
                    var jqxr = $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: url,
                        timeout: 6000,
                    })
                    .fail(function(e){
                       alert('We are experiencing problems with the Yahoo interface. We apologise for the inconvenience. Please try again later');
                   })
                   .done(function(data){
                       // show ticker
                       // console.log(data);
                       // console.log(self.map);
                       self.ticker('FTSE: ' + data.query.results.quote.LastTradePriceOnly + ' '+ data.query.results.quote.LastTradeTime);
                       // simulate change using random numbers
                       // self.ticker('FTSE: ' + Math.floor((Math.random() * 10) + 1)*1000000);
                    });
                };
                setInterval(fetchData,10000);
            }();
        };   // end of the viewModel
        var vm = new viewModel();
        ko.applyBindings(vm);
    } catch (e) {
        alert('We are experiencing a general problem. We apologise for the inconvenience. '+e);
    };
});
