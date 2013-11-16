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
    var editedPin = null;

    // Start Helper Functions
    function getFormData() {
        return {
            submitter: currentUser,
            url: $('#tack-form-image-url').val(),
            description: $('#tack-form-description').val(),
            tags: cleanTags($('#tack-form-tags').val())
        }
    }

    function createPinPreviewFromForm() {
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
    function createPinForm(editPinId) {
        $('body').append(renderTemplate('#tack-form-template', ''));
        var modal = $('#tack-form'),
            formFields = [$('#tack-form-image-url'), $('#tack-form-description'),
            $('#tack-form-tags')],
            pinFromUrl = getUrlParameter('tack-image-url');
        // If editable grab existing data

        $('#tack-form h3.modal-title').text('New Tack')

        if (editPinId) {
            $('#tack-form h3.modal-title').text('Edit Tack')

            var promise = getPinData(editPinId);
            promise.success(function(data) {
                editedPin = data;
                $('#tack-form-image-url').val(editedPin.image.thumbnail.image);
                $('#tack-form-image-url').parent().hide();
                $('#tack-form-image-upload').parent().hide();
                $('#tack-form-description').val(editedPin.description);
                $('#tack-form-tags').val(editedPin.tags);
                createPinPreviewFromForm();
            });
        }
        modal.modal('show');
        // Auto update preview on field changes
        var timer;
        for (var i in formFields) {
            formFields[i].bind('propertychange keyup input paste', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    createPinPreviewFromForm()
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
                createPinPreviewFromForm();
            });
            promise.error(function() {
                message('Problem uploading image.', 'alert alert-error');
            });
        });
        // If bookmarklet submit
        if (pinFromUrl) {
            $('#tack-form-image-upload').parent().css('display', 'none');
            $('#tack-form-image-url').val(pinFromUrl);
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
            if (editedPin) {
                var apiUrl = '/api/v1/tack/'+editedPin.id+'/?format=json';
                var data = {
                    description: $('#tack-form-description').val(),
                    tags: cleanTags($('#tack-form-tags').val())
                }
                var promise = $.ajax({
                    type: "put",
                    url: apiUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                });
                promise.success(function(tack) {
                    tack.editable = true;
                    var renderedPin = renderTemplate('#tacks-template', {
                        tacks: [
                            tack
                        ]
                    });
                    $('#tacks').find('.tack[data-id="'+tack.id+'"]').replaceWith(renderedPin);
                    tileLayout();
                    lightbox();
                    dismissModal(modal);
                    editedPin = null;
                });
                promise.error(function() {
                    message('Problem updating image.', 'alert alert-error');
                });
            } else {
                var data = {
                    submitter: '/api/v1/user/'+currentUser.id+'/',
                    description: $('#tack-form-description').val(),
                    tags: cleanTags($('#tack-form-tags').val())
                };
                if (uploadedImage) data.image = '/api/v1/image/'+uploadedImage+'/';
                else data.url = $('#tack-form-image-url').val();
                var promise = postPinData(data);
                promise.success(function(tack) {
                    if (pinFromUrl) return window.close();
                    tack.editable = true;
                    tack = renderTemplate('#tacks-template', {tacks: [tack]});
                    $('#tacks').prepend(tack);
                    tileLayout();
                    lightbox();
                    dismissModal(modal);
                    uploadedImage = false;
                });
                promise.error(function() {
                    message('Problem saving image.', 'alert alert-error');
                });
            }
        });
        $('#tack-form-close').click(function() {
            if (pinFromUrl) return window.close();
            dismissModal(modal);
        });
        createPinPreviewFromForm();
    }
    // End View Functions


    // Start Init
    window.pinForm = function(editPinId) {
        editPinId = typeof editPinId !== 'undefined' ? editPinId : null;
        createPinForm(editPinId);
    }

    if (getUrlParameter('tack-image-url')) {
        createPinForm();
    }
    // End Init
});
