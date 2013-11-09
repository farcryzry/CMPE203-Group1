/**
 * Created by lan on 11/5/13.
 */
/**
 * Pin Form for Pinry
 * Descrip: This is for creation new pins on everything, the bookmarklet, on the
 *          site and even editing pins in some limited situations.
 * Authors: Pinry Contributors
 * Updated: March 3rd, 2013
 * Require: jQuery, Pinry JavaScript Helpers
 */


$(window).load(function() {
    var editedBoard = null;

    // Start Helper Functions
    function getFormData() {
        return {
            submitter: currentUser,
            name: $('#board-form-name').val(),
            description: $('#board-form-description').val(),
            category: $('#board-form-category').val()
        }
    }

    function dismissModal(modal) {
        modal.modal('hide');
        setTimeout(function() {
            modal.remove();
        }, 200);
    }
    // End Helper Functions


    // Start View Functions
    function createBoardForm(editBoardId) {
        $('body').append(renderTemplate('#board-form-template', ''));
        var modal = $('#board-form'),
            formFields = [$('#board-form-name'), $('#board-form-description'),
            $('#board-form-category')];
        // If editable grab existing data
        if (editBoardId) {
            var promise = getBoardData(editBoardId);
            promise.success(function(data) {
                editedBoard = data;
                $('#board-form-name').val(editedBoard.name);
                $('#board-form-description').val(editedBoard.description);
                $('#board-form-category').val(editedBoard.category);
            });
        }
        modal.modal('show');

        // Submit board on post click
        $('#board-form-submit').click(function(e) {
            e.preventDefault();
            $(this).off('click');
            $(this).addClass('disabled');
            if (editedBoard) {
                var apiUrl = '/api/v1/board/'+editedBoard.id+'/?format=json';
                var data = {
                    name: $('#board-form-name').val(),
                    description: $('#board-form-description').val(),
                    category: $('#board-form-category').val()
                }
                var promise = $.ajax({
                    type: "put",
                    url: apiUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                });
                promise.success(function(board) {
                    dismissModal(modal);
                    editedBoard = null;
                });
                promise.error(function() {
                    message('Problem creating new board.', 'alert alert-error');
                });
            } else {
                var data = {
                    owner: '/api/v1/user/'+currentUser.id+'/',
                    name: $('#board-form-name').val(),
                    description: $('#board-form-description').val(),
                    category: $('#board-form-category').val()
                };
                var promise = postBoardData(data);
                promise.success(function(board) {
                    board.editable = true;
                    dismissModal(modal);
                });
                promise.error(function() {
                    message('Problem creating new board.', 'alert alert-error');
                });
            }
        });
        $('#board-form-close').click(function() {
            dismissModal(modal);
        });
    }
    // End View Functions


    // Start Init
    window.boardForm = function(editBoardId) {
        editBoardId = typeof editBoardId !== 'undefined' ? editBoardId : null;
        createBoardForm(editBoardId);
    }

  //  if (getUrlParameter('board-image-url')) {
   //     createBoardForm();
        // }
    // End Init
});
