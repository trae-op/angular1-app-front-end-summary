
(function () {
  'use strict';

  function mainOtherService($http, $log) {
    var _this = this;

    _this.loader = {
      activateLoader: false,
      show: function () {
        _this.loader.activateLoader = true;
      },
      hide: function () {
        _this.loader.activateLoader = false;
      }
    };

  }

  angular
    .module('shared')
    .service('mainOtherService', mainOtherService);

})();
