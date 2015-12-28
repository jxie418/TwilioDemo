/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .factory('AuthService', ['$rootScope', function($rootScope) {
        var AuthService = {};
        AuthService.login = function(user) {
            $rootScope.currentUser ={
                username:user.username,
                role:user.role
            };
            localStorage.setItem('currentUser',JSON.stringify($rootScope.currentUser));
        };
        AuthService.logout = function() {
            $rootScope.currentUser = '';
            $rootScope.selectedENV = '';
            localStorage.setItem('currentUser','');
            localStorage.setItem('selectedENV','');
        };
        return AuthService;
    }]);
