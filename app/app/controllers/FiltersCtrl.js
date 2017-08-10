//var app = angular.module( ['vsGoogleAutocomplete']);

app.controller('FilterCtrl', function($scope) {
  $scope.options = {
    types: ['(cities)']
  };
  
  $scope.address = {
    name: '',
    place: '',
    components: {
      placeId: '',
      streetNumber: '', 
      street: '',
      city: '',
      state: '',
      countryCode: '',
      country: '',
      postCode: '',
      district: '',
      location: {
        lat: '',
        long: ''
      }
    }
  };
  
});