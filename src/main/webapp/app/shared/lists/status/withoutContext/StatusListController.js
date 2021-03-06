HomeModule.controller('StatusListController', [
    '$scope',
    '$timeout',
    '$window',
    'StatusService',
    'HomeService',
    'TagService',
    'GroupService',
    'profile',
    'statuses',
    'userRoles',
    'showModal',
    'poller',
    function($scope, $timeout, $window, StatusService, HomeService, TagService, GroupService, profile, statuses, userRoles, showModal, poller) {
        if(showModal && $scope.$state.includes('tatami.home.home.timeline')) {
            $scope.$state.go('tatami.home.home.timeline.presentation');
        }

        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.profile = profile;
        $scope.statuses = statuses;
        $scope.busy = false;

        if($scope.statuses.length == 0) {
            $scope.end = true;
        } else {
            $scope.end = false;
            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
        }

        $scope.newMessages = null;
        $window.document.title = 'Tatami';

        if($scope.$state.is('tatami.home.home.timeline')) {
            var pollingDelay = 20000; // In milliseconds

            $timeout(function() {
                var statusPoller = poller.get(StatusService, {
                    action: 'getHomeTimeline',
                    delay: pollingDelay,
                    smart: true,
                    argumentsArray: [{ start: statuses[0].timelineId }]
                });

                statusPoller.promise.then(null, null, function(response) {
                    if(response.length > 0) {
                        $scope.newMessages = response;
                        $window.document.title = 'Tatami (' + response.length + ')';
                    }
                });
            }, pollingDelay);
        }

        $scope.loadNewStatuses = function() {
            for(var i = $scope.newMessages.length - 1; i >= 0 ; i--) {
                $scope.statuses.unshift($scope.newMessages[i]);
            }
            
            $window.document.title = 'Tatami';
            $scope.newMessages = null;
        };

        var loadMoreSuccess = function(statuses) {
            if(statuses.length == 0) {
                $scope.end = true; // reached end of list
                return;
            }

            for(var i = 0; i < statuses.length; i++) {
                $scope.statuses.push(statuses[i]);
            }

            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
            $scope.busy = false;
        };

        $scope.loadMore = function() {
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            if($scope.$state.current.name == 'tatami.home.home.timeline') {
                StatusService.getHomeTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.company') {
                HomeService.getCompanyTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.mentions') {
                HomeService.getMentions({ finish: $scope.finish }, loadMoreSuccess);
            }

            /*
                Favorites are limited to 50 total per user. All 50 are loaded
                from the favorites REST endpoint at once. There is no way to use
                &finish=timelineId for favorites as of now in the backend.

                Keep this commented out until the backend is changed to allow
                for more than 50 favorites and adding &finish=timelineId to the
                REST url.
            */
            /*
            if($scope.$state.current.name == 'tatami.home.home.favorites') {
                HomeService.getFavorites({ finish: $scope.finish }, loadMoreSuccess);
            }
            */

            if($scope.$state.current.name == 'tatami.home.home.tag') {
                TagService.getTagTimeline({ tag: $scope.$stateParams.tag, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.group.statuses') {
                GroupService.getStatuses({ groupId: $scope.$stateParams.groupId, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.profile.statuses') {
                StatusService.getUserTimeline({ username: $scope.$stateParams.username, finish: $scope.finish }, loadMoreSuccess);
            }
        };

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusId: status.statusId });
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.favoriteStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.statuses[index].favorite = response.favorite;
            });
        };

        $scope.shareStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        };

        $scope.announceStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { announced: true },
                function() {
                    $scope.$state.reload();
                    //$scope.$state.transitionTo('tatami.home.home.timeline');
            });
        };

        $scope.deleteStatus = function(status, index, confirmMessage) {
            // Need a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.statuses.splice(index, 1);
            });
        };

        $scope.getShares = function(status, index) {
            if(status.type == 'STATUS' && status.shares == null) {
                StatusService.getDetails({ statusId: status.statusId }, null,
                    function(response) {
                        $scope.statuses[index].shares = response.sharedByLogins;
                });
            }
        };
    }
]);