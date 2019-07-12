app.factory('MapService', ['$http', '$q', 'config', function ($http, $q, config) {
  return {
    mapProducts : function() {
      var dfd = $q.defer();
        $http.get(config.apiPath + '/map-products').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
    },
    markers: function () {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    saveMarker: function () {
      markerObj = { lat: 61.62182, lng: 20.306683 };
      var dfd = $q.defer();
      $http.post(config.apiPath + '/product', markerObj).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getMarkers: function () {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    shortListProduct: function (obj) {
      var dfd = $q.defer();
      $http.post(config.apiPath + '/shortlistProduct', obj).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getshortListProduct: function (userMongoId) {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/shortlistedProducts').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    deleteShortlistedProduct: function (shortlistId) {
      var dfd = $q.defer();
      $http.delete(config.apiPath + '/shortlistedProduct/' + shortlistId).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    filterProducts: function (criteria) {
      var dfd = $q.defer();
      $http.post(config.apiPath + '/filterProducts', criteria).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getIndustrySectors: function () {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/Sectors').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getDurationSectors: function () {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/DurationSectors').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    searchBySiteNo: function (siteNo) {
      var dfd = $q.defer();
      $http.get(config.apiPath + '/searchBySiteNo/' + siteNo).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getProductUnavailableDates: function(productId){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/product-unavailable-dates/' + productId).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getProductDigitalUnavailableDates : function(productId){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/digital-product-unavailable-dates', {product_id: productId}).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    }
  }
}]);