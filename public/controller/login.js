/**
 * Created by jamesxieaudaexplorecom on 12/28/15.
 */
angular
    .module('VideoCallCenter')
    .controller('AuthLoginController', ['$scope', '$http', '$state','$rootScope',
        function($scope, $http, $state,$rootScope) {
            $scope.errorMsg="";
            $scope.submit = function(){
                spinner.spin(pageCenter);

                var url ="/login";
                console.log(url);
                $http.post(url,{username:$scope.username,password:$scope.password})
                    .then(
                    function(response) {
                        console.log(JSON.stringify(response.data));
                        spinner.stop();
                        if(typeof(response.data.error) === 'undefined') {
                            $rootScope.currentUser = $scope.username;
                            $state.go('call-center');
                        } else {
                            $scope.errorMsg="Invalid username or password. Please try again.";
                        }
                    },
                    function(error){
                        console.log(JSON.stringify(error));
                        spinner.stop();
                        $scope.errorMsg="Invalid username or password. Please try again.";
                    });
            };

            $scope.logout = function() {
                $state.go('login');
            };
        }]);
