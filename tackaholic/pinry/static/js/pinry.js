/**
 * Pinry
 * Descrip: Core of pinry, loads and tiles tacks.
 * Authors: Pinry Contributors
 * Updated: Apr 5th, 2013
 * Require: jQuery, Pinry JavaScript Helpers
 */


$(window).load(function() {
    /**
     * tileLayout will simply tile/retile the block/tack container when run. This
     * was put into a function in order to adjust frequently on screen size 
     * changes.
     */
    window.tileLayout = function(containerId, blockClass) {

        var blockContainer = $('#' + containerId),
            blocks = blockContainer.children('.' + blockClass),
            blockMargin = 15,
            blockWidth = 240,
            rowSize = Math.floor(blockContainer.width()/(blockWidth+blockMargin)),
            colHeights = [],
            rowMargins = [],
            marginLeft = 0;

        // Fill our colHeights array with 0 for each row we have
        for (var i=0; i < rowSize; i++) colHeights[i] = 0;
        // Fill out our rowMargins which will be static after this
        for (var i=0; i < rowSize; i++) {
            // Our first item has a special margin to keep things centered
            if (i == 0) rowMargins[0] = (blockContainer.width()-rowSize*(blockWidth+blockMargin))/2;
            else rowMargins[i] = rowMargins[i-1]+(blockWidth+blockMargin);
        }
        // Loop through every block
        for (var b=0; b < blocks.length; b++) {
            // Get the jQuery object of the current block
            block = blocks.eq(b);
            // Position our new tack in the shortest column
            var sCol = 0;
            for (var i=0; i < rowSize; i++) {
                if (colHeights[sCol] > colHeights[i]) sCol = i;
            }
            block.css({
                'margin-left': rowMargins[sCol],
                'margin-top':  colHeights[sCol],
            });
            block.fadeIn(300);
            colHeights[sCol] += block.height()+(blockMargin);
        }

        // Edit tack if pencil icon clicked
        $('.glyphicon-pencil').each(function() {
            var thisPin = $(this);
            $(this).off('click');
            $(this).click(function() {
                $(this).off('click');
                pinForm($(this).data('id'));
            });
        });

        // Edit board if pencil icon clicked
        $('.glyphicon-edit').each(function() {
            var thisBoard = $(this);
            $(this).off('click');
            $(this).click(function() {
                $(this).off('click');
                boardForm($(this).data('id'));
            });
        });

        // Delete tack if trash icon clicked
        $('.glyphicon-trash').each(function() {
            var thisPin = $(this);
            $(this).off('click');
            $(this).click(function() {
                $(this).off('click');
                var promise = deletePinData($(this).data('id'));
                promise.success(function() {
                    thisPin.closest('.tack').remove();
                    tileLayout('tacks', 'tack');
                });
                promise.error(function() {
                    message('Problem deleting image.', 'alert alert-error');
                });
            });
        });

        // Delete board if trash icon clicked
        $('.glyphicon-remove').each(function() {
            var thisBoard = $(this);
            $(this).off('click');
            $(this).click(function() {
                $(this).off('click');
                var promise = deleteBoardData($(this).data('id'));
                promise.success(function() {
                    thisPin.closest('.board').remove();
                    tileLayout('boards', 'board');
                });
                promise.error(function() {
                    message('Problem deleting board.', 'alert alert-error');
                });
            });
        });

        // Show edit-buttons only on mouse over
        $('.' + blockClass).each(function(){
            var thisPin = $(this);
            thisPin.find('.editable').hide();
            thisPin.off('hover');
            thisPin.hover(function() {
                thisPin.find('.editable').stop(true, true).fadeIn(300);
            }, function() {
                thisPin.find('.editable').stop(true, false).fadeOut(300);
            });
        });

        $('.spinner').css('display', 'none');
        blockContainer.css('height', colHeights.sort().slice(-1)[0]);
    }

    /**
     * On scroll load more tacks from the server
     */
    window.scrollHandler = function() {
        var windowPosition = $(window).scrollTop() + $(window).height();
        var bottom = $(document).height() - 100;
        if(windowPosition > bottom) loadPins();
    }

    /**
     * Load our tacks using the tacks template into our UI, be sure to define a
     * offset outside the function to keep a running tally of your location.
     */
    function loadPins() {
        // Disable scroll
        $(window).off('scroll');

        // Show our loading symbol
        $('.spinner').css('display', 'block');

        // Fetch our tacks from the api using our current offset
        var apiUrl = '/api/v1/tack/?format=json&order_by=-id&offset='+String(offset);
        if (tagFilter) apiUrl = apiUrl + '&tag=' + tagFilter;
        if (userFilter) apiUrl = apiUrl + '&submitter__username=' + userFilter;
        if (boardFilter) apiUrl = apiUrl + '&board__id=' + boardFilter;
        $.get(apiUrl, function(tacks) {
            // Set which items are editable by the current user
            for (var i=0; i < tacks.objects.length; i++)
                tacks.objects[i].editable = (tacks.objects[i].submitter.username == currentUser.username);

            // Use the fetched tacks as our context for our tacks template
            var template = Handlebars.compile($('#tacks-template').html());
            var html = template({tacks: tacks.objects});

            // Append the newly compiled data to our container

            if(userFilter) {
                $( "#tacks" ).before("<h1 style='text-align:center;margin-bottom:20px'>" + currentUser.username + "'s Page</h1>");
            }

            if(tagFilter) {
                $( "#tacks" ).before("<h1 style='text-align:center;margin-bottom:20px'>Tacks Under Tag " + tagFilter + "</h1>");
            }

            if(boardFilter) {
                var promise = getBoardData(boardFilter);
                promise.success(function(board){
                    $( "#tacks" ).before("<h1 style='text-align:center;margin-bottom:20px'>" + board.name + "</h1>");});
            }

            $('#tacks').append(html);

            // We need to then wait for images to load in and then tile
            tileLayout('tacks', 'tack');
            lightbox();
            $('#tacks').ajaxStop(function() {
                $('img').load(function() {
                    $(this).fadeIn(300);
                });
            });

            if (tacks.objects.length < apiLimitPerPage) {
                $('.spinner').css('display', 'none');
                if ($('#tacks').length != 0) {
                    var theEnd = document.createElement('div');
                    theEnd.id = 'the-end';
                    $(theEnd).html('&mdash; End &mdash;');
                    $(theEnd).css('padding', 50);
                    $('body').append(theEnd);
                }
            } else {
                $(window).scroll(scrollHandler);
            }
        });

        // Up our offset, it's currently defined as 50 in our settings
        offset += apiLimitPerPage;
    }

    function loadBoards() {
        // Disable scroll
        $(window).off('scroll');

        // Show our loading symbol
        $('.spinner').css('display', 'block');

        // Fetch our tacks from the api using our current offset
        var apiUrl = '/api/v1/board/?format=json&order_by=-id&offset='+String(offset);
        if (userFilter) apiUrl = apiUrl + '&owner__username=' + userFilter;
        $.get(apiUrl, function(boards) {
            var showBoards = [];
            // Set which items are editable by the current user
            for (var i=0; i < boards.objects.length; i++)
            {
                if (boards.objects[i].owner.username == currentUser.username)
                {
                    boards.objects[i].editable = true;
                    showBoards.push(boards.objects[i]);
                }
            }
            // Use the fetched tacks as our context for our tacks template
            var template = Handlebars.compile($('#boards-template').html());
            var html = template({boards: showBoards});

            // Append the newly compiled data to our container
            $('#boards').append(html);

            // We need to then wait for images to load in and then tile
            tileLayout('boards', 'board');
            lightbox();
            $('#boards').ajaxStop(function() {
                $('img').load(function() {
                    $(this).fadeIn(300);
                });
            });

            if (boards.objects.length < apiLimitPerPage) {
                $('.spinner').css('display', 'none');
                if ($('#boards').length != 0) {
                    var theEnd = document.createElement('div');
                    theEnd.id = 'the-end';
                    $(theEnd).html('&mdash; End &mdash;');
                    $(theEnd).css('padding', 50);
                    $('body').append(theEnd);
                }
            } else {
                $(window).scroll(scrollHandler);
            }
        });

        // Up our offset, it's currently defined as 50 in our settings
        offset += apiLimitPerPage;
    }

    // Set offset for loadPins and do our initial load
    var offset = 0;
    if(urlName.indexOf('tacks') >= 0)
        loadPins();
    else if (urlName == 'board')
        loadBoards();

    // If our window gets resized keep the tiles looking clean and in our window
    $(window).resize(function() {
        if(urlName.indexOf('tacks') >= 0)
            tileLayout('tacks', 'tack');
        else if (urlName == 'board')
            tileLayout('boards', 'board');
        lightbox();
    })
});
