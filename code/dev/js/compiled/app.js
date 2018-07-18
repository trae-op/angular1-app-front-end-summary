(function () {
    'use strict';

  authRun.$inject = ["$http", "$log", "$localStorage", "mainAuthorizationService"];
    angular.module('app', [
        'ngRoute',
        'ngSanitize',
        'ngStorage',
        'facebook',
        'google-signin',
        'activation',
        'header',
        'home',
        'front',
        'page',
        'shared'
    ]).run(authRun);


  function authRun($http, $log, $localStorage, mainAuthorizationService) {

    // Dirty check for already loggined user.
    if (mainAuthorizationService.checkAuthorization()) {
      $http.defaults.headers.common.Authorization = $localStorage.Authorization;
    }

  }


})();

(function () {

    'use strict';

    mainRoute.$inject = ["$routeProvider", "FacebookProvider", "GoogleSigninProvider"];
    function mainRoute($routeProvider, FacebookProvider, GoogleSigninProvider) {

        FacebookProvider.init('184315939079210');

        GoogleSigninProvider.init({
            client_id: '292952671581-2auml32hp866cn11v30e5ncvesvp4hi7.apps.googleusercontent.com',
        });

        $routeProvider
            .otherwise({
              redirectTo: '/1'
                //template : "<h1>None</h1><p>Nothing has been selected</p>"
            });
    }

    angular.
        module('app')
            .config(mainRoute);

})();


(function () {
  'use strict';

  angular.module('activation', [
    'ngRoute'
  ]);

})();


(function () {

  'use strict';

  activationUserRouter.$inject = ["$routeProvider"];
  function activationUserRouter($routeProvider) {
    $routeProvider
      .when("/activation/:hash", {
        templateUrl : "parts/activation-user/activation.user.html",
        controller: "activationUserController",
        controllerAs: '$ctrl'
      });
  }

  angular.module('activation')
    .config(activationUserRouter);

})();

(function () {
    'use strict';

    angular.module('front', [
        'ngRoute'
    ]);

})();

