app.controller('GmapCtrl', ['$scope', 'NgMap','$element','$mdSidenav','$mdDialog', function($scope, NgMap, $element, $mdSidenav, $mdDialog,$rootScope ) {
    NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });

  // clender
  $scope.opened = {
    start: false,
    end: false
  };

  $scope.today = new Date();

  //slider

  function sliderController($scope) {
    $scope.color = {
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255)
    };
    $scope.rating = 0;
    $scope.disabled = 100;
  };
  // $rootScope.address = 'Hyderabad'; 

  $scope.selectedCountry = { Id: '1', Countryname: 'India' };
  $scope.selectedStates={};
  $scope.selectedcitys={};
  $scope.selectedareas={};
  $scope.allcountries = [];
  $scope.states = [];
  $scope.citys = [];
    $scope.areas = [];

  //select country
 
  var countries = [
    { Id: '1', Countryname: 'India' },
    { Id: '2', Countryname: 'USA' },
    { Id: '3', Countryname: 'Australia' },
    { Id: '4', Countryname: 'Brazil' },
    { Id: '5', Countryname: 'Germany' },
    { Id: '6', Countryname: 'NewYork' }
  ];
 
  // console.log($scope.countries,"countries")
  // select state

  var states = [
    { Id: '1', statename: 'Telangana', countriesId: 1 },
    { Id: '2', statename: 'Karnataka', countriesId: 1 },
    { Id: '3', statename: 'Maharashtra', countriesId: 1 },
    { Id: '4', statename: 'Kerala', countriesId: 1 },
    { Id: '5', statename: 'Odisha', countriesId: 1 },
    { Id: '6', statename: 'Tamil Nadu', countriesId: 1 }
  ]
  $scope.searchTerm;
  $scope.clearSearchTerm = function () {
    $scope.searchTerm = '';
  };
  // The md-select directive eats keydown events for some quick select
  // logic. Since we have a search input here, we don't need that logic.
  $element.find('input').on('keydown', function (ev) {
    ev.stopPropagation();
  });

  // city selection

  var citys = [
    { Id: '1', cityname: 'Hyderabad ',statesId:1 },
    { Id: '2', cityname: 'Bengaluru',statesId:2 },
    { Id: '3', cityname: 'Mumbai',statesId:3 },
    { Id: '4', cityname: 'Thiruvananthapuram',statesId:4 },
    { Id: '5', cityname: 'Bhubaneswar',statesId:5 },
    { Id: '6', cityname: 'Chennai',statesId:6 }
  ];
  $scope.searchTerm;
  $scope.clearSearchTerm = function () {
    $scope.searchTerm = '';
  };
  // The md-select directive eats keydown events for some quick select
  // logic. Since we have a search input here, we don't need that logic.
  $element.find('input').on('keydown', function (ev) {
    ev.stopPropagation();
  });
  // areas

  var areas = [
    { Id: '1', areaname: 'Amerpet',citysId: 1 },
    { Id: '2', areaname: 'SR nagar',citysId: 2 },
    { Id: '3', areaname: 'Panjagutta',citysId: 3 },
    { Id: '4', areaname: 'Somajigudda',citysId: 4 },
    { Id: '5', areaname: 'Imax',citysId: 5 },
    { Id: '6', areaname: 'Imax',citysId: 6 }
  ];
  $scope.searchTerm;
  $scope.clearSearchTerm = function () {
    $scope.searchTerm = '';
  };
  // The md-select directive eats keydown events for some quick select
  // logic. Since we have a search input here, we don't need that logic.
  $element.find('input').on('keydown', function (ev) {
    ev.stopPropagation();
  });
  // $scope.Submit = function (data) {
  //   $scope.data = data;
  //   console.log("posting data....");
  //   formData = $scope.form;
  //   console.log(formData);
  // };

  $scope.allcountries = countries;
  $scope.setCountry = function(){
    // console.log(typeof parseInt($scope.selectedCountry), parseInt($scope.selectedCountry));
    $scope.states = states.filter(function (st) {
      return st.countriesId == parseInt($scope.selectedCountry);
    });
  }

  $scope.setStates = function(){
    //console.log($scope.selectedStates);
    $scope.citys = citys.filter(function (citi) {
      return citi.statesId == parseInt($scope.selectedStates);
    });
  }
  $scope.setcitys = function(){
    //console.log($scope.selectedStates);
    $scope.areas = areas.filter(function (ar) {
      return ar.citysId == parseInt($scope.selectedcitys);
    });
  }
  
// shoartlist
$scope.closeSideViewAll = function() {
     $mdSidenav('viewAll').toggle();
  };

  //saved campaign
  $scope.closeSideSavedCampaign = function() {
     $mdSidenav('savedCampaign').toggle();
  };
// saved view all side nav
$scope.closeSideViewAll = function() {
     $mdSidenav('savedViewAll').toggle();
  };
// edit list saved campgin
$scope.closeSideEditList = function() {
     $mdSidenav('savedEdit').toggle();
  };
// saved campgin
$scope.closeSideSavedCampaign = function() {
     $mdSidenav('savedSavedCampaign').toggle();
  };

// Save Campgin Details
$scope.saveCampaignDetails = function() {
     $mdSidenav('saveCampaignDetails').toggle();
  };

// Thanks Message
$scope.closeSideThanksSidenav = function() {
     $mdSidenav('thanksCampaign').toggle();
  };
// Share Message
$scope.shareSidenav = function() {
     $mdSidenav('shareCampaign').toggle();
  };
// Suggest Me dialog 
$scope.suggestMe = function() {
     $mdSidenav('suggestMe').toggle();
  };

//Confirm Dialog
$scope.showAlert = function(ev) {
    console.log(ev);
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('body')))
        .clickOutsideToClose(true)
        .title('Your Campaign is successfully shared!!!!')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
//Confirm Dialog 1
$scope.showConfirmation = function(ev) {
    console.log(ev);
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('body')))
        .clickOutsideToClose(true)
        .title('Your Campaign is successfully Saved!!!!')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
   $scope.IndustrySector = [
        {model : "automotive"},
        {model : "Consumer Durables"},
        {model : "Education"},
        {model : "Entertainment"},
        {model : "Fashion & lifestyle"},
        {model : "Banking, Financial services and Insurance "},
        {model : "Healthcare"},
        {model : "Hotels & Restaurant"},
        {model : "Office Supplies"},
        {model : "Retail"},
        {model : "Public Services"},
        {model : "Real Estate & Infrastructure"},
        {model : "Telecom"},
        {model : "Travel & Transport"},
        {model : "Ecommerce "},
        {model : "Fast-moving consumer goods"},
        {model : "IT"},
        {model : "Classifieds"},
        {model : "Others"}
        
    ];
      $scope.CampaignDuration = [
        {model : "10 Days"},
        {model : "15 Days"},
        {model : "20 Days"},
        {model : "25 Days"},
        {model : "30 Days"},
        {model : "2 Months"},
        {model : "3 Months"},    
        {model : "6 Months"},
        {model : "1 year"}
    ];
        //$scope.agents = [1,2]

//Suggest Me Dialog 1
$scope.suggestMeConfirm = function(project) {
    console.log(project);
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('body')))
        .clickOutsideToClose(true)
        .title('We will get back to you!!!!')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(project)
    );
  };


}]);
