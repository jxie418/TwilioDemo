angular
    .module('VideoCallCenter', [
        'ui.router',
        'ngRoute'
    ])
    .config(['$stateProvider', '$urlRouterProvider','$routeProvider',
        function($stateProvider, $urlRouterProvider,$routeProvider) {

            $routeProvider
                .when('/',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/login',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/call-center',{
                    templateUrl:'views/call-center.html',
                    controller: 'CallCenterController',
                    authenticate:true
                })
                .when('/forbidden',{
                    templateUrl:'views/forbidden.html'
                })
                .otherwise({
                    redirectTo:'/'
                });

            $stateProvider
                .state('call-center', {
                    url: '/call-center',
                    templateUrl: 'views/call-center.html',
                    controller: 'CallCenterController',
                    authenticate:true
                })
                .state('forbidden', {
                    url: '/forbidden',
                    templateUrl: 'views/forbidden.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'AuthLoginController'
                });
            $urlRouterProvider.otherwise('login');
        }])
    .run(['$rootScope', '$state', '$location', function($rootScope, $state,$location) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
            // redirect to login page if not logged in
            if (next.authenticate && !$rootScope.currentUser) {
                event.preventDefault(); //prevent current page from loading
                $state.go('login');
            }
        });
    }]);
