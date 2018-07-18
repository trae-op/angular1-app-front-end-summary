
(function () {
    'use strict';

    function pagination ($http, $log, $routeParams) {
      var _this = this;

      var cache;

      _this.group = function(array, count) {
        var stringArray = '';
        var ceil = Math.ceil(array.length/count);
          cache = array;
        for (var i = 0; i < ceil; i = i + 1) {
          stringArray = stringArray + ('[]' + ((ceil-1) !== i ? ',' : ''));
        }
        var groups = JSON.parse('[' + stringArray + ']');
        for (var j = 0; j < groups.length; j = j + 1) {
          groups[j] = array.slice((j * count), ((j * count) + count));
        }
        return groups;
      };

    }

    angular
        .module('shared')
        .service('paginationService', pagination);

})();