



(function () {
    'use strict';

    function headerTop($log, $uibModal, $routeParams, $localStorage, popupsService, mainHttpService, mainAuthorizationService, headersService) {
        return {
            restrict: 'EA',
            templateUrl: window.ORIGIN_PATH + 'parts/header/header.html',
            link: function (scope, element, attrs) {

                var getProp = function(data, prop) {
                  return _.find(data, {name: prop});
                };

              scope.originPath = function () {
                return window.ORIGIN_PATH;
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
