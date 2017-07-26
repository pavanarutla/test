app.service('GMapSrvc', function($q) {
    
    this.create = function(domElement, options) {
        if(options == undefined){
            var options = {
                center: new google.maps.LatLng(17.4574, 78.3720),
                zoom: 13,
                disableDefaultUI: true    
            }
        }
        this.map = new google.maps.Map(
            domElement, options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.getMapObjForLocation = function(lat, lng){
        return new google.maps.LatLng(lat, lng);
    }

    this.PlacesServices = function(){
        return this.places;    
    }
    
    this.searchByName = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results);
            }
            else d.reject(status);
        });
        return d.promise;
    }

    this.searchByType = function(location, radius, types) {
        var d = $q.defer();
        var request = {
            location: location,
            radius: radius, 
            type: types
        };
        this.places.nearbySearch(request, function(results, status) {
            if (status == 'OK') {
                d.resolve(results);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        // if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        // this.map.setCenter(res.geometry.location);
    }
    
});