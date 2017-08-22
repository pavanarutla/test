app.controller('GmapCtrl', ['$scope', 'NgMap','$element', function($scope, NgMap,$element) {
    NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });

    // clender
  $scope.opened ={
  start: false,
  end: false
};

$scope.today = new Date();

$scope.filter = false;
$scope.format = false;
$scope.shortlist = false;
$scope.savedcampaign = false;


$scope.filters = function(){
  $scope.filter = !$scope.filter;
  $scope.format = false;
  $scope.shortlist = false;
  $scope.savedcampaign = false;
}
$scope.formats = function(){
  $scope.filter= false;
  $scope.format= !$scope.format;
  $scope.shortlist = false;
  $scope.savedcampaign = false;  
}

$scope.shortlistDiv = function(){
  $scope.filter = false;
  $scope.format = false;
  $scope.shortlist = !$scope.shortlist;
  $scope.savedcampaign = false; 
}

$scope.savedcampaignDiv = function(){
  $scope.filter = false;
  $scope.format = false;
  $scope.shortlist = false;
  $scope.savedcampaign = !$scope.savedcampaign;
}

//slider

function sliderController ($scope) {
   $scope.color = {
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255)
   };
   $scope.rating = 0;        
   $scope.disabled = 100;
};

// select state

$scope.states = ['AP' ,'TS' ,'KR' ,'KAK' ,'TN', 'UP'];
      $scope.searchTerm;
      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
});
// city

$scope.citys = ['HYD' ,'WRG' ,'NZM' ,'KHM' ,'KRN', 'AB'];
      $scope.searchTerm;
      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
});
// areas

$scope.areas = ['Amerpet' ,'SR nagar' ,'Panjagutta' ,'Somajigudda' ,'Imax'];
      $scope.searchTerm;
      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
});
  
}]);