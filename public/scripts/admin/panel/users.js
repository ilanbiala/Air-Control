/**
 * TODO make changing the password and the role possible
 */

function removeUserFromTable(user) {
	$('#' + user).remove();
}

function addUserToTable(user) {
	$('.users').append(
		$('<tr/>')
		.attr('id', user.id)
		.append('<td/>')
		.text(user.firstName + ' ' + user.lastName)
		.append('<td/>')
		.text(user.role)
		.append('<td/>')
		.text('Change password')
		.append('<td/>')
		.text(
			$('<a/>')
			.attr('href', '#')
			.addClass('removeUserModalButton')
			.attr('data-user-id', user.id)
			.attr('data-reveal-id', 'removeUserModal')
			.text(
				$('<i/>')
				.addClass('fi-x'))
		)
	);
}

function generateErrorStatement(errors) {
	var errorMsg;
	for (var i = errors.length - 1; i >= 0; i--) {
		errorMsg += errors[i];
		errorMsg += '\n';
	}
	return errorMsg;
}

// var userHTMLString = '<tr id="' + user._id + '">' +
// 	'<td>' + user.firstName + ' ' + user.lastName + '</td>' +
// 	'<td>' + user.email + '</td>' +
// 	'<td>' + user.role + '</td>' +
// 	'<td>Change password</td>' +
// 	'<td><a href="#" class="removeUserModalButton" data-user-id="' + user._id + '" data-reveal-id="removeUserModal"><i class="fi-x"></i></a></td>' +
// 	'</tr>';
// $('.users').append(userHTMLString);

$(document).ready(function() {
	$(document).foundation();

	var whichUserToDelete;

	$('.removeUserModalButton').on('click', function() {
		whichUserToDelete = $(this).attr('data-user-id');
	});

	$('#cancelRemoveUser, #cancelAddUser').on('click', function(e) {
		e.preventDefault();
		$('.reveal-modal').foundation('reveal', 'close');
	});

	$('#removeUser').on('click', function() {
		$.ajax({
			url: '/panel/users/' + whichUserToDelete,
			type: 'DELETE'
		}).done(function(response) {
			if (response.success === true) {
				$('#removeUserModal').foundation('reveal', 'close');
				$('.alert-box.success').trigger('open.fndtn.alert-box').children('p.content').text('Way to go! That user is out of here!');
				removeUserFromTable(whichUserToDelete);
				whichUserToDelete = null;
			}
		}).fail(function(err) {
			alert('Error: ' + err);
			console.log(err);
			$('#removeUserModal').foundation('reveal', 'close');
			$('.alert-box.warning').trigger('open.fndtn.alert-box').children('p.content').text('Something went wrong, please try again.');
		});
	});

	$('#addUser').on('click', function(e) {
		e.preventDefault();
		var userData = $('#addUserModal form').serialize();
		$.ajax({
			url: '/panel/users/create',
			type: 'POST',
			data: userData
		}).done(function(response) {
			console.log(response);
			if (response.errors.length > 0) {
				var errorMessage = generateErrorStatement(response.errors);
				$('.alert-box.warning').trigger('open.fndtn.alert-box');
				$('.alert-box.warning p.content').text(errorMessage);
			} else {
				$('#addUserModal').foundation('reveal', 'close');
				$('.alert-box.success').trigger('open.fndtn.alert-box');
				$('.alert-box.success p.content').text('The user has been created.');
				addUserToTable(response.user);
			}
		}).fail(function(err) {
			console.log(err);
			if (err.length > 0) {
				var errorMessage = generateErrorStatement(err);
				$('.alert-box.warning').trigger('open.fndtn.alert-box');
				$('.alert-box.warning p.content').text(errorMessage);
			}
		});
	});
});
