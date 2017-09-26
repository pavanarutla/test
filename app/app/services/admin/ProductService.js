app.factory('ProductService', ['$http', '$q', 'config',
	function ($http, $q, config) {
		return {
			getProductList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getFormatList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/formats').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			deleteProductList: function(productId){
				var dfd = $q.defer();
				$http.delete(config.apiPath + '/products/' + productId).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			deleteFormatsList: function(formatId){
				var dfd = $q.defer();
				$http.delete(config.apiPath + '/formats/' + formatId).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			}
		}
	}
]);