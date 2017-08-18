app.controller('campaiginEditController', function ($scope,$interval) {


$scope.hoardingitems=[
      {
        id:'AD-001',
        type:'Billboard',
        area:'Amreepet',
        size:'20*30',
        light:'Yes',
        sdate:'20-Fed-2017',
        edate:'20-April-2017',
        price:'25,000',
      },
      {
        id:'AD-002',
        type:'Unipole',
        area:'Amreepet',
        size:'20*30',
        light:'Yes',
        sdate:'20-Fed-2017',
        edate:'20-April-2017',
        price:'25,000',
      },
      {
        id:'AD-003',
        type:'Digital',
        area:'Amreepet',
        size:'20*30',
        light:'Yes',
        sdate:'20-Fed-2017',
        edate:'20-April-2017',
        price:'25,000',
      }
      ]

      $scope.limit= 5;
      $scope.loadMore = function() {
        $scope.limit = $scope.items.length
      };

});