app.service('AdminUserService', 
['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getUsers: function(pageNo, pageSize){
        var pageData = "";
				if(pageNo && pageSize){
					var pageData = "?page_no=" + pageNo + "&page_size=" + pageSize;
				}
        var dfd = $q.defer();
        $http.get(config.apiPath + '/users' + pageData).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAgencies: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/agencies').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }, 
      saveUser: function(user){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/userByAdmin', user).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveAgency: function(agency){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/agencyByAdmin', agency).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      toggleActivationUser: function(userMID){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/switch-activation-user/' + userMID).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      deleteUser: function(userMID){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/delete-user/' + userMID).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }
    }
}]);