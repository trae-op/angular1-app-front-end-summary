

(function () {
    'use strict';

    function pagination($log, $routeParams, paginationService, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: '../../../../parts/pagination/pagination.html',
            link: function (scope, element, attrs) {
              
                scope.routeParams = $routeParams;
                var pageNumber = Number(scope.routeParams.pageNumber);

                scope.getHash;

                scope.$watch('prevItems',function (newVal) {

                    if (newVal) {
                        var paginationGroup = paginationService.group(newVal, 5);
                        scope.pagination = paginationGroup;
                        scope.$ctrl.items = paginationGroup[Number(scope.routeParams.pageNumber) - 1];
                    }

                }, true);



            scope.showNumbering = function (index) {
                var a = (pageNumber === (index+3));
                var b = (pageNumber === (index+2));
                var c = (pageNumber === (index + 1));
                var d = (pageNumber === index);
                var e = (pageNumber === (index-1));
                return a || b || c || d || e;
            };

            scope.showDots = function (index) {
                    return pageNumber === (index+4) || pageNumber === (index-2);

            };

              scope.nextPage = function () {
                return Number(scope.routeParams.pageNumber) + 1;
              };

              scope.prevPage = function () {
                return Number(scope.routeParams.pageNumber) - 1;
              };
            }
        };
    }

    angular.module('shared')
        .directive('pagination', pagination);

})();
