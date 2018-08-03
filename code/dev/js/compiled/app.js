!function(){"use strict";function e(e,t,r,a){a.checkAuthorization()&&(e.defaults.headers.common.Authorization=r.Authorization)}e.$inject=["$http","$log","$localStorage","mainAuthorizationService"],angular.module("app",["ngRoute","ngSanitize","ui.select","ngStorage","facebook","google-signin","activation","header","home","front","page","shared"]).run(e)}(),function(){"use strict";function e(e,t,r){t.init("184315939079210"),r.init({client_id:"607355219083-p7ven3qhii2kijmd1utei3h260ph8dk7.apps.googleusercontent.com"}),e.otherwise({redirectTo:"/1"})}e.$inject=["$routeProvider","FacebookProvider","GoogleSigninProvider"],angular.module("app").config(e)}(),function(){"use strict";angular.module("activation",["ngRoute"])}(),function(){"use strict";function e(e){e.when("/account_activation",{templateUrl:"parts/activation-user/activation.user.html",controller:"activationUserController",controllerAs:"$ctrl"})}e.$inject=["$routeProvider"],angular.module("activation").config(e)}(),function(){"use strict";angular.module("front",["ngRoute"])}(),function(){"use strict";function e(e){e.when("/resume/:id",{templateUrl:"parts/front/front.html",controller:"frontController",controllerAs:"$ctrl"})}e.$inject=["$routeProvider"],angular.module("front").config(e)}(),function(){"use strict";angular.module("header",[])}(),function(){"use strict";angular.module("home",["ngRoute"])}(),function(){"use strict";function e(e){e.when("/:pageNumber",{templateUrl:"parts/home/home.html",controller:"homeController",controllerAs:"$ctrl"})}e.$inject=["$routeProvider"],angular.module("home").config(e)}(),function(){"use strict";angular.module("page",["ngRoute"])}(),function(){"use strict";function e(e){e.when("/page/:id/:pageName/:pageNumber",{templateUrl:"parts/page/page.html",controller:"pageController",controllerAs:"$ctrl"})}e.$inject=["$routeProvider"],angular.module("page").config(e)}(),function(){"use strict";angular.module("shared",["ngRoute","ui.bootstrap"])}(),function(){"use strict";angular.module("users",[])}(),function(){"use strict";function e(e,t,r,a,n,i,o){function c(){return i.getUser()}var s=this;if(n.temporaryDataUser){var u={name:n.temporaryDataUser.name,email:n.temporaryDataUser.email,password:n.temporaryDataUser.password,uuid:n.temporaryDataUser.uuid,hash:n.temporaryDataUser.hash},l={email:n.temporaryDataUser.email,password:n.temporaryDataUser.password,rememberMe:!0};a.accountActivationUser("activation",u,function(e){n.temporaryDataUser=!1,a.login("users/login",l,function(e){a.add("headers",o.defaultHeader(c().name,c().email),function(e){t.info("$localStorage",n),s.message="Your account successfully activated!!!"})})})}}e.$inject=["$scope","$log","$routeParams","mainHttpService","$localStorage","mainAuthorizationService","headersService"],angular.module("activation").controller("activationUserController",e)}(),function(){"use strict";function e(e,t,r,a,n,i,o,c){var s=this;s.routeParams=t,a.getById("headers",s.routeParams.id,function(e){s.header=e[0]}),s.Authorization=function(){return o.checkAuthorization()},s.getUser=function(){return o.getUser()},s.loaderCheck=function(){return c.loader.activateLoader},s.update=function(){i.forms({title:"Update",fields:[{type:"text",placeholder:"position",name:"position",text:s.header.position,required:!0},{type:"text",placeholder:"age",name:"age",text:s.header.age,required:!0},{type:"multiple-selection",placeholder:"Select skill...",name:"multiple_selection",text:s.header.skills,availableSkills:["JavaScript","Css","Html5","Node.js","Angular","Es6","TypeScript","MongoDB","Hapi.js"],required:!0}]},function(e){var t=n.filledData(e);t.name=s.getUser().name,t._id=s.header._id,t.creator_email=s.header.creator_email,a.update("headers",t,function(e){s.header=e})})}}e.$inject=["$scope","$routeParams","$log","mainHttpService","frontService","popupsService","mainAuthorizationService","mainOtherService"],angular.module("front").controller("frontController",e)}(),function(){"use strict";function e(e){var t=this;t.filledData=function(e){var t=function(t){return _.find(e,{name:t})};return{position:t("position").text,age:t("age").text,skills:t("multiple_selection").text}}}e.$inject=["$log"],angular.module("front").service("frontService",e)}(),function(){"use strict";function e(e,t,r,a,n,i,o,c){return{restrict:"EA",templateUrl:window.ORIGIN_PATH+"parts/header/header.html",link:function(e,t,r){function a(t,r){i.getByEmail("headers",t.email,function(a){t.rememberMe=!0,i.login("users/login",t,function(t){r.cancel(),a.length<=0?i.add("headers",c.defaultHeader(e.getUser().name,e.getUser().email),function(t){e.openTopMenu=!1,window.location.hash="resume/"+t._id}):(e.openTopMenu=!1,window.location.hash="resume/"+a[0]._id)})})}function s(e){o.authFacebook(function(t){a(t,e)})}function u(e){o.authGoogle(function(t){a({name:t.w3.ig,email:t.w3.U3},e)})}var l=function(e,t){return _.find(e,{name:t})};e.originPath=function(){return window.ORIGIN_PATH},e.logout=function(){i.logout()},e.getUser=function(){return o.getUser()},e.showTopMenu=function(){e.openTopMenu?e.openTopMenu=!1:e.openTopMenu=!0},e.authorization=function(){return o.checkAuthorization()},e.open=function(){n.forms({title:"Log In",fields:[{type:"email",placeholder:"email",text:"",name:"email",required:!0},{type:"password",placeholder:"password",text:"",name:"password",required:!0},{type:"checkbox",placeholder:"Remember me",name:"rememberMe",checked:!1}],additionalButtons:[{text:"Facebook",handler:s},{text:"Google",handler:u}]},function(t){var r={email:l(t,"email").text,password:l(t,"password").text,rememberMe:l(t,"rememberMe").checked};i.login("users/login",r,function(t){e.openTopMenu=!1})})},e.registration=function(){n.forms({title:"Registration",fields:[{type:"text",placeholder:"name",text:"",name:"name",required:!0},{type:"email",placeholder:"email",text:"",name:"email",required:!0},{type:"password",placeholder:"password",text:"",name:"password",required:!0},{type:"password",placeholder:"confirm password",text:"",name:"confirm_password",required:!0}]},function(t){var r={name:l(t,"name").text,email:l(t,"email").text,password:l(t,"password").text},a={email:l(t,"email").text,password:l(t,"password").text,rememberMe:!0};i.add("users",r,function(t){i.login("users/login",a,function(t){i.add("headers",c.defaultHeader(r.name,r.email),function(t){e.openTopMenu=!1,window.location.hash="resume/"+t._id})})})})}}}}e.$inject=["$log","$uibModal","$routeParams","$localStorage","popupsService","mainHttpService","mainAuthorizationService","headersService"],angular.module("header").directive("headerTop",e)}(),function(){"use strict";function e(e,t){var r=this;r.defaultHeader=function(e,t){return{name:e,position:"<Your position>",age:"<Your age>",skills:"<Need your real skills (for example: css, html etc.)>",creator_email:t}}}e.$inject=["$http","$log"],angular.module("header").service("headersService",e)}(),function(){"use strict";function e(e,t,r,a,n,i,o,c){var s=this;e.getHash="#",s.items=[],a.cacheData={},a.get("headers",function(t){s.items=_.reverse(t),e.prevItems=s.items}),s.loaderCheck=function(){return c.loader.activateLoader},s.Authorization=function(){return o.checkAuthorization()},s.findMe=function(){s.items=[_.find(a.cacheData.headers,{creator_email:s.getUser().email})],e.prevItems=s.items},s.getUser=function(){return o.getUser()},s.availableSkills=["JavaScript","Css","Html5","Node.js","Angular","Es6","TypeScript","MongoDB","Hapi.js",""],s.skillsSelected=[],s.disabled=!1}e.$inject=["$scope","$log","$routeParams","mainHttpService","popupsService","homeService","mainAuthorizationService","mainOtherService"],angular.module("home").controller("homeController",e)}(),function(){"use strict";function e(e,t,r){}e.$inject=["$http","$log","$routeParams"],angular.module("home").service("homeService",e)}(),function(){"use strict";function e(e,t,r,a,n,i,o,c,s){var u=this;u.routeParams=t,e.getHash="#/page/"+u.routeParams.id+"/"+u.routeParams.pageName,a.getById("headers",u.routeParams.id,function(t){i.creatorEmail=t[0].creator_email,a.getByEmail(u.routeParams.pageName,t[0].creator_email,function(t){u.items=_.reverse(t),e.prevItems=u.items})}),u.loaderCheck=function(){return s.loader.activateLoader},u.getCreatorEmailByHeader=function(){return i.creatorEmail},u.Authorization=function(){return c.checkAuthorization()},u.getUser=function(){return c.getUser()},u.add=function(){u.items||(u.items=[]),n.forms({title:"abouts"!==u.routeParams.pageName?"Add":"Create",fields:i.getFields()},function(t){a.add(u.routeParams.pageName,i.filledData(t),function(t){u.items.unshift(t),e.prevItems.unshift(t)})})},u.update=function(e,t){n.forms({title:"Update",fields:i.getFields(e)},function(r){var n=i.filledData(r);n._id=e._id,a.update(u.routeParams.pageName,n,function(e){u.items[t]=e})})},u["delete"]=function(t,r){a.deleteById(u.routeParams.pageName,t,function(t){u.items.splice(r,1),e.prevItems.splice(r,1)})},u.changeTitle=function(){return{allSymbols:function(){return _.capitalize(u.routeParams.pageName)},cutLastSymbol:function(){return this.allSymbols().substr(0,this.allSymbols().length-1)}}},u.loadScript=function(e){i.loadScript({title:"Load Script",data:e})}}e.$inject=["$scope","$routeParams","$log","mainHttpService","popupsService","pageService","paginationService","mainAuthorizationService","mainOtherService"],angular.module("page").controller("pageController",e)}(),function(){"use strict";angular.module("page").directive("bindHtmlWithJs",["$sce","$parse",function(e,t){function r(e){e="<i></i>"+e;var t=angular.element(e),r=angular.element("<div></div>");if(t.length)for(var n=1,i=t.length;n<i;n++){var o=t.eq(n),c=o[0];"SCRIPT"!=c.nodeName||c.type&&"text/javascript"!=c.type?r.append(o):a(o[0])}return e=r.html()}function a(e){var t=document.createElement("script"),r=document.body,a=function(){t.onload=t.onerror=null,r.removeChild(t)};if(t.type="text/javascript",e.src)t.src=e.src,t.async=e.async,t.onload=t.onerror=function(){a()};else{try{t.appendChild(document.createTextNode(e.innerText))}catch(n){t.text=e.innerText}setTimeout(function(){a()},10)}r.appendChild(t)}return function(a,n,i){function o(){return(c(a)||"").toString()}n.addClass("ng-binding").data("$binding",i.bindHtmlWithJs);var c=t(i.bindHtmlWithJs);a.$watch(o,function(t){var i=t?e.getTrustedHtml(c(a)):"";i&&(i=r(i)),n.html(i||"")})}}])}(),function(){"use strict";angular.module("page").filter("htmlCode",["$sce",function(e){return function(t){return e.trustAsHtml(t)}}])}(),function(){"use strict";function e(e,t,r,a){var n=this;n.creatorEmail="",n.filledData=function(e){var t=function(t){return _.find(e,{placeholder:t})},a=function(){return{title:t("title").text,link:t("link").text,description:t("description").text,creator_email:n.creatorEmail}};switch(r.pageName){case"abouts":return{description:t("description").text,creator_email:n.creatorEmail};case"scripts":return{title:t("title").text,link:t("link").text,description:t("description").text,css:t("css").text,html:t("html").text,creator_email:n.creatorEmail};case"projects":return a();case"companies":return a();default:return{}}},n.getFields=function(e){var t=function(t){return e?e[t]:""},a=[{type:"text",placeholder:"title",text:t("title"),required:!0},{type:"text",placeholder:"link",text:t("link"),required:!0},{type:"textarea",placeholder:"description",text:t("description"),required:!0}];switch(r.pageName){case"scripts":return[{type:"text",placeholder:"title",text:t("title"),required:!0},{type:"textarea",placeholder:"description",text:t("description"),required:!0},{type:"textarea",placeholder:"css",text:t("css"),required:!0},{type:"textarea",placeholder:"link",text:t("link"),required:!0},{type:"textarea",placeholder:"html",text:t("html"),required:!0}];case"abouts":return[{type:"textarea",placeholder:"description",text:t("description"),required:!0}];case"projects":return a;case"companies":return a;default:return[]}},n.loadScript=function(e){a.open({ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"parts/load-script/load.script.html",controller:["$uibModalInstance","items",function(e,t){var r=this;r.title=t.title,r.script={css:t.data.css,html:t.data.html,js:t.data.link},r.close=function(){e.dismiss("close")}}],controllerAs:"$ctrl",size:"md",resolve:{items:function(){return e}}})}}e.$inject=["$http","$log","$routeParams","$uibModal"],angular.module("page").service("pageService",e)}(),function(){"use strict";function e(e,t,r,a,n){var i=this;i.firstOnlyLocalStorage={Authorization:void 0,user:void 0},i.checkRememberMe=function(e){r.checkRememberMe=e},i.checkAuthorization=function(){var e=!r.checkRememberMe,t=i.firstOnlyLocalStorage.Authorization,a=r.Authorization,n=e?t:a;return!!n},i.addAuthHeaderForAPI=function(t){r.Authorization="Bearer "+t,i.firstOnlyLocalStorage.Authorization="Bearer "+t,e.defaults.headers.common.Authorization="Bearer "+t,e.defaults.headers.common["Content-Type"]="application/json"},i.clearAuthHeaderForAPI=function(){r.Authorization=void 0,i.firstOnlyLocalStorage.Authorization=void 0,delete e.defaults.headers.common.Authorization},i.setToken=function(e){e&&(r.Authorization=e,i.firstOnlyLocalStorage.Authorization=e)},i.clearUserMyself=function(){i.firstOnlyLocalStorage.user=void 0,r.user=void 0},i.getUser=function(){return r.checkRememberMe?r.user:i.firstOnlyLocalStorage.user},i.setUserMyself=function(e){delete e.password,r.user=e,i.firstOnlyLocalStorage.user=e},i.authFacebook=function(e){a.login(function(r){"connected"==r.status?a.api("/me",{fields:"email, name"},e):t.info("Facebook. User cancelled login or did not fully authorize.")},{scope:"email"})},i.authGoogle=function(e){n.signIn().then(e,function(e){t.info("Google. User cancelled login or did not fully authorize.",e)})}}e.$inject=["$http","$log","$localStorage","Facebook","GoogleSignin"],angular.module("shared").service("mainAuthorizationService",e)}(),function(){"use strict";function e(e,t,r,a,n,i){function o(e,t){return _.findIndex(d.cacheData[e],t)}function c(e,t,r){return _.filter(r,JSON.parse('{"'+t+'":"'+e+'"}'))}function s(){return window.API_URL+"/"}function u(t,r,a){i.loader.show(),e[t].apply(this,r).then(function(e){i.loader.hide(),a(e)})["catch"](l)}function l(e){i.loader.hide(),e.data?a.messages("error",e.data.message?e:{data:{message:"status: "+e.data.statusCode+", message: "+e.data.error}}):a.messages("error",{data:{message:"status: "+e.status}})}var d=this,m=!1;d.cacheData={},d.get=function(e,t){d.cacheData[e]?t(d.cacheData[e]):u("get",[s()+e],function(r){d.cacheData[e]=r.data,t(r.data)})},d.add=function(e,t,r){u("post",[s()+e,t],function(t){"users"!==e&&d.cacheData[e]&&d.cacheData[e].push(t.data),r(t.data)})},d.authorization=function(e,t,a){r.temporaryDataUser=!1,u("post",[s()+e,t],function(e){r.temporaryDataUser=e.data,a(e.data)})},d.accountActivationUser=function(e,t,r){u("post",[s()+e,t],function(e){r(e.data)})},d.login=function(e,t,r){m&&(d.cacheData=m),n.checkRememberMe(t.rememberMe),delete t.rememberMe,u("post",[s()+e,t],function(e){n.setToken(e.data.token),n.addAuthHeaderForAPI(e.data.token),n.setUserMyself(e.data.user),r(e)})},d.logout=function(){m=d.cacheData,d.cacheData={},n.clearUserMyself(),n.setToken(),n.clearAuthHeaderForAPI()},d.update=function(e,t,r){u("put",[s()+e,t],function(t){d.cacheData[e][o(e,{_id:t.data._id})]=t.data,r(t.data)})},d.deleteById=function(e,t,r){u("delete",[s()+e+"/"+t],function(a){d.cacheData[e].splice(o(e,{_id:t}),1),r(a.data)})},d.getById=function(e,t,r){d.get(e,function(e){r(c(t,"_id",e))})},d.getByEmail=function(e,t,r){d.get(e,function(e){r(c(t,"creator_email",e))})}}e.$inject=["$http","$log","$localStorage","popupsService","mainAuthorizationService","mainOtherService"],angular.module("shared").service("mainHttpService",e)}(),function(){"use strict";function e(e,t){var r=this;r.loader={activateLoader:!1,show:function(){r.loader.activateLoader=!0},hide:function(){r.loader.activateLoader=!1}}}e.$inject=["$http","$log"],angular.module("shared").service("mainOtherService",e)}(),function(){"use strict";function e(e,t,r,a){return{restrict:"EA",templateUrl:window.ORIGIN_PATH+"parts/pagination/pagination.html",link:function(e,a,n){e.routeParams=t;var i=Number(e.routeParams.pageNumber);e.getHash,e.$watch("prevItems",function(t){if(t){var a=r.group(t,5);e.pagination=a,e.$ctrl.items=a[Number(e.routeParams.pageNumber)-1]}},!0),e.showNumbering=function(e){var t=i===e+3,r=i===e+2,a=i===e+1,n=i===e,o=i===e-1;return t||r||a||n||o},e.showDots=function(e){return i===e+4||i===e-2},e.nextPage=function(){return Number(e.routeParams.pageNumber)+1},e.prevPage=function(){return Number(e.routeParams.pageNumber)-1}}}}e.$inject=["$log","$routeParams","paginationService","$timeout"],angular.module("shared").directive("pagination",e)}(),function(){"use strict";function e(e,t,r){var a,n=this;n.group=function(e,t){var r="",n=Math.ceil(e.length/t);a=e;for(var i=0;i<n;i+=1)r+="[]"+(n-1!==i?",":"");for(var o=JSON.parse("["+r+"]"),c=0;c<o.length;c+=1)o[c]=e.slice(c*t,c*t+t);return o}}e.$inject=["$http","$log","$routeParams"],angular.module("shared").service("paginationService",e)}(),function(){"use strict";function e(e,t){this.forms=function(r,a){var n=e.open({ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"parts/popups/form.html",controller:["$uibModalInstance","items",function(e,t){var r=this,a={};r.title=t.title,r.fields=t.fields,r.additionalButtons=t.additionalButtons,r.validationCustom=function(e){var t=!0;a.filled=!0;for(var n=0;n<r.fields.length;n+=1){var i=r.fields[n];a[i.name]=i.text}return a.confirm_password?a.password===a.confirm_password&&e.$valid&&(t=!1):t=!e.$valid,t},r.send=function(t){e.close(t)},r.cancel=function(){e.dismiss("cancel")}}],controllerAs:"$ctrl",size:"md",resolve:{items:function(){return r}}});n.result.then(function(e){a(e)},function(){t.info("Modal dismissed at: "+new Date)})},this.messages=function(t,r){e.open({ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"parts/popups/messages.html",controller:["$uibModalInstance","options",function(e,r){var a=this;a.title=_.capitalize(t),a.data=r.data.message,a.classes=t,a.close=function(){e.dismiss("cancel")}}],controllerAs:"$ctrl",size:"md",resolve:{options:function(){return r}}})}}e.$inject=["$uibModal","$log"],angular.module("shared").service("popupsService",e)}(),function(){"use strict";function e(e){}e.$inject=["$log"],angular.module("users").service("usersService",e)}();