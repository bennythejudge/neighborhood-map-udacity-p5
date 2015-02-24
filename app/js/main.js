/** 
 * this is the viewModel
 * defined EVERYTHING inside here: methods, both public and private
 * callback functions
 */
$(document).ready(function() {
    'use strict';
    /**
    * the Model contains ... the data and the data manipulation
    * and exports methods that allow the viewModel to retrieve the 
    * data
    */
    var Model = {
        init: function() {
            console.log('inside Model.init')
            this.mainLocation = {
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
                visible:'true'
            };
            //console.log(this.mainLocation);
            this.bensfavs = [
                {cat: 'culture', name: 'Barbican Centre', address: 'EC2Y 8DS', city: 'london', lat: 51.5204543, lng: -0.0937136999999666, description: 'Great venue for music, cinema and exhibitions.', url: 'http://www.barbican.org.uk/', img: '', type:'readonly',visible:'true'},
                {cat: 'companies', name: 'Google', address: 'SW1W 9tq', city: 'london', lat: 51.49496560000001, lng: -0.14667389999999614, description: 'The Mothership', url: 'https://www.google.com', img: '', type:'readonly',visible:'true'},
                {cat: 'cafes', name: 'Barbican Cinemas Cafe', address: 'Beech Street', city: 'london', lat: 51.5205906, lng: -0.09486970000000383, description: '<p>Not just great movies: a friendly space open</p><p> to the public used by people to work, teach, learn, meet etc...</p><p>I do a lot of coding here...</p>', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'companies', name: 'Amazon Development Centre', address: 'EC1A 4JU', city: 'london', lat: 51.5216718, lng: -0.09826629999997749, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'locations', name: 'Silicon Roundabout', address: 'EC1Y 1BE', city: 'london', lat: 51.52567029999999, lng: -0.08756149999999252, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'locations', name: 'Shoreditch High Street station', address: 'Shoreditch High Street station', city: 'london', lat: 51.52338, lng: -0.07521999999994478, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'stores', name: 'Apple store', address: 'W1B 2EL', city: 'london', lat: 51.5142651, lng: -0.14222989999996116, description: 'First store to open in Europe in 2004', url: 'http://tinyurl.com/kwo7qnz', img: '', type:'readonly',visible:'true'},
                {cat: 'stores', name: 'Boxpark shoreditch', address: 'E1 6gy', city: 'london', lat: 51.52338109999999, lng: -0.07573070000000826, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'events', name: 'Silicon Milkroundabout', address: 'E1 6QL', city: 'london', lat: 51.5217064,lng:  -0.0722892999999658, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'cafes', name: 'Royal Festival Hall', address: 'SE1 8XX', city: 'london', lat: 51.5055375,lng: -0.1156066, description: '', url: '', img: '', type:'readonly',visible:'true'},
                {cat: 'hack spaces', name: 'London Hackspace', address: 'E2 9DY', city: 'london', lat: 51.531801,lng: -0.060318, description: 'Great space for hacking and building things.', url: 'https://london.hackspace.org.uk/', img: '', type:'readonly',visible:'true'},
            ];
            this.foursquarelocations = [];
            this.foursquarecategories = [ 'coworking', 'startups'];
            
            function() { 
                return function(value) { 
                    alert(elements[i] + value); 
                } 
            }(elements[i])
            
            
            
            
            
            
            
            this.fetch4square(this.foursquarelocations,this.foursquarecategories[0],(function(array,data){
                // console.log('inside the function that is passed as callback to fetch4square');
 //                console.log(data);
 //                console.log(array);
                $.each(data, function(k,v){
                    // console.log(k);
//                     console.log(v);
//                     console.log(v.venue.name);
//                     console.log(v.venue.location.lat);
//                     console.log(v.venue.location.lat);
//                     console.log(v.venue.categories['0'].name);
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
                        visible:'true'
                    };
                    this.foursquarelocations.push(loc);
                    console.log(array);
                });
            }.bind(this)));
            console.log('back in the init');
            console.log(this.foursquarelocations);
            this.locations = this.foursquarelocations.concat(this.bensfavs);
        },  // init
        fetch4square: function(array,category,callback) {
            var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
            var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
            var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
            'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + 
            '&v=20150101&ll='+this.mainLocation.lat+','+this.mainLocation.lng+'&query='+category;
            return (
                $.getJSON (
                    foursquareUrl
                ).done(function(data){
                    console.log('\tinside the done of the ajax call');
                    var locations = data.response.groups['0'].items;
                    // passing to the callback the destination array and the locations from
                    // 4square
                    callback(array,locations); 
                 }).fail(function(e){
                    alert('We are experiencing problems with the FourSquare interface.'+'\n'+
                     'We apologise for the inconvenience. \n Please try again later');
                    console.log("error " + e);
                })
            );
        },
        getLocations: function() {
            // console.log('inside getLocations');
            // console.log(this.locations);
            return (this.locations);
        },
        getMainLocation: function() {
            // console.log('inside getMainLocation');
            // console.log(this.mainLocation);
            return (this.mainLocation);
        },
    };
    /**
    * an object for all things googlemaps
    */
    var mapObject = {
        init: function(lat,lng,locations) {
            console.log('inside mapObject.init with lat ' + lat + ' lng: ' + lng);
            this.map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            this.addMarkers(this.map,locations);
        },
        addMarkers: function(map,locations) {
            // console.log('inside addMarkers: '+locations + ' map: ' + map);
            // console.log(this.map);
            $.each(locations,function(k,v){
                // console.log(k,v);
                // console.log(v);
                var myLatlng = new google.maps.LatLng(v.lat,v.lng);
                // console.log(myLatlng);
                var marker = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: myLatlng,
                    title: locations.name,
                });
            });
        },
        addMarker: function(latlng,location) {
            // console.log(self.geolocations());
            // if the location is marked 'not visible', skip it
            var currentMarker;
            var marker = new google.maps.Marker({
                map: self.map,
                animation: google.maps.Animation.DROP,
                position: latlng,
                title: location.name,
            });
            self.bounds.extend(latlng);
            var contentString = 
                '<div id="content">'+
                '<h3>'+location.name+'</h3>'+
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
        },
        
    };
    var viewModel = function(Model,mapObject) {
        console.log('inside viewModel');
        // console.log(Model);
        // console.log(mapObject);
        /** save the "this" for when the context changes */
        var self = this;
        // get the model started
        Model.init();
        // ticker
        self.ticker = ko.observable('warming up');
        // observable
        self.typesSelection = ko.observableArray([]);
        self.locations = ko.observableArray(Model.getLocations());
        self.searchTerm = ko.observable('');
        // console.log(self.locations());
        // create the map
        self.ticker('creating the map');
        var mapCenter = Model.getMainLocation();
        // console.log(mapCenter.lng);
        // initialize the map passing the center and the list of locations
        mapObject.init(mapCenter.lat,mapCenter.lng,self.locations());
        // TODO: below - to be reviewed
        
        
        
        
        /** 
         * create a single infowindow object to be reused - according to google the right
         * way to have only one infowindow open at any given time
         */
        var infoWindow = new google.maps.InfoWindow();
        self.bounds = new google.maps.LatLngBounds();
        //
        function reloadMarkers() {
            console.log('inside reload markers');
            ko.utils.arrayForEach (self.locations(), function(location) {
                if (!location.visible) {
                    return false;
                }
                var latlng =  new google.maps.LatLng(location.lat,location.lng);
                // console.log(location.name);
                addMarker(latlng,location);
            });
        };
        //
        /**
          * access TFL
          */
        // access the tfl with a timer; get the trains stopping at Barbican station; 
        // could you show the trains between moorgate, barbican and farringdon?
        
        // refresh the map every 2000ms
        // TODO: is this a good idea?
        // setTimeout(function(){reloadMarkers();self.ticker('');}, '5000');

        // TODO: reload markers must center the map and fitBounds
        
        // TODO: different categories must have different markers/colors
        // TODO: the list of entries must be in a fixed size side bar
        // TODO: the sidebar should be an overlay of the map
        // TODO: are there urls in foursquare?
        // 
        /**
         * update map bounds on page resize
         */
        // window.addEventListener('resize', function(e) {
        //     // console.log(self.bounds);
        //      self.map.fitBounds(self.bounds);
        //      self.map.setCenter(new google.maps.LatLng(self.locations()[0].lat, self.locations()[0].lng));
        //      // $("#map-canvas").height($(window).height());
        // });
        /**
          * event handler for click on map
          */
        // document.getElementById('map-canvas').addEventListener('click', reloadMarkers());
    };
    ko.applyBindings(new viewModel(Model,mapObject));
});
