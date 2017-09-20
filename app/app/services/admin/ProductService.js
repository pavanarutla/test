app.factory('ProductService', ['$http', '$q', 'config',
	function ($http, $q, config) {
		return {
			getHoardingList: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/hoardingList').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			},
			getFormates: function () {
				var dfd = $q.defer();
				$http.get(config.apiPath + '/formatesList').success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
			}
		}
	}]
);