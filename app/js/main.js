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
        var map;
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
            visible:'true',
        });
        // my favourite locations in London
        self.myLocations = ko.observableArray([
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
        ]);
        self.typesSelection = ko.observableArray([]);
        self.foursquarecategories = ko.observable([ 'coworking', 'startups','restaurants']);
        // 4square locations
        self.locations = ko.observableArray();
        self.searchTerm = ko.observable('');
        // needed later on
        var pleaseHandleThisDisaster = function(a){
            // console.log(a);
            // console.log(self.locations());
            self.locations.push(a);
        }
        // get the ajax data
        ko.utils.arrayForEach(self.foursquarecategories(), function(cat) {
            console.log('now searching 4square with '+cat);
            var CLIENT_ID='SNOQCJIS13MCJ0IWGDEUNKLZGPVY5MQVSPNFF0Z1CXMV5MH2';
            var CLIENT_SECRET='Z2PFXOJSYNMAU5XIM41HFD4TKHA0KRICYUPI3W0ZQVZFNPW3';
            var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?' +
            'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET +
            '&v=20150101&ll='+self.mainLocation().lat+','+self.mainLocation().lng+
            '&query='+cat;
            var jqxr = $.getJSON(foursquareUrl)
            .fail(function(e){
                alert('We are experiencing problems with the FourSquare interface.<br/> We apologise for the inconvenience. Please try again later');
                console.log("error " + e);
            })
            .done(function(data){
                // console.log(data);
                // console.log(self.locations());
                $.each(data.response.groups['0'].items, function(k,v){
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
                    pleaseHandleThisDisaster(loc);
                });
                pleaseShowTheMarkers();
            });
        });
        var showMap = function() {
            console.log('inside showMap');
            self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(self.mainLocation().lat,self.mainLocation().lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        }();
        var pleaseShowTheMarkers = function() {
            $.each(self.locations(),function(k,v){
                // console.log(k,v);
                // console.log(self.map);
                var ll = new google.maps.LatLng(
                  v.lat,
                  v.lng
                );
                var marker = new google.maps.Marker({
                    map: self.map,
                    animation: google.maps.Animation.DROP,
                    position: ll,
                    title: v.name,
                });
            })
        };
    };
    ko.applyBindings(new viewModel());
});
