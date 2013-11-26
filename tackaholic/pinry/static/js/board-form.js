/**
 * Created by lan on 11/5/13.
 */
/**
 * Tack Form for Pinry
 * Descrip: This is for creation new tacks on everything, the bookmarklet, on the
 *          site and even editing tacks in some limited situations.
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
            category: $('#board-form-category').val(),
            cover: '/api/v1/tack/9/'  //default cover when create a new board
        }
    }

    function dismissModal(modal) {
        modal.modal('hide');

        setTimeout(function() {
            modal.remove();
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
        }, 200);
    }
    // End Helper Functions


    // Start View Functions
    function createBoardForm(editBoardId) {
        var promise = getCategoryListData();
        promise.success(function(data) {
            $('body').append(renderTemplate('#board-form-template', {category: data.objects}));
        });

        var modal = $('#board-form'),
            formFields = [$('#board-form-name'), $('#board-form-description'),
            $('#board-form-category')];
        // If editable grab existing data
        $('#board-form h3.modal-title').text('New Board');
        $('#board-form button.btn-primary').text('Add Board');
        if (editBoardId) {
            $('#board-form h3.modal-title').text('Edit Board');
            $('#board-form button.btn-primary').text('Save Board');
            var promise = getBoardData(editBoardId);
            promise.success(function(data) {
                editedBoard = data;
                $('#board-form-name').val(editedBoard.name);
                $('#board-form-description').val(editedBoard.description);
                $('#board-form-category').val(editedBoard.category);
                $('#board-form-secret').prop('checked', editedBoard.secret);
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
                    category: $('#board-form-category').val(),
                    secret: $('#board-form-secret').is(':checked')
                };
                var promise = $.ajax({
                    type: "put",
                    url: apiUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                });

                promise.success(function(board) {
                    board.editable = true;
                    var renderedBoard = renderTemplate('#boards-template', {
                        boards: [
                            board
                        ]
                    });
                    $('#boards').find('.board[data-id="'+board.id+'"]').replaceWith(renderedBoard);
                    tileLayout('boards', 'board');
                    lightbox();
                    dismissModal(modal);
                    editedBoard = null;
                    message('Board updated, please refresh to see it.', 'alert alert-success');
                });

                promise.error(function() {
                    message('Problem creating new board.', 'alert alert-warning');
                });

            } else {
                var data = {
                    owner: '/api/v1/user/'+currentUser.id+'/',
                    cover: '/api/v1/image/17/',     //default cover image
                    name: $('#board-form-name').val(),
                    description: $('#board-form-description').val(),
                    category: $('#board-form-category').val(),
                    secret: $('#board-form-secret').is(':checked')
                };
                var promise = postBoardData(data);
                promise.success(function(board) {
                    board.editable = true;
                    board = renderTemplate('#boards-template', {boards: [board]});
                    $('#boards').prepend(board);
                    tileLayout('boards', 'board');
                    lightbox();
                    dismissModal(modal);
                    message('New board added, please refresh to see it.', 'alert alert-success');
                });
                promise.error(function() {
                    message('Problem creating new board.', 'alert alert-warning');
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
