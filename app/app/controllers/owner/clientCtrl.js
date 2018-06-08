app.controller('clientCtrl', function ($scope,$mdSidenav) {
    // sidenav 
    $scope.addClient = function () {
        $mdSidenav('addClientList').toggle();
    }
})