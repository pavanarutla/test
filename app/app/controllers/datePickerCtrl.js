'use strict';
trinetApp
    .controller(
        'datePickerCtrl',
        function ($scope, $filter, sharedProperties, $rootScope,gso) {
            // disabling the today's date.  like min-date=todaysDate
            var d = new Date();
            d.setDate(d.getDate() + 1);
            $scope.todaysDate = new Date(d);
            $scope.currentDate = new Date();
            $scope.endDate = new Date(gso.getUtilService().getThirtyDates($scope.currentDate));
            // display only next 60 day from current date.
            var nextMonth = new Date().setDate(new Date().getDate() + 59);
            $scope.nextMonthValue = new Date(nextMonth);

            // display only past 30 day from current date.
            var pastMonth = new Date().setDate(new Date().getDate() - 29);
            $scope.pastMonthValue = new Date(pastMonth);

            $scope.today = function () {
                $scope.effectiveDate = new Date();
                $scope.minDate = new Date();
            };

            $scope.clear = function () {
                $scope.effectiveDate = null;
            };


            $scope.disabled = function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date
                    .getDay() === 6));
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.toggleMax = function () {
                $scope.maxDate = $scope.maxDate ? null : new Date();
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMax();
            $scope.datepicker = {
                startDate: false,
                endDate: false
            };
            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.dateRange = function ($event, which) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datepicker[which] = true;

            };
            $scope.formats = ['MM/dd/yyyy', 'dd-MMMM-yyyy',
                'yyyy/MM/dd', 'yyyy-MM-dd', 'dd.MM.yyyy',
                'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.earnignformat = $scope.formats[3];

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 2);
            $scope.events = [{
                date: tomorrow,
                status: 'full'
            }, {
                date: afterTomorrow,
                status: 'partially'
            }];

            $scope.getDayClass = function (date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date)
                        .setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date)
                            .setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            };
            $scope.selectedValueIs = function () {
                $scope.effectiveDate = null;
                $scope.effectiveSecDate = null;
            };
            $rootScope.runCustStmt = function () {
                $scope.chooseOption = {name: 'Date Range', value: 'date'};

            };
            $scope.checkErrorClass = function (name) {
                var ele = angular.element(name);
                return ele.hasClass('error-warning') || ele.parent().hasClass('error-warning') ? true : false;
            };

            // Error Message only above 60 day from current date.
            $scope.checkDateSixtyDates = function(date, currentDateParam){
                var nextMonth = currentDateParam ? new Date(currentDateParam).setMonth(new Date(currentDateParam).getMonth() + 2): new Date().setMonth(new Date().getMonth()+2);
                 if(date > new Date(nextMonth)){
                     return true;
                 }
                return false;
            };
            // Error Message only below past 30 day from current date.
            $scope.checkDateThirtyDates = function(date, currentDateParam){
                 var pastMonth = currentDateParam ? new Date(currentDateParam).setMonth(new Date(currentDateParam).getMonth() - 1) : new Date().setMonth(new Date().getMonth() - 1);
                 if(date < new Date(pastMonth)){
                     return true;
                 }
                  return false;
              };
        });