(function () {

    'use strict';

    frontRoute.$inject = ["$routeProvider"];
    function frontRoute($routeProvider) {
        $routeProvider
            .when("/resume/:id", {
                templateUrl : "parts/front/front.html",
                controller: "frontController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('front')
        .config(frontRoute);

})();

(function () {
    'use strict';

    angular.module('header', []);

})();

(function () {
    'use strict';

    angular.module('home', [
        'ngRoute'
    ]);

})();

(function () {

    'use strict';

    homeRoute.$inject = ["$routeProvider"];
    function homeRoute($routeProvider) {
        $routeProvider
            .when("/:pageNumber", {
                templateUrl : "parts/home/home.html",
                controller: "homeController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('home')
        .config(homeRoute);

})();

(function () {
    'use strict';

    angular.module('page', [
        'ngRoute'
    ]);

})();

(function () {

    'use strict';

    pageRoute.$inject = ["$routeProvider"];
    function pageRoute($routeProvider) {
        $routeProvider
            .when("/page/:id/:pageName/:pageNumber", {
                templateUrl : "parts/page/page.html",
                controller: "pageController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('page')
        .config(pageRoute);

})();

(function () {
    'use strict';

    angular.module('shared', [
        'ngRoute',
        'ui.bootstrap'
    ]);

})();

(function () {
    'use strict';

    angular.module('users', []);

})();



(function () {
  'use strict';

  activationUserController.$inject = ["$scope", "$log", "$routeParams", "mainHttpService", "$localStorage", "mainAuthorizationService", "headersService"];
  function activationUserController($scope, $log, $routeParams, mainHttpService, $localStorage, mainAuthorizationService, headersService) {
    var $ctrl = this;

    $ctrl.routeParams = $routeParams;

    if ($localStorage.temporaryDataUser) {
      var filledUser = {
        name: $localStorage.temporaryDataUser.name,
        email: $localStorage.temporaryDataUser.email,
        password: $localStorage.temporaryDataUser.password,
        uuid: $localStorage.temporaryDataUser.uuid,
        hash: $ctrl.routeParams.hash
      };

      var filledLogin = {
        email: $localStorage.temporaryDataUser.email,
        password: $localStorage.temporaryDataUser.password,
        rememberMe: true
      };
      mainHttpService.accountActivationUser('activation', filledUser, function (response) {
        $localStorage.temporaryDataUser = false;
        mainHttpService.login('users/login', filledLogin, function (responseLogin) {
          mainHttpService.add('headers', headersService.defaultHeader(getUser().name, getUser().email), function (responseHeaders) {
            $log.info('$localStorage', $localStorage);
            $ctrl.message = 'Your account successfully activated!!!';
          });
        });
      });
    }

    function getUser() {
      return mainAuthorizationService.getUser();
    }

  }

  angular.module('activation')
    .controller('activationUserController', activationUserController);

})();



(function () {
    'use strict';

    frontController.$inject = ["$scope", "$routeParams", "$log", "mainHttpService", "frontService", "popupsService", "mainAuthorizationService"];
    function frontController($scope, $routeParams, $log, mainHttpService, frontService, popupsService, mainAuthorizationService) {
        var $ctrl = this;

        $ctrl.routeParams = $routeParams;

        mainHttpService.getById('headers', $ctrl.routeParams.id, function (response) {
            $ctrl.header = response[0];
        });

        $ctrl.Authorization = function() {
          return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };



        $ctrl.update = function() {
          popupsService.forms({
              title: 'Update',
              fields: [
                {
                    type: 'text',
                    placeholder: 'position',
                    name: 'position',
                    text: $ctrl.header.position,
                    required: true
                },
                {
                    type: 'text',
                    placeholder: 'age',
                    name: 'age',
                    text: $ctrl.header.age,
                    required: true
                }
              ]
          }, function (data) {
            var newData = frontService.filledData(data);
            newData.name = $ctrl.getUser().name;
            newData._id = $ctrl.header._id;
            newData.creator_email = $ctrl.header.creator_email;
            newData.skills = $ctrl.header.skills;
            mainHttpService.update('headers', newData, function(response) {
              $ctrl.header = response;
            });
          });
        };

    }

    angular.module('front')
        .controller('frontController', frontController);

})();


(function () {
    'use strict';

    frontService.$inject = ["$log"];
    function frontService($log) {
      var _this = this;
      
      _this.filledData = function (data) {
        var getProp = function(prop) {
          return _.find(data, {name: prop});
        };

        return {
          position: getProp('position').text,
          age: getProp('age').text
        };
      };

    }

    angular
        .module('front')
        .service('frontService', frontService);

})();




(function () {
    'use strict';

    headerTop.$inject = ["$log", "$uibModal", "$routeParams", "$localStorage", "popupsService", "mainHttpService", "mainAuthorizationService", "headersService"];
    function headerTop($log, $uibModal, $routeParams, $localStorage, popupsService, mainHttpService, mainAuthorizationService, headersService) {
        return {
            restrict: 'EA',
            templateUrl: window.location.origin + window.location.pathname + 'parts/header/header.html',
            link: function (scope, element, attrs) {

                var getProp = function(data, prop) {
                  return _.find(data, {name: prop});
                };

                function facebookLogin(ctrlPopup) {
                  mainAuthorizationService.authFacebook(function (userResponse) {
                    // check if header is existing
                    mainHttpService.getByEmail('headers', userResponse.email, function(responseHeaders) {
                      userResponse.rememberMe = true;
                      mainHttpService.login('users/login', userResponse, function (responseLogin) {
                        // close Popup
                        ctrlPopup.cancel();
                        if (responseHeaders.length <= 0) {
                          mainHttpService.add('headers', headersService.defaultHeader(scope.getUser().name, scope.getUser().email), function (header) {
                            scope.openTopMenu = false;
                            window.location.hash = 'resume/' + header._id;
                          });
                        } else {
                          scope.openTopMenu = false;
                          window.location.hash = 'resume/' + responseHeaders[0]._id;
                        }
                      });
                    });
                  });
                }

                function googleLogin(ctrlPopup) {
                  mainAuthorizationService.authGoogle(function (userResponse) {
                    $log.info('--> userResponse <--\n', userResponse);
                  });
                }

                scope.logout = function () {
                    mainHttpService.logout();
                };

                scope.getUser = function () {
                  return mainAuthorizationService.getUser();
                };

                scope.showTopMenu = function () {
                    if (!scope.openTopMenu) {
                        scope.openTopMenu = true;
                    } else {
                        scope.openTopMenu = false;
                    }
                };

                scope.authorization = function() {
                  return mainAuthorizationService.checkAuthorization();
                };

                scope.open = function () {

                    popupsService.forms({
                        title: 'Log In',
                        fields: [
                            {
                                type: 'email',
                                placeholder: 'email',
                                text: '',
                                name: 'email',
                                required: true
                            },
                            {
                                type: 'password',
                                placeholder: 'password',
                                text: '',
                                name: 'password',
                                required: true
                            },
                            {
                                type: 'checkbox',
                                placeholder: 'Remember me',
                                name: 'rememberMe',
                                checked: false
                            }
                        ],
                        additionalButtons: [
                          {
                            text: 'Connect with Facebook',
                            handler: facebookLogin
                          },
                          {
                            text: 'Connect with Google',
                            handler: googleLogin
                          }
                        ]
                    }, function (data) {

                        var filledData = {
                          email: getProp(data, 'email').text,
                          password: getProp(data, 'password').text,
                          rememberMe: getProp(data, 'rememberMe').checked
                        };

                        mainHttpService.login('users/login', filledData, function (response) {
                            scope.openTopMenu = false;
                        });

                    });
                };

                scope.registration = function () {

                    popupsService.forms({
                        title: 'Registration',
                        fields: [
                            {
                                type: 'text',
                                placeholder: 'name',
                                text: '',
                                name: 'name',
                                required: true
                            },
                            {
                                type: 'email',
                                placeholder: 'email',
                                text: '',
                                name: 'email',
                                required: true
                            },
                            {
                                type: 'password',
                                placeholder: 'password',
                                text: '',
                                name: 'password',
                                required: true
                            },
                            {
                                type: 'password',
                                placeholder: 'confirm password',
                                text: '',
                                name: 'confirm_password',
                                required: true
                            }
                        ]
                    }, function (data) {

                        var filledUser = {
                          name: getProp(data, 'name').text,
                          email: getProp(data, 'email').text,
                          password: getProp(data, 'password').text
                        };

                      mainHttpService.authorization('authorization', filledUser, function () {
                        scope.openTopMenu = false;

                        popupsService.messages('User activation', {
                          data: { message: 'You need to go to your email service and activate account!'}
                        });
                      });

                    });
                };


            }
        };
    }

    angular.module('header')
        .directive('headerTop', headerTop);

})();


(function () {
    'use strict';

    headersService.$inject = ["$http", "$log"];
    function headersService($http, $log) {
        var _this = this;

      _this.defaultHeader = function (name, email) {
          return {
            name: name,
            position: 'Position name',
            age: '<your age>',
            skills: '<need your real skills (for example: css, html etc.)>',
            creator_email: email
          };
      };
        
    }

    angular
        .module('header')
        .service('headersService', headersService);

})();


(function () {
    'use strict';

    homeController.$inject = ["$scope", "$log", "$routeParams", "mainHttpService", "popupsService", "homeService", "mainAuthorizationService", "paginationService"];
    function homeController($scope, $log, $routeParams, mainHttpService, popupsService, homeService, mainAuthorizationService, paginationService) {
        var $ctrl = this;

        // This is necessary for pagination menu because 'hash' can be different
        $scope.getHash = '#';

      $ctrl.items = [];

        // for the correct "reverse"
        mainHttpService.cacheData = {};

        mainHttpService.get('headers', function (response) {
            $ctrl.items = _.reverse(response);
            $scope.prevItems = $ctrl.items;
        });

        $ctrl.Authorization = function() {
            return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.findMe = function() {
          $ctrl.items = [_.find(mainHttpService.cacheData.headers, { 'creator_email': $ctrl.getUser().email })];
          $scope.prevItems = $ctrl.items;
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };
       
    }

    angular.module('home')
        .controller('homeController', homeController);

})();


(function () {
    'use strict';

    homeService.$inject = ["$http", "$log", "$routeParams"];
    function homeService ($http, $log, $routeParams) {
      var _this = this;
    }

    angular
        .module('home')
        .service('homeService', homeService);

})();


(function () {
    'use strict';

    pageController.$inject = ["$scope", "$routeParams", "$log", "mainHttpService", "popupsService", "pageService", "paginationService", "mainAuthorizationService"];
    function pageController($scope, $routeParams, $log, mainHttpService, popupsService, pageService, paginationService, mainAuthorizationService) {
        var $ctrl = this;

        $ctrl.routeParams = $routeParams;

        // This need for pagination menu becowse 'hash' can be diffarent
        $scope.getHash = '#/page/' + $ctrl.routeParams.id + '/' + $ctrl.routeParams.pageName;

        mainHttpService.getById('headers', $ctrl.routeParams.id, function(responseHeader) {
          pageService.creatorEmail = responseHeader[0].creator_email;
          mainHttpService.getByEmail($ctrl.routeParams.pageName, responseHeader[0].creator_email, function(responsePage) {
              $ctrl.items = _.reverse(responsePage);
              $scope.prevItems = $ctrl.items;
          });
        });

        $ctrl.getCreatorEmailByHeader = function() {
          return pageService.creatorEmail;
        };

        $ctrl.Authorization = function() {
          return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };

        $ctrl.add = function() {
          if (!$ctrl.items) {
            $ctrl.items = [];
          }

          popupsService.forms({
              title: $ctrl.routeParams.pageName !== 'abouts' ? 'Add' : 'Create',
              fields: pageService.getFields()
          }, function (data) {
              mainHttpService.add($ctrl.routeParams.pageName, pageService.filledData(data), function(response) {
                  $ctrl.items.unshift(response);
                  $scope.prevItems.unshift(response);
              });
          });
        };

        $ctrl.update = function(currentData, index) {
          popupsService.forms({
              title: 'Update',
              fields: pageService.getFields(currentData)
          }, function (data) {
            var newData = pageService.filledData(data);
            newData._id = currentData._id;
            mainHttpService.update($ctrl.routeParams.pageName, newData, function(response) {
                $ctrl.items[index] = response;
            });
          });
        };

        $ctrl.delete = function(id, index) {
          mainHttpService.deleteById($ctrl.routeParams.pageName, id, function(response) {
              $ctrl.items.splice(index, 1);
              $scope.prevItems.splice(index, 1);
          });
        };

        $ctrl.changeTitle = function () {
          return {
            allSymbols: function() {
              return _.capitalize($ctrl.routeParams.pageName);
            },
            cutLastSymbol: function() {
              return this.allSymbols().substr(0, this.allSymbols().length - 1);
            }
          };
        };

        $ctrl.loadScript = function (item) {
          pageService.loadScript({
            title: 'Load Script',
            data: item
          });
        };
        

    }

    angular.module('page')
        .controller('pageController', pageController);

})();



(function() {
  
  'use strict';

  angular.module('page').directive('bindHtmlWithJs', ['$sce', '$parse', function ($sce, $parse)
    {

        /**
         * It removes script tags from html and inserts it into DOM.
         *
         * Testing:
         * html += '<script>alert(1234)</script><script type="text/javascript">alert(12345)</script><script type="asdf">alert(1234)</script><script src="/js/alert.js">alert(1234)</script><span style="color: red;">1234</span>';
         * or
         * html += '<script src="/js/alert.js"></script><script type="text/javascript">console.log(window.qwerqwerqewr1234)</script><span style="color: red;">1234</span>';
         *
         * @param html {String}
         * @returns {String}
         */
        function handleScripts(html)
        {
          // html must start with tag - it's angularjs' jqLite bug/feature
          html = '<i></i>' + html;

          var originElements = angular.element(html),
            elements = angular.element('<div></div>');

          if (originElements.length)
          {
            // start from 1 for removing first tag we just added
            for (var i = 1, l = originElements.length; i < l; i ++)
            {
              var $el = originElements.eq(i),
                el = $el[0];
              if (el.nodeName == 'SCRIPT' && ((! el.type) || el.type == 'text/javascript')) {
                evalScript($el[0]);
              }
              else {
                elements.append($el);
              }
            }
          }
  //        elements = elements.contents();
          html = elements.html();

          return html;
        }

        /**
         * It's taken from AngularJS' jsonpReq function.
         * It's not ie < 9 compatible.
         * @param {DOMElement} element
         */
        function evalScript(element)
        {
          var script = document.createElement('script'),
            body = document.body,
            doneWrapper = function() {
              script.onload = script.onerror = null;
              body.removeChild(script);
            };

          script.type = 'text/javascript';
          if (element.src)
          {
            script.src = element.src;
            script.async = element.async;
            script.onload = script.onerror = function () {
              doneWrapper();
            };
          }
          else
          {
            // doesn't work on ie...
            try {
              script.appendChild(document.createTextNode(element.innerText));
            }
            // IE has funky script nodes
            catch (e) {
              script.text = element.innerText;
            }

            setTimeout(function () {doneWrapper();}, 10);
          }
          body.appendChild(script);
        }

      return function ($scope, element, attr)
      {
        element.addClass('ng-binding').data('$binding', attr.bindHtmlWithJs);

        var parsed = $parse(attr.bindHtmlWithJs);

        function getStringValue()
        {
          return (parsed($scope) || '').toString();
        }

        $scope.$watch(getStringValue, function bindHtmlWithJsWatchAction(value)
        {
          var html = value ? $sce.getTrustedHtml(parsed($scope)) : '';
          if (html) {
            html = handleScripts(html);
          }
          element.html(html || '');
        });
      };
    }]);

})();


(function() {
  
  'use strict';

  angular.module('page')
    .filter('htmlCode', ["$sce", function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
  }]);
  
})();

(function () {
    'use strict';

    pageService.$inject = ["$http", "$log", "$routeParams", "$uibModal"];
    function pageService ($http, $log, $routeParams, $uibModal) {
        var _this = this;

        _this.creatorEmail = '';

        _this.filledData = function (data) {

          var getProp = function(prop) {
            return _.find(data, {placeholder: prop});
          };

          var projectsAndCompanies = function () {
            return {
              title: getProp('title').text,
              link: getProp('link').text,
              image: getProp('image').text,
              description: getProp('description').text,
              creator_email: _this.creatorEmail
            };
          };
          switch($routeParams.pageName) {
            case 'abouts':
              return {
                description: getProp('description').text,
                creator_email: _this.creatorEmail
              };
            case 'scripts':
              return {
                title: getProp('title').text,
                link: getProp('link').text,
                image: getProp('image').text,
                description: getProp('description').text,
                css: getProp('css').text,
                html: getProp('html').text,
                creator_email: _this.creatorEmail
              };
            case 'projects':
              return projectsAndCompanies();
            case 'companies':
              return projectsAndCompanies();
            default: 
              return {};

          }
        };

        _this.getFields = function (currentData) {
          var checkData = function(prop) {
            return currentData ? currentData[prop] : '';
          };
          var projectsAndCompanies = [
            {
                type: 'text',
                placeholder: 'title',
                text: checkData('title'),
                required: true
            },
            {
                type: 'text',
                placeholder: 'link',
                text: checkData('link'),
                required: true
            },
            {
                type: 'text',
                placeholder: 'image',
                text: checkData('image'),
                required: true
            },
            {
                type: 'textarea',
                placeholder: 'description',
                text: checkData('description'),
                required: true
            }
          ];
          switch($routeParams.pageName) {
            case 'scripts':
              return [
                  {
                      type: 'text',
                      placeholder: 'title',
                      text: checkData('title'),
                      required: true
                  },
                  {
                      type: 'text',
                      placeholder: 'image',
                      text: checkData('image'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'description',
                      text: checkData('description'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'css',
                      text: checkData('css'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'link',
                      text: checkData('link'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'html',
                      text: checkData('html'),
                      required: true
                  }
              ];
            case 'abouts':
              return [
                {
                    type: 'textarea',
                    placeholder: 'description',
                    text: checkData('description'),
                    required: true
                }
              ];
            case 'projects':
              return projectsAndCompanies;
            case 'companies':
              return projectsAndCompanies;
            default:
              return [];
          }
        };


        _this.loadScript = function (data) {
          var modal = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'parts/load-script/load.script.html',
            controller: ["$uibModalInstance", "items", function($uibModalInstance, items) {
                var $ctrl = this;
                $ctrl.title = items.title;
                $ctrl.script = {
                  css: items.data.css,
                  html: items.data.html,
                  js: items.data.link
                };

                $ctrl.close = function () {
                    $uibModalInstance.dismiss('close');
                };
            }],
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                items: function () {
                    return data;
                }
            }
          });
        };


    }

    angular
        .module('page')
        .service('pageService', pageService);

})();

(function () {
    'use strict';

    mainAuthorizationService.$inject = ["$http", "$log", "$localStorage", "Facebook", "GoogleSignin"];
    function mainAuthorizationService($http, $log, $localStorage, Facebook, GoogleSignin) {
      var _this = this;

      _this.firstOnlyLocalStorage = {
        Authorization: undefined,
        user: undefined
      };

      _this.checkRememberMe = function(rememberMe) {
        $localStorage.checkRememberMe = rememberMe;
      };
      _this.checkAuthorization = function() {
        var checkRememberMe = (!$localStorage.checkRememberMe);
        var authFirstOnly = _this.firstOnlyLocalStorage.Authorization;
        var auth = $localStorage.Authorization;
        var checkLocalStorage = checkRememberMe ? authFirstOnly : auth;
        return checkLocalStorage ? true : false;
      };

      _this.addAuthHeaderForAPI = function(token) {
        $localStorage.Authorization = 'Bearer ' + token;
        _this.firstOnlyLocalStorage.Authorization = 'Bearer ' + token;
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
        $http.defaults.headers.common['Content-Type'] = 'application/json';
      };

      _this.clearAuthHeaderForAPI = function() {
          $localStorage.Authorization = undefined;
          _this.firstOnlyLocalStorage.Authorization = undefined;
          delete $http.defaults.headers.common.Authorization;
      };

      _this.setToken = function(token) {
        if (!token) {
          return;
        }
        $localStorage.Authorization = token;
        _this.firstOnlyLocalStorage.Authorization = token;
      };

      _this.clearUserMyself = function() {
        _this.firstOnlyLocalStorage.user = undefined;
        $localStorage.user = undefined;
      };

      _this.getUser = function() {
         return !$localStorage.checkRememberMe ? _this.firstOnlyLocalStorage.user : $localStorage.user;
      };

      _this.setUserMyself = function(user) {
        delete user.password;
        $localStorage.user = user;
        _this.firstOnlyLocalStorage.user = user;
      };

      _this.authFacebook = function (cb) {
        Facebook.login(function(loginResponse) {
          if (loginResponse.status == 'connected') {
            // For "email, name" fields access is allowed
            Facebook.api('/me', { fields: 'email, name' }, cb);
          } else {
            $log.info('Facebook. User cancelled login or did not fully authorize.');
          }
        }, {scope: 'email'});
      };


      _this.authGoogle = function (cb) {
        GoogleSignin.signIn().then(cb, function (err) {
          $log.info('Google. User cancelled login or did not fully authorize.', err);
        });
      };

    }

    angular
        .module('shared')
        .service('mainAuthorizationService', mainAuthorizationService);

})();


(function () {
    'use strict';

    mainHttpService.$inject = ["$http", "$log", "$localStorage", "popupsService", "mainAuthorizationService"];
    function mainHttpService($http, $log, $localStorage, popupsService, mainAuthorizationService) {
      var _this = this;
      var cacheDataFirstOnly = false;
      _this.cacheData = {};

      _this.get = function (nameRequest, successCallback) {
        if (!_this.cacheData[nameRequest]) {
          mainRequest('get', [mainUrl() + nameRequest], function (response) {
            _this.cacheData[nameRequest] = response.data;
            successCallback(response.data);
          });       
        } else {
          successCallback(_this.cacheData[nameRequest]);
        } 
      };

      _this.add = function (nameRequest, data, successCallback) {
          mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
            if (nameRequest !== 'users' && _this.cacheData[nameRequest]) {
              _this.cacheData[nameRequest].push(response.data);
            }
            successCallback(response.data);
          });     
      };


      _this.authorization = function (nameRequest, data, successCallback) {
        $localStorage.temporaryDataUser = false;
        mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
          $log.info(response);
          $localStorage.temporaryDataUser = response.data;
          successCallback(response.data);
        });
      };

      _this.accountActivationUser = function (nameRequest, data, successCallback) {
        mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
          successCallback(response.data);
        });
      };

      _this.login = function (nameRequest, data, successCallback) { 

          if (cacheDataFirstOnly) {
            _this.cacheData = cacheDataFirstOnly;
          }

          mainAuthorizationService.checkRememberMe(data.rememberMe);
          delete data.rememberMe;

          mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
            mainAuthorizationService.setToken(response.data.token);
            mainAuthorizationService.addAuthHeaderForAPI(response.data.token);
            mainAuthorizationService.setUserMyself(response.data.user);
            successCallback(response);
          });     
      };

      _this.logout = function () {
        cacheDataFirstOnly = _this.cacheData;
        _this.cacheData = {};
        mainAuthorizationService.clearUserMyself();
        mainAuthorizationService.setToken();
        mainAuthorizationService.clearAuthHeaderForAPI();
        window.location.hash = '/';
      };

      _this.update = function (nameRequest, data, successCallback) {    
        //$log.info('_this.cacheData', _this.cacheData)
        mainRequest('put', [mainUrl() + nameRequest, data], function (response) {
          //$log.info('response',_this.cacheData[nameRequest]);
          _this.cacheData[nameRequest][cacheIndex(nameRequest, { _id: response.data._id })] = response.data;
          successCallback(response.data);
        });  
      };

      _this.deleteById = function (nameRequest, id, successCallback) {
        mainRequest('delete', [mainUrl() + nameRequest + '/' + id], function (response) {
          _this.cacheData[nameRequest].splice(cacheIndex(nameRequest, { _id: id }), 1);
          successCallback(response.data);
        });  
      };

      _this.getById = function (nameRequest, id, successCallback) {
        _this.get(nameRequest, function (response) {
          successCallback(findByValue(id, '_id', response));
        });
      };

      _this.getByEmail = function (nameRequest, email, successCallback) {
        _this.get(nameRequest, function (response) {
          successCallback(findByValue(email, 'creator_email', response));
        });        
      };

      function cacheIndex(name, data) {
        return _.findIndex(_this.cacheData[name], data);
      }     

      function findByValue(value, prop, collection) {
        return _.filter(collection, JSON.parse('{"' + prop + '":"' + value + '"}'));
      }

      function mainUrl () {
        return window.API_URL + '/';
      }

      function mainRequest(typeRequest, options, successCallback) {
        $http[typeRequest].apply(this, options).then(successCallback).catch(errorCallback);
      }      

      function errorCallback(error) {
          if (error.data) {
              popupsService.messages('error', error.data.message ? error : {
                data: { message: 'status: ' + error.data.statusCode + ', message: ' + error.data.error }
              });
          } else {
              popupsService.messages('error', {data: {message: 'status: ' + error.status}});
          }
      }
    }

    angular
        .module('shared')
        .service('mainHttpService', mainHttpService);

})();



(function () {
    'use strict';

    pagination.$inject = ["$log", "$routeParams", "paginationService", "$timeout"];
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


(function () {
    'use strict';

    pagination.$inject = ["$http", "$log", "$routeParams"];
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

(function () {
    'use strict';

    popupsService.$inject = ["$uibModal", "$log"];
    function popupsService($uibModal, $log) {

        this.forms = function (data, callback) {
            var modal = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'parts/popups/form.html',
                controller: ["$uibModalInstance", "items", function($uibModalInstance, items) {
                    var $ctrl = this;
                    var fields = {};
                    $ctrl.title = items.title;
                    $ctrl.fields = items.fields;
                    $ctrl.additionalButtons = items.additionalButtons;

                    $ctrl.validationCustom = function(form) {
                      var result = true;
                      fields.filled = true;
                      for (var i = 0; i <  $ctrl.fields.length; i = i + 1) {
                        var field = $ctrl.fields[i];
                        fields[field.name] = field.text;
                      }
                      if (fields.confirm_password) {
                        if (fields.password === fields.confirm_password && form.$valid) {
                          result = false;
                        }
                      } else {
                        result = !form.$valid;
                      }
                      return result;
                    };                    

                    $ctrl.send = function (fieldsFilled) {
                        $uibModalInstance.close(fieldsFilled);
                    };

                    $ctrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }],
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });

            modal.result.then(function (selectedItem) {
                callback(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.messages = function (type, data) {
          var modal = $uibModal.open({
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'parts/popups/messages.html',
              controller: ["$uibModalInstance", "options", function($uibModalInstance, options) {
                  var $ctrl = this;
                  
                  $ctrl.title = _.capitalize(type);
                  $ctrl.data = options.data.message;
                  $ctrl.classes = type;

                  $ctrl.close = function () {
                      $uibModalInstance.dismiss('cancel');
                  };
              }],
              controllerAs: '$ctrl',
              size: 'md',
              resolve: {
                  options: function () {
                      return data;
                  }
              }
          });
        };

    }

    angular
        .module('shared')
        .service('popupsService', popupsService);

})();

(function () {
    'use strict';

    usersService.$inject = ["$log"];
    function usersService($log) {

    }

    angular
        .module('users')
        .service('usersService', usersService);

})();