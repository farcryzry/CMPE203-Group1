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
    function loadCategory() {
        var promise = getCategoryListData();

        promise.success(function(data) {
            var menu='<li><a href="/boards/"> All </a></li>';
            for(var i=0; i< data.objects.length; i++)
                menu = menu + '<li><a href="/boards/category/'+ data.objects[i].name +'/">'+ data.objects[i].name +'</a></li>';
            $('#dropdown-category').html(menu);
        });
    }

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
                'margin-top':  colHeights[sCol]
            });
            block.fadeIn(300);
            colHeights[sCol] += block.height()+(blockMargin);
        }

        // Edit tack if pencil icon clicked
        $('.glyphicon-pencil').each(function() {
            var thisTack = $(this);
            $(this).off('click');
            $(this).click(function() {
                //$(this).off('click');
                tackForm($(this).data('id'));
            });
        });

        // Edit board if edit icon clicked
        $('.glyphicon-edit').each(function() {
            var thisBoard = $(this);
            $(this).off('click');
            $(this).click(function() {
                //$(this).off('click');
                boardForm($(this).data('id'));
            });
        });

        // Delete tack if trash icon clicked
        $('.glyphicon-trash').each(function() {
            var thisTack = $(this);
            $(this).off('click');
            $(this).click(function() {
                //$(this).off('click');
                var promise = deleteTackData($(this).data('id'));
                promise.success(function() {
                    thisTack.closest('.tack').remove();
                    tileLayout('tacks', 'tack');
                });
                promise.error(function() {
                    message('Problem deleting image.', 'alert alert-warning');
                });
            });
        });

        // Delete board if trash icon clicked
        $('.glyphicon-remove').each(function() {
            var thisBoard = $(this);
            $(this).off('click');
            $(this).click(function() {
                //$(this).off('click');
                var promise = deleteBoardData($(this).data('id'));
                promise.success(function() {
                    thisBoard.closest('.board').remove();
                    tileLayout('boards', 'board');
                });
                promise.error(function() {
                    message('Problem deleting board.', 'alert alert-warning');
                });
            });
        });

        // Like tack
        $('.glyphicon-empty-heart').each(function() {
            var thisTack = $(this);
            //$(this).off('click');
            $(this).click(function() {
                //
            });
        });

        // Show edit-buttons only on mouse over
        $('.' + blockClass).each(function(){
            var thisTack = $(this);
            thisTack.find('.editable').hide();
            thisTack.off('hover');
            thisTack.hover(function() {
                thisTack.find('.editable').stop(true, true).fadeIn(300);
            }, function() {
                thisTack.find('.editable').stop(true, false).fadeOut(300);
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
        if(windowPosition > bottom) loadTacks();
    }

    window.boardScrollHandler = function() {
        var windowPosition = $(window).scrollTop() + $(window).height();
        var bottom = $(document).height() - 100;
        if(windowPosition > bottom) loadBoards();
    }

    /**
     * Load our tacks using the tacks template into our UI, be sure to define a
     * offset outside the function to keep a running tally of your location.
     */
    function loadTacks() {
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
            var showTacks = [];
            // Set which items are editable by the current user
            for (var i=0; i < tacks.objects.length; i++)
            {
                if(tacks.objects[i].submitter.username == currentUser.username)
                    tacks.objects[i].editable = true;
                //hide tacks under secret board from other users
                else if(tacks.objects[i].board.secret)
                    continue;
                showTacks.push(tacks.objects[i]);
            }
            // Use the fetched tacks as our context for our tacks template
            var template = Handlebars.compile($('#tacks-template').html());
            var html = template({tacks: showTacks});

            // Append the newly compiled data to our container

            if(tagFilter) {
                $( "#tacks" ).before("<h1 style='text-align:center;margin-bottom:20px'>Tacks Under Tag " + tagFilter + "</h1>");
            }

            if(boardFilter) {
                var promise = getBoardData(boardFilter);
                promise.success(function(board){
                    var btnFollow = "<div style='text-align: center; margin-bottom:20px'><button type='button' class='follow btn btn-primary'>Follow</button>" ;
                    var btnUnfollow = "<div style='text-align: center; margin-bottom:20px'><button type='button' class='unfollow btn btn-primary'>UnFollow</button>";
                    var btn = btnFollow;

                    followingUrl = '/api/v1/following/?format=json&order_by=-id&user__id='+ currentUser.id +'&board__id='+ board.id;
                    $.get(followingUrl, function(following){
                        if(following.objects.length > 0)
                            btn = btnUnfollow;
                        $( "#tacks" ).before("<h1 style='text-align:center'>" + board.name + "</h1>" +
                        "<div class='text' style='text-align:center;margin-bottom:20px'>" + board.description + "</div> " + btn +
                        "<button style='display:none' type='button' class='btn btn-success'>Followers</button></div>");

                        $('.follow').click(function(){
                            alert('follow');
                            var data = {
                                user: '/api/v1/user/' + currentUser.id +'/',
                                board: '/api/v1/board/' + board.id + '/'
                            };
                            var promise = postFollowingData(data);
                            promise.success(function(following) {
                                message('New following added.', 'alert alert-sucess');
                            });
                            promise.error(function() {
                                message('Problem creating new following.', 'alert alert-warning');
                            });
                        });
                        $('.unfollow').click(function(){
                            alert('unfollow');
                            var promise = deleteFollowingData(following.objects[0].id);
                            promise.success(function() {
                                message('Following cancelled.', 'alert alert-sucess');
                            });
                            promise.error(function() {
                                message('Problem deleting board.', 'alert alert-warning');
                            });
                        });
                    });
                });
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

            if (showTacks.length < apiLimitPerPage) {
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

    function updateBoardCover(boardClass) {

        var boards = $(boardClass);

        boards.each(function(){
            var $board = $(this);
            var $count = $board.find('#count-tacks');

            var boardId = $(this).data('id');
            getBoardDataWithCallback(boardId, function(tacks) {
                // Set the latest tack as the cover image
                var coverUrl = '/api/v1/image/17/'; //default image
                var numTacks = tacks.objects.length;
                if (numTacks > 0) {
                    coverUrl = '/api/v1/image/'+tacks.objects[0].image.id+'/';
                }
                var promise = putBoardData(boardId, {cover: coverUrl,
                                                     num_tacks: numTacks});
                    promise.success(function(modifiedBoard) {
                        $board.children('.image-wrapper').css('background-image', 'url(' + modifiedBoard.cover.thumbnail.image + ')');
                        $count.text(modifiedBoard.num_tacks + " tacks");
                    });
                    promise.error(function() {
                        message('Problem updating cover.', 'alert alert-warning');ß
                    });
            });
        });
    }


    function loadBoards() {
        // Disable scroll
        $(window).off('scroll');

        // Show our loading symbol
        $('.spinner').css('display', 'block');

        // Fetch our boards from the api using our current offset
        var apiUrl = '/api/v1/board/?format=json&order_by=-id&offset='+String(offset);
        if (userFilter) apiUrl = apiUrl + '&owner__username=' + userFilter;
        if (categoryFilter) apiUrl = apiUrl + '&category=' + categoryFilter;

        var promise = $.get(apiUrl, function(boards) {
            var showBoards = [];

            var boardOwner = userFilter ? userFilter : currentUser.username;

            for (var i=0; i < boards.objects.length; i++)
            {
                if(boards.objects[i].owner.username == currentUser.username)
                    boards.objects[i].editable = true;
                // hide secret board from other users
                else if(boards.objects[i].secret)
                    continue;
                showBoards.push(boards.objects[i]);
            }

            // Use the fetched tacks as our context for our tacks template
            var template = Handlebars.compile($('#boards-template').html());
            var html = template({boards: showBoards});

            if(userFilter && boardOwner != currentUser.username) {
                $('#boards_title h1').text(boardOwner + "'s Page");
                $('#boards_new a').remove();
                $('#boards_new').html('<button class="btn btn-primary">Follow All</button>');
            }

            if(categoryFilter) {
                $('#boards_title h1').text("Category - " + categoryFilter);
                $('#boards_new a').remove();
            }

            if(!userFilter && !categoryFilter) {
                $('#boards_title h1').text("All Boards");
                $('#boards_new a').remove();
            }

            // Append the newly compiled data to our container
            $('#boards').append(html);

            $('#boards_new #add').click(function(){
                boardForm();
            });


            // We need to then wait for images to load in and then tile
            tileLayout('boards', 'board');
            lightbox();
            $('#boards').ajaxStop(function() {
                $('img').load(function() {
                    $(this).fadeIn(300);
                });
            });

            if (showBoards.length < apiLimitPerPage) {
                $('.spinner').css('display', 'none');
                if ($('#boards').length != 0) {
                    var theEnd = document.createElement('div');
                    theEnd.id = 'the-end';
                    $(theEnd).html('&mdash; End &mdash;');
                    $(theEnd).css('padding', 50);
                    $('body').append(theEnd);
                }
            } else {
                $(window).scroll(boardScrollHandler);
            }
        });

        promise.success(function(){
            //if(userFilter == currentUser.username) {
                updateBoardCover("#boards .board");
           // }
        });

        // Up our offset, it's currently defined as 50 in our settings
        offset += apiLimitPerPage;
    }

    // Set offset for loadTacks and do our initial load
    var offset = 0;
    if(urlName.indexOf('tacks') >= 0) {
        loadTacks();
    }
    else if (urlName.indexOf('boards') >= 0) {
        loadBoards();
    }
    loadCategory();

    // If our window gets resized keep the tiles looking clean and in our window
    $(window).resize(function() {
        if(urlName.indexOf('tacks') >= 0)
            tileLayout('tacks', 'tack');
        else if (urlName == 'board')
            tileLayout('boards', 'board');
        lightbox();
    })
});
