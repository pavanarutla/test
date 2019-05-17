app.controller('agencyCampaginsCtrl', function ($scope,$mdDialog) {
    $scope.toggleShareCampaignSidenav = function () {
        // $scope.currentShareCampaign = activeUserCampaign;
        $mdSidenav('shareCampaignSidenav').toggle();
      };
});