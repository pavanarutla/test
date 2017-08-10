app.controller('GmapCtrl', ['$scope', 'NgMap','$element','$mdSidenav', function($scope, NgMap,$element,$mdSidenav) {
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

}]);
