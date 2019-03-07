app.service('AdminCampaignService',
        ['$http', '$q', 'config',
            function ($http, $q, config) {
                return {
                    getAllCampaigns: function () {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/get-all-campaigns').success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getAllCampaignRequests: function () {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/all-campaign-requests').success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    changeProductPrice: function (data) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/change-product-price', data).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getProposedCampaigns: function () {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/all-campaigns/planning').success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getPlannedCampaigns: function () {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/all-campaigns/planned').success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    saveUserCampaign: function (campaign) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/user-campaign', campaign).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    sendSuggestionRequest: function (suggestionRequest) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/suggestion-request', suggestionRequest).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    deleteUserCampaign: function (campaignId) {
                        var dfd = $q.defer();
                        $http.delete(config.apiPath + '/campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    deleteNonUserCampaign: function (campaignId) {
                        var dfd = $q.defer();
                        $http.delete(config.apiPath + '/non-user-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    proposeProductForCampaign: function (obj) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/propose-product-for-campaign', obj).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    deleteProductFromCampaign: function (campaignId, productId) {
                        var dfd = $q.defer();
                        $http.delete(config.apiPath + '/campaign/' + campaignId + '/product/' + productId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getCampaignWithProducts: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/user-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    updateProposedProduct: function (campaignId, obj) {
                        var dfd = $q.defer();
                        $http.put(config.apiPath + '/proposed-product-for-campaign/' + campaignId, obj).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    launchCampaign: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/launch-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    finalizeCampaignByAdmin: function (campaignId, flag, GST) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/quote-campaign/' + campaignId + flag + GST).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    confirmCampaignBooking: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/confirm-campaign-booking/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getCampaignPaymentDetails: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/campaign-payments/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    updateCampaignPayment: function (obj) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/campaign-payment', obj).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    closeCampaign: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/close-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    searchCampaigns: function (searchTerm) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/search-campaigns/' + searchTerm).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    saveCampaignByAdmin: function (campaign) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/non-user-campaign', campaign).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getSuggestionRequestDetails: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/campaign-suggestion-request-details/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getChangeRequestHistory: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/quote-change-request-history/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    updateMetroCampaignStatus: function (obj) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/update-metro-campaigns-status', obj).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    notifyProductOwnersForQuote: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/notify-product-owners-for-quote/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    launchMetroCampaign: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/launch-metro-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getCampaignsFromProducts: function (productId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/campaigns-from-products/' + productId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getProductUnavailableDates: function (productId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/product-unavailable-dates/' + productId).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getApprovedProductList: function (data) {
                        var dfd = $q.defer();
                        $http.post(config.apiPath + '/approved-owner-products', data).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    getFormatList: function (obj = null) {
                        var filterData = obj != null ? "?type=" + obj.type : "?type=ooh";
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/formats' + filterData).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    },
                    downloadQuote: function (campaignId) {
                        var dfd = $q.defer();
                        $http.get(config.apiPath + '/download-quote/' + campaignId, {responseType: 'arraybuffer'}).success(dfd.resolve).error(dfd.reject);
                        return dfd.promise;
                    }
                }
            }
        ]
        );
