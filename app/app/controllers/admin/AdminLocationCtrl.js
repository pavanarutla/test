app.controller('AdminLocationCtrl', function ($scope, $http, AdminLocationService, toastr) {

  $scope.countryList = [];
  $scope.stateListForCountry = [];
  $scope.cityListForState = [];

  var LodingAllData = function () {
  AdminLocationService.getAllAreas().then(function (data) {
    $scope.listoflocationdata = data;
  });
  AdminLocationService.getAllStates().then(function (data) {
    $scope.stateareaList = data;
  });
  AdminLocationService.getAllCities().then(function (data) {
    $scope.citylocationdata =data;
  });
  AdminLocationService.getAllAreas().then(function (data) {
    $scope.arealocationdata = data;
  });
}
LodingAllData();

// ************** Country page
$scope.saveCountry = function () {
  AdminLocationService.saveCountry($scope.country.name).then(function (data) {
    if (data.status == 1) {
      toastr.success('Country added to database successfully!');
     getCountryList();       
    $scope.country.name="";
    }
    else {
      toastr.error(data.message);
    }
  });
}  
$scope.editCountry = function (country) {
  $scope.country = country;
}
$scope.deleteCountry = function (country) {
  AdminLocationService.deleteCountry(country.id).then(function (result) {
    if (result.status == 1) {
      toastr.success(result.message);
    }
    else {
      toastr.error(result.message);
    }
    getCountryList();
  });
}
var getCountryList = function () {
AdminLocationService.getCountries().then(function (Countrydata) {
  $scope.countryList = Countrydata;
});
}
getCountryList();
// ************** Country page End

// ************** State page
$scope.saveState = function () {
  AdminLocationService.saveState($scope.state).then(function (data) {
    if (data.status == 1) {
      toastr.success('State added to database successfully!');
      AdminLocationService.getAllStates().then(function (data) {
        $scope.stateareaList = data;
        console.log($scope.stateareaList)
      });
    }
    else {
      toastr.error(data.message);
    }
    LodingAllData();
    $scope.state.country_id="";
    $scope.state.state_name="";
  });
}
$scope.editState = function (state) {
  $scope.state = {};
  $scope.state.country_id = state.country_id;
  $scope.state.state_name = state.name;
  LodingAllData();
}
$scope.stateareaList = function (country) {
  AdminLocationService.getStates(country).then(function (data) {
    $scope.stateListForCountry = data;
  });
}
$scope.deleteState = function (state) {
  AdminLocationService.deleteState(state.id).then(function (result) {
    if (result.status == 1) {
      toastr.success(result.message);
    }
    else {
      toastr.error(result.message);
    }
    LodingAllData();
  });
}
// ************** State page End

// ************** City page

$scope.saveCity = function (city) {
  AdminLocationService.saveCity($scope.city).then(function (data) {
    if (data.status == 1) {
      toastr.success('City added to successfully!');
      AdminLocationService.getAllCities().then(function (data) {
        $scope.Citydata = data;
      });
    }
    else {
      toastr.error(data.message);
    }
    LodingAllData();
    $scope.city.country_id="";
    $scope.city.state_id="";
    $scope.city.city_name="";
  });
}
$scope.editCity = function (city) {
  console.log(city);
  $scope.city = {};
  $scope.city.country_id = city.country_id;
  $scope.city.state_id = city.state_id;
  $scope.city.city_name = city.name;
}
$scope.deleteCity = function (city) {
  AdminLocationService.deleteCity(city.id).then(function (result) {
    if (result.status == 1) {
      toastr.success(result.message);
    }
    else {
      toastr.error(result.message);
    }
    LodingAllData();
  });
}
$scope.getCityList = function (state) {
  AdminLocationService.getCities(state).then(function (data) {
    $scope.cityListForState = data;
  });
}
// ************** City page End

// ************** Area page
$scope.saveArea = function (area) {
  console.log(area);
  AdminLocationService.saveArea($scope.area).then(function (data) {
    if (data.status == 1) {
      toastr.success('Area added to database successfully!');
      AdminLocationService.getAllAreas().then(function (data) {
        $scope.Areadata = data;
      });
    }
    else {
      toastr.error(data.message);
    }
    LodingAllData();
  });
}
$scope.deleteArea = function (locations) {
  AdminLocationService.deleteArea(locations.id).then(function (result) {
    if (result.status == 1) {
      toastr.success(result.message);
    }
    else {
      toastr.error(result.message);
    }
    LodingAllData();
  });
}
$scope.editArea = function (area) {
  //console.log(area);
  $scope.area = {};
  $scope.area = area;
  $scope.area.area_name = area.name;
  $scope.area.country_id = area.country_id;
  $scope.area.state_id = area.state_id;
  $scope.area.city_id = area.city_id;
  LodingAllData();
}
// ************** Area page END

  $scope.resetAreaForm = function () {
    $scope.area = {};
  }

// Location tables cod load more e start
var vm = $scope;
vm.limit = 5;
$scope.AllLocationsloadMore = function() {
  var increamented = vm.limit + 5;
  vm.limit = increamented > $scope.countryList.length ? $scope.countryList.length : increamented;
};
// Country tables code end 


// Country tables cod load more e start
var vm = $scope;
vm.limit = 5;
$scope.CountryloadMore = function() {
  var increamented = vm.limit + 5;
  vm.limit = increamented > $scope.countryList.length ? $scope.countryList.length : increamented;
};
// Country tables code end 

   // tables cod load more e start
    var mv = $scope;
    mv.limit = 5;
    $scope.StateloadMore = function() {
      var increamented = vm.limit + 5;
      mv.limit = increamented > $scope.stateareaList.length ? $scope.stateareaList.length : increamented;
    };
    $scope.prevloadMore = function(){
      var decrement = vm.limit - 5;
      if(decrement == 0){
        
      }
      mv.limit = decrement > $scope.stateareaList.length ? $scope.stateareaList.length : decrement;
    }
  // tables code end
  // tables city start
  var lc = $scope;
    lc.limit = 5;
    $scope.CityloadMore = function() {
      var increamented = vm.limit + 5;
      lc.limit = increamented > $scope.citylocationdata.length ? $scope.citylocationdata.length : increamented;
    };
  // tables city end
    // tables city start
    var lc = $scope;
    lc.limit = 5;
    $scope.ArealoadMore = function() {
      var increamented = vm.limit + 5;
      lc.limit = increamented > $scope.arealocationdata.length ? $scope.arealocationdata.length : increamented;
    };
  // tables city end

});