app.factory('ProductService', ['$http', '$q', 'config',
	function ($http, $q, config) {
		return {
			getProductList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getProductForPage: function(pageNo){
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products/' + pageNo).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getFormatList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/formats').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			deleteProduct: function(productId){
				var dfd = $q.defer();
				$http.delete(config.apiPath + '/product/' + productId).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			deleteFormat: function(formatId){
				var dfd = $q.defer();
				$http.delete(config.apiPath + '/format/' + formatId).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getTypeList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/bbtypes').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			saveTypes: function (obj) {
				var dfd = $q.defer();
				$http.post(config.apiPath + '/bbtype',obj).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			ProductsOfOwner: function (pageNo) {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products-of-owner/'+pageNo).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			productsByStatus: function (status) {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products-by-status/'+ status).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			searchProducts: function (word) {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/search-products/'+word).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			}
		}
	}
]);