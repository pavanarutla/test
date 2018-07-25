app.factory('ProductService', ['$http', '$q', 'config',
	function ($http, $q, config) {
		return {
			getProductList: function (pageNo, pageSize) {
				var pageData = "";
				if(pageNo && pageSize){
					var pageData = "?page_no=" + pageNo + "&page_size=" + pageSize;
				}
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products' + pageData).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getSearchProductList: function (pageNo, pageSize, search) {
				var pageData = "";
				if(pageNo && pageSize){
					var pageData = "?page_no=" + pageNo + "&page_size=" + pageSize;
				}
				if(search){
					pageData += "&searchkey=" + search;
				}
				var dfd = $q.defer();
				$http.get(config.apiPath + '/search-products' + pageData).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getProductForPage: function(pageNo){
				var dfd = $q.defer();
				$http.get(config.apiPath + '/products/' + pageNo).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getFormatList: function (obj = null) {
				var filterData = obj != null ? "?type=" + obj.type : "?type=ooh";
				var dfd = $q.defer();
				$http.get(config.apiPath + '/formats' + filterData).success(dfd.resolve).error(dfd.reject);
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
			searchProducts: function(word){
				var dfd = $q.defer();
				$http.get(config.apiPath + '/search-products/' + word).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getRequestedHoardings: function(pageNo, pageSize){
				var pageData = "";
				if(pageNo && pageSize){
					var pageData = "?page_no=" + pageNo + "&page_size=" + pageSize;
				}
				var dfd = $q.defer();
				$http.get(config.apiPath + '/requested-hoardings' + pageData).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getMetroPackages: function(){
				var dfd = $q.defer();
				$http.get(config.apiPath + '/metro-packages').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			}
		}
	}
]);