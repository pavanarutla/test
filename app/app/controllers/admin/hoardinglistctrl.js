app.controller('hoardingListCtrl', function ($scope, $mdDialog, $http, $timeout, $q, $log, $mdDateRangePicker) {

  //   $scope.companiesPopup = function (ev) {
  //     $mdDialog.show({
  //       templateUrl: 'partials/companies-popup.html',
  //       fullscreen: $scope.customFullscreen,
  //       clickOutsideToClose: true
  //     })
  //   };
  $scope.addNewProduct = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/addnewproduct-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  $scope.addNewFormats = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/addnewformats-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  //gridFormats
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
  $scope.gridFormats = {
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

  $scope.gridFormats.columnDefs = [
    { name: 'id', displayName: 'S.NO', enableCellEdit: false, width: '10%' },
    { name: 'formattype', displayName: 'Formats Type', enableCellEdit: false, width: '30%' },
    { name: 'Icon', displayName: 'Image', width: '30%', enableCellEdit: false, },
    {
      name: 'Action', field: 'Action', width: '30%',
      cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button>Edit</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.gridHoarding.columnDefs = [
    { name: 'id', displayName: 'S.NO', enableCellEdit: false, width: '5%' },
    { name: 'siteno', displayName: 'Site No', enableCellEdit: false, width: '10%' },
    { name: 'sitetype', displayName: 'Site type', enableCellEdit: false, width: '10%' },
    { name: 'address', displayName: 'Address', width: '15%', enableCellEdit: false },
    { name: 'impression', displayName: 'Impression', width: '10%', enableCellEdit: false },
    { name: 'area', displayName: 'Area', width: '20%' },
    { name: 'palnesize', displayName: 'Palne Size', type: 'number', width: '20%' },
    { name: 'lighting', displayName: 'lighting', width: '10%' },
    { name: 'direction', displayName: 'Direction', width: '10%', enableCellEdit: false, },
    { name: 'image', displayName: 'Image', width: '10%', enableCellEdit: false, },
    { name: 'image', displayName: 'Price', width: '10%', enableCellEdit: false, },

    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Finalized</md-button></md-menu-item><md-menu-item><md-button>Edit</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
      enableFiltering: false,
    }
  ];

  $scope.msg = {};

  $scope.gridFormats.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $scope.gridHoarding.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridFormats.data = data;
    });
    $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridHoarding.data = data;
    });

  // upload on file select or drop
  $scope.saveProduct = function (files) {
    Upload.upload({
      url: config.apiPath + '/product',
      data: { image: files.image, symbol: files.symbol, product: $scope.product }
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

  //CampaignSearchFeed data

  //1.Hoarding Companies
  $scope.hoardCompanys = ('PrakashAds EagleEye Spoorthy Me&Me HermonCreative AdlogicMediaPvtLtd Balaji Agencies ThePRDesignz AtCreativee Zhoppy Billboard ' +
  'BillboardIndia').split(' ').map(function(hoardCompany) {
      return {abbrev: hoardCompany};
    });

     //2. Format types
    $scope.formatTypes = ('BillboardAdvertising PointOfSale BusShelters Kiosks TelephoneBooths Taxis Buses Subways Trains MobileBillboards Guerrilla ' +
    'BillboardIndia1').split(' ').map(function(formatType) {
        return {abbrev: formatType};
      });

        //  3.Type ahead
      
          $scope.simulateQuery = true;
          $scope.isDisabled    = false;
      
          // list of `state` value/display objects
          $scope.states        = loadAll();
          $scope.querySearch   = querySearch;
          $scope.selectedItemChange = selectedItemChange;
          $scope.searchTextChange   = searchTextChange;
      
          $scope.newState = newState;
      
          function newState(state) {
            alert("Sorry! You'll need to create a Constitution for " + state + " first!");
          }
      
          // ******************************
          // Internal methods
          // ******************************
      
          /**
           * Search for states... use $timeout to simulate
           * remote dataservice call.
           */
          function querySearch (query) {
            var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
                deferred;
            if ($scope.simulateQuery) {
              deferred = $q.defer();
              $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
              return deferred.promise;
            } else {
              return results;
            }
          }
      
          function searchTextChange(text) {
            $log.info('Text changed to ' + text);
          }
      
          function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
          }
      
          /**
           * Build `states` list of key/value pairs
           */
          function loadAll() {
            var allStates = 'Ameerpet, Aminpur, Begumpet, Banjara Hills, Chilkalguda, Champapet, Charminar, Dilsukhnagar,\
                    Fathenagar, Faluknama, Gachibowli, Hafeezpet, Hitechcity, Izzathnagar, Kukatpally, Karamgath, Lakdikapul,\
                    Malakpet, Madapur, Miyapur, Madinaguda, Mythrinagar, Mythrivanam, Kondapur ,Kothaguda,\
                    Jubilee Hills, Jubilee Checkpost,\
                    Wisconsin, Wyoming';
      
            return allStates.split(/, +/g).map( function (state) {
              return {
                value: state.toLowerCase(),
                display: state
              };
            });
          }
      
          /**
           * Create filter function for a query string
           */
          function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
      
            return function filterFn(state) {
              return (state.value.indexOf(lowercaseQuery) === 0);
            };
      
          }
        



  


  //CampaignSearchFeed data
  
  //3. DateRange Picker 
  var tmpToday = new Date();
  $scope.mdCustomTemplates = [
    {
        name: "Last 3 Months",
        dateStart: new Date((new Date()).setMonth(tmpToday.getMonth() - 3)),
        dateEnd: new Date()
    },
    {
        name: "Last 6 Months",
        dateStart: new Date((new Date()).setMonth(tmpToday.getMonth() - 6)),
        dateEnd: new Date()
    }
  ];
  $scope.mdLocalizationMap = {
      'Mon': 'Mon*',
      'This Week': 'Current Week',
  };
  var tmpToday = new Date();
  $scope.mdCustomTemplates = [
    {
        name: "Last 3 Months",
        dateStart: new Date((new Date()).setMonth(tmpToday.getMonth() - 3)),
        dateEnd: new Date()
    },
    {
        name: "Last 6 Months",
        dateStart: new Date((new Date()).setMonth(tmpToday.getMonth() - 6)),
        dateEnd: new Date()
    }
  ];
  $scope.selectedRange = {
      selectedTemplate: 'TW',
      selectedTemplateName: 'This Week',
      dateStart: null,
      dateEnd: null,
      showTemplate: false,
      fullscreen: false,
      firstDayOfWeek: 0,
      localizationMap: $scope.mdLocalizationMap,
      customTemplates: $scope.mdCustomTemplates,
      disableTemplates: "TW,LW",
      showClear: true,
  };

  $scope.onSelect = function (scope) { console.log($scope.selectedRange.selectedTemplateName); return $scope.selectedRange.selectedTemplateName; };
  $scope.pick = function ($event, showTemplate) {
      console.log('Button Fired!');
      $scope.selectedRange.showTemplate = showTemplate;
      $mdDateRangePicker.show({ targetEvent: $event, model: $scope.selectedRange }).then(function (result) {
          if (result) $scope.selectedRange = result;
      })
  };
  $scope.clear = function () {
      $scope.selectedRange.selectedTemplate = null;
      $scope.selectedRange.selectedTemplateName = null;
      $scope.selectedRange.dateStart = null;
      $scope.selectedRange.dateEnd = null;
  }
  $scope.isDisabledDate = function ($date) {
      return $date > new Date();
  }
  $scope.isDisabledWeekend = function ($date) {
      return [0, 6, 7].indexOf($date.getDay()) > -1;
  }


});