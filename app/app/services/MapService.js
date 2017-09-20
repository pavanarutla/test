app.factory('MapService', ['$http', '$q', 'config', function($http, $q, config){
  return {
    markers: function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    saveMarker: function(){
      markerObj = {lat: 61.62182, lng: 20.306683};
      var dfd = $q.defer();
      $http.post(config.apiPath + '/product', markerObj).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getMarkers: function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    shortListProduct: function(productId, userMongoId){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/shortlistProduct', {user_mongo_id: userMongoId, product_id: productId}).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
     getshortListProduct: function(userMongoId){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/shortlistedProducts/' + userMongoId).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
     deleteShortlistedProduct: function(userMongoId, productId){
      var dfd = $q.defer();
      $http.delete(config.apiPath + '/shortlistedProduct/' + productId).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
     filterProducts: function(criteria){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/filterProducts', criteria).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getIndustrySectors: function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/Sectors').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },  
    getDurationSectors:function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/DurationSectors').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    searchBySiteNo : function(siteNo){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/searchBySiteNo/' + siteNo).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    }
  }
}]);