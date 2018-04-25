app.service("uploadService", function($http, $q ,config) {

    return {
      updateUserData: updateUserData
    };

    function updateUserData(obj) {
      var dfd = $q.defer();
      $http({
        method: 'POST',
        url: config.apiPath + '/update-owner', // /api/upload
        headers: {'Content-Type': undefined,'Process-Data': false},
        data: obj,
        transformRequest: function(data, headersGetter) {
          var formData = new FormData();
          angular.forEach(data, function(value, key) {
            formData.append(key, value);
          });

          //var headers = headersGetter();
          //delete headers['Content-Type'];

          return formData;
        }
      }).then(dfd.resolve, dfd.reject);

      return dfd.promise;

    } // End upload function

  });