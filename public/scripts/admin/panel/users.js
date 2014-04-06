$(document).ready(function() {
	$(document).foundation();

	var whichUserToDelete;

	$('.removeUserModalButton').on('click', function() {
		whichUserToDelete = $(this).attr('data-user-id');
	});

	$('#cancelRemoveUser').on('click', function() {
		$('#removeUserModal').foundation('reveal', 'close');
	});

	$('#removeUser').on('click', function() {
		$.ajax({
			url: '/panel/users/' + whichUserToDelete,
			type: 'DELETE '
		}).done(function(response) {
			alert('Response: ' + response);
			console.log(response);
			$('#removeUserModal').foundation('reveal', 'close');
			$('.alert-box.success ').trigger('open.fndtn.alert-box');
		}).fail(function(err) {
			alert('Error: ' + err);
			console.log(err);
			$('#removeUserModal').foundation('reveal', 'close');
			$('.alert-box.warning ').trigger('open.fndtn.alert-box');
		});
	});
});
