var groceries = angular.module('groceries', []);

groceries.controller('mainController', ['$scope', '$http', function ($scope, $http) {
	
	$scope.hello = "Hello from controller";
	
	$scope.formData = {};
	
	$http.get('/api/item')
		.then(function(data) {
			$scope.items = data.data;
			console.log(data);
		}, 
		function(data) {
			console.log('Error: '+data);
		});
	
	$scope.createItem = function() {
		$http.post('/api/item', $scope.formData)
			.then(function(data) {
				$scope.formData = {};
				$scope.items = data.data;
				console.log(data);
			},
			function(data) {
				console.log('Error: '+data);
			});
	};
	
	$scope.deleteItem = function(id) {
		$http.delete('/api/item/' + id)
			.then(function(data) {
				$scope.items = data.data;
				console.log(data);
			},
			function(data) {
				console.log('Error: '+ data);
			});
	};
}]);