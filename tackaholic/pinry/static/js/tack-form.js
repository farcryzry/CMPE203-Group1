/**
 * Tack Form for Pinry
 * Descrip: This is for creation new tacks on everything, the bookmarklet, on the
 *          site and even editing tacks in some limited situations.
 * Authors: Pinry Contributors
 * Updated: March 3rd, 2013
 * Require: jQuery, Pinry JavaScript Helpers
 */


$(window).load(function() {
    var uploadedImage = false;
    var editedTack = null;

    // Start Helper Functions
    function getFormData() {
        return {
            submitter: currentUser,
            url: $('#tack-form-image-url').val(),
            description: $('#tack-form-description').val(),
            tags: cleanTags($('#tack-form-tags').val())
        }
    }

    function createTackPreviewFromForm() {
        var context = {tacks: [{
                submitter: currentUser,
                image: {thumbnail: {image: $('#tack-form-image-url').val()}},
                description: $('#tack-form-description').val(),
                tags: cleanTags($('#tack-form-tags').val())
            }]},
            html = renderTemplate('#tacks-template', context),
            preview = $('#tack-form-image-preview');
        preview.html(html);
        preview.find('.tack').width(240);
        preview.find('.tack').fadeIn(300);
        if (getFormData().url == "")
            preview.find('.image-wrapper').height(255);
        preview.find('.image-wrapper img').fadeIn(300);
        setTimeout(function() {
            if (preview.find('.tack').height() > 305) {
                $('#tack-form .modal-body').animate({
                    'height': preview.find('.tack').height()+25
                }, 300);
            }
        }, 300);
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
    function createTackForm(editTackId) {
        var promise = getBoardListData(currentUser.id);
        promise.success(function(data) {
            $('body').append(renderTemplate('#tack-form-template', {boards: data.objects}));
        });

        var modal = $('#tack-form'),
            formFields = [$('#tack-form-image-url'), $('#tack-form-description'),
            $('#tack-form-tags')],
            tackFromUrl = getUrlParameter('tack-image-url');
        // If editable grab existing data

        $('#tack-form h3.modal-title').text('New Tack');

        if (editTackId) {
            $('#tack-form h3.modal-title').text('Edit Tack');

            promise = getTackData(editTackId);
            promise.success(function(data) {
                editedTack = data;
                $('#tack-form-image-url').val(editedTack.image.thumbnail.image);
                $('#tack-form-image-url').parent().hide();
                $('#tack-form-image-upload').parent().hide();
                $('#tack-form-board').val(editedTack.board.id);
                $('#tack-form-description').val(editedTack.description);
                $('#tack-form-tags').val(editedTack.tags);
                createTackPreviewFromForm();
            });
        }
        modal.modal('show');
        // Auto update preview on field changes
        var timer;
        for (var i in formFields) {
            formFields[i].bind('propertychange keyup input paste', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    createTackPreviewFromForm()
                }, 700);
                if (!uploadedImage)
                    $('#tack-form-image-upload').parent().fadeOut(300);
            });
        }
        // Drag and Drop Upload
        $('#tack-form-image-upload').fineUploader({
            request: {
                endpoint: '/tacks/create-image/',
                paramsInBody: true,
                multiple: false,
                validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'png', 'gif']
                },
                text: {
                    uploadButton: 'Click or Drop'
                }
            }
        }).on('complete', function(e, id, name, data) {
            $('#tack-form-image-url').parent().fadeOut(300);
            $('.qq-upload-button').css('display', 'none');
            var promise = getImageData(data.success.id);
            uploadedImage = data.success.id;
            promise.success(function(image) {
                $('#tack-form-image-url').val(image.thumbnail.image);
                createTackPreviewFromForm();
            });
            promise.error(function() {
                message('Problem uploading image.', 'alert alert-warning');
            });
        });
        // If bookmarklet submit
        if (tackFromUrl) {
            $('#tack-form-image-upload').parent().css('display', 'none');
            $('#tack-form-image-url').val(tackFromUrl);
            $('.navbar').css('display', 'none');
            modal.css({
                'margin-top': -35,
                'margin-left': -281
            });
        }
        // Submit tack on post click
        $('#tack-form-submit').click(function(e) {
            e.preventDefault();
            $(this).off('click');
            $(this).addClass('disabled');
            if (editedTack) {
                var apiUrl = '/api/v1/tack/'+editedTack.id+'/?format=json';
                var data = {
                    board: '/api/v1/user/'+$('#tack-form-board').val()+'/',
                    description: $('#tack-form-description').val(),
                    tags: cleanTags($('#tack-form-tags').val())
                };
                var promise = $.ajax({
                    type: "put",
                    url: apiUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                });
                promise.success(function(tack) {
                    tack.editable = true;
                    var renderedTack = renderTemplate('#tacks-template', {
                        tacks: [
                            tack
                        ]
                    });
                    $('#tacks').find('.tack[data-id="'+tack.id+'"]').replaceWith(renderedTack);
                    tileLayout();
                    lightbox();
                    dismissModal(modal);
                    editedTack = null;
                    message('New tack added, please refresh to see it.', 'alert alert-sucess');
                });
                promise.error(function() {
                    message('Problem updating image.', 'alert alert-warning');
                });
            } else {
                var data = {
                    submitter: '/api/v1/user/'+currentUser.id+'/',
                    description: $('#tack-form-description').val(),
                    board: '/api/v1/user/'+$('#tack-form-board').val()+'/',
                    tags: cleanTags($('#tack-form-tags').val())
                };
                if (uploadedImage) data.image = '/api/v1/image/'+uploadedImage+'/';
                else data.url = $('#tack-form-image-url').val();
                var promise = postTackData(data);
                promise.success(function(tack) {
                    if (tackFromUrl) return window.close();
                    tack.editable = true;
                    tack = renderTemplate('#tacks-template', {tacks: [tack]});
                    $('#tacks').prepend(tack);
                    tileLayout();
                    lightbox();
                    dismissModal(modal);
                    uploadedImage = false;
                });
                promise.error(function() {
                    message('Problem saving image.', 'alert alert-warning');
                });
            }
        });
        $('#tack-form-close').click(function() {
            if (tackFromUrl) return window.close();
            dismissModal(modal);
        });
        createTackPreviewFromForm();
    }
    // End View Functions


    // Start Init
    window.tackForm = function(editTackId) {
        editTackId = typeof editTackId !== 'undefined' ? editTackId : null;
        createTackForm(editTackId);
    }

    if (getUrlParameter('tack-image-url')) {
        createTackForm();
    }
    // End Init
});
