'use strict';

/**
 * @ngdoc overview
 * @name blacktiger-app
 * @description
 * # blacktiger-app
 *
 * Main module of the application.
 */
var blacktigerApp = angular.module('blacktiger-admin', [
    'blacktiger-controllers',
    'blacktiger-directives',
    'blacktiger-filters',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'blacktiger',
    'teljs',
    'ngMaterial',
    'angular-svg-round-progress'
]);

blacktigerApp.config(function ($routeProvider, $httpProvider, $translateProvider, blacktigerProvider, CONFIG, $mdThemingProvider) {

    if (CONFIG.serviceUrl) {
        blacktigerProvider.setServiceUrl(CONFIG.serviceUrl);
    }

    $mdThemingProvider.theme('menu')
        .backgroundPalette('blue-grey', {
          'default': 'A200',
          'hue-1': '50',
          'hue-2': '600',
          'hue-3': 'A100'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');

    // SECURITY (forward to login if not authorized)
    $httpProvider.interceptors.push(function ($location) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
                }
                return rejection;
            }
        };
    });

    $routeProvider.
            when('/login', {
                controller: 'LoginCtrl',
                templateUrl: 'views/login.html'
            }).
            when('/dashboard', {
                controller: 'DashboardCtrl',
                templateUrl: 'views/dashboard.html'
            }).
            when('/history', {
                controller: 'HistoryCtrl',
                templateUrl: 'views/system-history.html'
            }).
            otherwise({
                redirectTo: '/login'
            });


    $translateProvider.useStaticFilesLoader({
        prefix: 'scripts/i18n/blacktiger-locale-',
        suffix: '.json'
    });

    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    $translateProvider.registerAvailableLanguageKeys(['en', 'da', 'es', 'no', 'sv', 'is', 'fo', 'kl'], {
        'no*': 'no',
        'nb*': 'no',
        'nn*': 'no',
        'da*': 'dk',
        'es*': 'es',
        'sv*': 'sv',
        'is*': 'is',
        'fo*': 'fo',
        'kl*': 'kl',
        '*': 'en'
    });
    $translateProvider.determinePreferredLanguage(function () {
        var language;
        if (navigator && navigator.languages) {
            language = navigator.languages[0];
        } else {
            language = window.navigator.userLanguage || window.navigator.language;
            language = language.split('-');
            language = language[0];
        }
        return language;
    });
});

blacktigerApp.run(function ($location, LoginSvc, $rootScope, $mdSidenav) {
    // The context object is a holder of information for the current session
    $rootScope.context = {};

    LoginSvc.authenticate().then(angular.noop, function () {
        $location.path('/login');
    });

    $rootScope.$on('afterLogout', function () {
        $rootScope.rooms = null;
        $location.path('/login');
    });

    $rootScope.$on('login', function () {
        $location.path('/dashboard');
    });

    $rootScope.toggleMenu = function() {
        $mdSidenav('menu').toggle();
    }
});

/** BOOTSTRAP **/
angular.element(document).ready(function () {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var languageNames = {
        'da': 'Dansk',
        'en': 'English',
        'fo': 'Føroyskt',
        'kl': 'Kalaallisut',
        'sv': 'Svenska',
        'no': 'Norsk',
        'is': 'Íslenska',
        'es': 'Español'
    };
    var defaultConfig = {
        serviceUrl: 'http://192.168.87.104:8084/blacktiger',
        RootHelp: 'http://help.txxxxx.org/{%1}',
        SIPHelp: 'http://help.txxxxx.org/{%1}/homesetup',
        commentRequestTimeout: 60000,
        hightlightTimeout: 15000
    };

    var initApp = function (config) {
        blacktigerApp.constant('CONFIG', config);
        blacktigerApp.constant('languages', languageNames);
        angular.bootstrap(document, ['blacktiger-admin']);
    };
    $http.get('config.json').then(
            function (response) {
                initApp(response.data);
            },
            function (reason) {
                console.info('Could not load config. Using default config. ' + reason.data);
                initApp(defaultConfig);
            }
    );

});
