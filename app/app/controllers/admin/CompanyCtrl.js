app.controller('CompanyCtrl', function ($scope, $mdDialog, $http, CompanyService, toastr) {

  $scope.msg = {};

  $scope.cancel = function(){
    $mdDialog.hide();
  }
  /*
  ======== Companies ========
  */
  $scope.showAddCompanyPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/add-company-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };

  $scope.gridCompany = {
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

  $scope.gridCompany.columnDefs = [
    { name: 'name', displayName: 'Company Name', enableCellEdit: false, width: '15%' },
    { name: 'client_type', displayName: 'Client Type ', width: '15%', enableCellEdit: false },
    { name: 'person_name', displayName: 'Person Name ', width: '20%' },
    { name: 'email', displayName: 'Email', width: '15%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '15%' },
    { name: 'address', displayName: 'Address', width: '15%' },

    {
      name: 'Action', field: 'Action', width: '5%',
      cellTemplate: '<div class="ui-grid-cell-contents "><span><a href="" ng-click="grid.appScope.editCompany(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

  $scope.gridCompany.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };

  var getCompanies = function(){
    CompanyService.getCompanies().then(function (response) {    
      $scope.companyList = response;
    });
  }
  getCompanies();

  $scope.addCompany = function(){
    CompanyService.saveCompany($scope.company).then(function(result){
      if(result.status == 1){
        getCompanies();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if(result.status == 0){
        $scope.comapnyErrors = result.message;
      }
    },function(error){
      toastr.error("somthing went wrong please try again later!");
    });
  }

  $scope.editCompany = function(company){    
    $scope.company = company;
    $mdDialog.show({
      templateUrl: 'views/admin/add-company-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    });
     
  }
  /*
  ======== Companies ends ========
  */
 $scope.cancel = function(){
  $mdDialog.hide();
  };

  /*
  ======== Clients ========
  */
  $scope.showAddClientPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/add-client-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };

  // $scope.gridHoardingCompany = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 25,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };

  // $scope.gridHoardingCompany.columnDefs = [
  //   { name: 'name', displayName: 'Comapny Name', width: '20%', enableCellEdit: false },
  //   { name: 'owner', displayName: 'Owner Name', width: '20%', enableCellEdit: false },
  //   { name: 'email', displayName: 'Email id (editable)', width: '20%' },
  //   { name: 'phone', displayName: 'Phone', type: 'number', width: '20%' },
  //   { name: 'hoardinglist', displayName: 'List fo hoarding', width: '10%' },
  //   {
  //     name: 'Action', field: 'Action', width: '10%',
  //     cellTemplate: '<div class="ui-grid-cell-contents"><span><a href="" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a href="" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a href="" ng-click="grid.appScope.deleteHoardingCompany(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
  //     enableFiltering: false,
  //   }
   
  // ];

  // $scope.gridHoardingCompany.onRegisterApi = function (gridApi) {
  //   $scope.gridApi = gridApi;
  //   gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };

  function getAllClients(){
    CompanyService.getAllClients().then(function (response) {
      $scope.allClients = response;
    });
  }
  getAllClients();

  function getClientTypes(){
		CompanyService.getClientTypes().then(function(result){
			$scope.clientTypes = result;
		});
	}
  getClientTypes();
  
  $scope.addClient = function(){
    CompanyService.saveClient($scope.client).then(function(result){
      if(result.status == 1){
        getAllClients();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if(result.status == 0){
        $scope.addHordingErrors = result.message;
      }
    },function(error){
      toastr.error("somthing went wrong please try again");
    });
  }
  $scope.deleteHoardingCompany = function(row){
    // CompanyService.deleteHoardingCompanies(JSON.parse(localStorage.loggedInUser).id, row).then(function (response) {
    //   if(response == 200){
    //     toastr.success("deleted successpully");
    //   }else{
    //     toastr.error("not completed")
    //   }
    //   getFormatList();
    // });
    // console.log("row deleted");
    // var index = $scope.gridHoardingCompany.data.indexOf(row);
    // $scope.gridHoardingCompany.data.splice(index, 1);
    // toastr.success("HoardingCompanies deleted successfully");
  }
  /*
  ======== Hoarding Companies ========
  */
  // tables code for load more  start
  var vm = $scope;
  vm.limit = 10;
  $scope.loadMore = function() {
    var increamented = vm.limit + 5;
    vm.limit = increamented > $scope.companyList.length ? $scope.companyList.length : increamented;
  };
// tables code end
// tables code for load more  start
  var vm = $scope;
  vm.limit = 10;
  $scope.loadMore = function() {
    var increamented = vm.limit + 5;
    vm.limit = increamented > $scope.hoardingCompanies.length ? $scope.hoardingCompanies.length : increamented;
  };
// tables code end
});
