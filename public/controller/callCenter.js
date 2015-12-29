/**
 * Created by jamesxieaudaexplorecom on 12/28/15.
 */
angular
    .module('VideoCallCenter')
    .controller('CallCenterController', ['$scope', '$http', '$state','$rootScope',
        function($scope, $http, $state,$rootScope) {
            $scope.loginUser = $rootScope.currentUser;
            $scope.showInviteControls = false;
            $scope.conversationsClient="";
            $scope.activeConversation="";
            $scope.previewMedia="";
            $scope.localMedias = [];
            $scope.identity="";
            $scope.inviteToId = "";
            $scope.logMsg = "Preparing to listen...";
            $scope.logout = function() {
                $rootScope.currentUser = '';
                $state.go('login');
            };

            $scope.isShownInviteControls = function() {
              return   $scope.showInviteControls;
            };
            // Conversation is live
            var conversationStarted =  function (conversation) {
                $scope.$apply(function(){
                    $scope.logMsg ="In an active Conversation";
                });
                $scope.activeConversation = conversation;
                // Draw local video, if not already previewing
                if (!$scope.previewMedia) {
                    //conversation.localMedia.attach('#local-media');
                    $scope.localMedias.push(conversation.localMedia);
                }

                // When a participant joins, draw their video on screen
                conversation.on('participantConnected', function (participant) {
                    $scope.$apply(function(){
                        $scope.logMsg = "Participant '" + participant.identity + "' connected";
                    });
                    participant.media.attach('#remote-media');
                });

                // When a participant disconnects, note in log
                conversation.on('participantDisconnected', function (participant) {
                    $scope.$apply(function(){
                        $scope.logMsg ="Participant '" + participant.identity + "' disconnected";
                    });
                });

                // When the conversation ends, stop capturing local video
                conversation.on('ended', function (conversation) {
                    $scope.$apply(function(){
                        $scope.logMsg ="Connected to Twilio. Listening for incoming Invites as '" + conversationsClient.identity + "'";
                    });
                    conversation.localMedia.stop();
                    conversation.disconnect();
                    $scope.activeConversation = null;
                });
            };

           var  clientConnected = function() {
                console.log("enter clientConnected!");
                $scope.$apply(function() {
                    $scope.showInviteControls = true;
                    $scope.logMsg ="Connected to Twilio. Listening for incoming Invites as '" + $scope.conversationsClient.identity + "'";
                });

                $scope.conversationsClient.on('invite', function (invite) {
                    $scope.$apply(function(){
                        $scope.logMsg = 'Incoming invite from: ' + invite.from;
                    });
                    invite.accept().then(conversationStarted);
                });
            };
            $scope.previewCamera = function() {
                if (!$scope.previewMedia) {
                    $scope.previewMedia = new Twilio.Conversations.LocalMedia();
                    Twilio.Conversations.getUserMedia().then(
                        function (mediaStream) {
                            $scope.previewMedia.addStream(mediaStream);
                            //$scope.previewMedia.attach('#local-media');
                        },
                        function (error) {
                            console.error('Unable to access local media', error);
                            $scope.$apply(function(){
                                $scope.logMsg ='Unable to access Camera and Microphone';
                            });
                        });
                };
            };
            $scope.sendInvite = function() {
                var inviteTo = $scope.inviteToId;
                if ($scope.activeConversation) {
                    // Add a participant
                    $scope.activeConversation.invite(inviteTo);
                } else {
                    // Create a conversation
                    var options = {};
                    if ($scope.previewMedia) {
                        options.localMedia = $scope.previewMedia;
                    }
                    $scope.conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted, function (error) {
                        $scope.$apply(function(){
                            $scope.logMsg = 'Unable to create conversation';
                        });
                        console.error('Unable to create conversation', error);
                    });
                }
            };


            var getToken = function() {
                if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
                    alert('WebRTC is not available in your browser.');
                    return;
                }
                var url ="/token?device="+$rootScope.currentUser;
                console.log(url);
                $http.get(url)
                    .then(
                    function(response) {
                        console.log(JSON.stringify(response.data));
                        spinner.stop();
                        $scope.identity = response.data.identity;
                        var accessManager = new Twilio.AccessManager(response.data.token);

                        console.log($scope.identity);
                        // Create a Conversations Client and connect to Twilio
                        $scope.conversationsClient = new Twilio.Conversations.Client(accessManager);
                        $scope.conversationsClient.listen().then(clientConnected, function (error) {
                           $scope.$apply(function(){
                               $scope.logMsg = 'Could not connect to Twilio: ' + error.message;
                           });
                        });
                    },
                    function(error){
                        console.log(JSON.stringify(error));
                        spinner.stop();
                        $scope.$apply(function(){
                            $scope.errorMsg="Can't get Video Call Token from Twilio API. Please check your Twilio Account.";
                        });
                    });
            };
            getToken();
        }]);