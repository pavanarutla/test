app.controller('hoardingListCtrl', function($scope,$mdDialog,$http) {

    //   $scope.companiesPopup = function (ev) {
    //     $mdDialog.show({
    //       templateUrl: 'partials/companies-popup.html',
    //       fullscreen: $scope.customFullscreen,
    //       clickOutsideToClose: true
    //     })
    //   };
     $scope.addNewProduct = function (ev) {
        $mdDialog.show({
          templateUrl: 'partials/addnewproduct-popup.html',
          fullscreen: $scope.customFullscreen,
          clickOutsideToClose: true
        })
      };
       $scope.cancel = function() {
      $mdDialog.cancel();
    };
       $scope.gridHoarding = {  
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enableCellEditOnFocus: false,
            multiSelect: false,
            enableFiltering: true,
            enableSorting: true,
            showColumnMenu: false,
            enableGridMenu: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
       };
     
      
        $scope.gridHoarding.columnDefs = [
            { name: 'id', displayName: 'S.NO',enableCellEdit: false, width: '5%' },
            { name: 'siteno', displayName: 'Site No',enableCellEdit: false, width: '10%' },
            { name: 'sitetype', displayName: 'Site type',enableCellEdit: false, width: '10%' },
            { name: 'address', displayName: 'Address', width: '15%', enableCellEdit: false },
            { name: 'impression', displayName: 'Impression', width: '10%', enableCellEdit: false },
            { name: 'area', displayName: 'Area', width: '20%' },
            { name: 'palnesize', displayName: 'Palne Size' , type: 'number', width: '20%' },
            { name: 'lighting', displayName: 'lighting' , width: '10%' },
            { name: 'direction', displayName: 'Direction' , width: '10%',enableCellEdit: false, },
            { name: 'image', displayName: 'Image' , width: '10%',enableCellEdit: false, },
            { name: 'image', displayName: 'Price' , width: '10%',enableCellEdit: false, },
            
            {
            name: 'Action', field: 'Action', width: '10%',
            cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Finalized</md-button></md-menu-item><md-menu-item><md-button>Edit</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
            enableFiltering: false,
                            }
        ];

 $scope.msg = {};

 $scope.gridHoarding.onRegisterApi = function(gridApi){
          
          
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
          });
        };
      $http.get('companyagency.json')
    .success(function(data) {
      for(i = 0; i < data.length; i++){
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridHoarding.data = data;
    });

    $scope.cancel = function(){
      $mdDialog.cancel();
    }
    // add new hoarding Campanies


    $scope.hoardingSave = function(hoarding){
      $scope.hoardingData = $scope.hoarding;
      console.log($scope.hoardingData,"hoarding")
    }
    
      // upload on file select or drop
      $scope.saveProduct = function (files) {
        Upload.upload({
          url: config.apiPath + '/product',
          data: {image: files.image, symbol: files.symbol, product: $scope.product}
        }).then(function (resp) {
          console.log('Success. Product saved. Response: ', resp);
        }, function (resp) {
          console.log('Error status: ', resp);
        }, function (evt) {
          // console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
        });
      };
});