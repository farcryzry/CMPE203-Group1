/**
 * Helpers for Pinry
 * Descrip: A hodgepodge of useful things to help clean up Pinry's JavaScript.
 * Authors: Pinry Contributors
 * Updated: Feb 26th, 2013
 * Require: jQuery
 */


function renderTemplate(templateId, context) {
    var template = Handlebars.compile($(templateId).html());
    return template(context);
}


function cleanTags(tags) {
    if (typeof tags === 'string' && tags.length > 0) {
        tags = tags.split(/[\s,]+/);
        for (var i in tags) {
            tags[i] = tags[i].trim();
        }
    } else {
        return [];
    }
    return tags;
}


function getImageData(imageId) {
    var apiUrl = '/api/v1/image/'+imageId+'/?format=json';
    return $.get(apiUrl);
}


function getTackData(tackId) {
    var apiUrl = '/api/v1/tack/'+tackId+'/?format=json';
    return $.get(apiUrl);
}

function getBoardData(boardId) {
    var apiUrl = '/api/v1/board/'+boardId+'/?format=json';
    return $.get(apiUrl);
}

function getBoardListData(userId) {
    var apiUrl = '/api/v1/board/?format=json&owner__id='+ userId +'&order_by=name';
    return $.get(apiUrl);
}

function deleteTackData(tackId) {
    var apiUrl = '/api/v1/tack/'+tackId+'/?format=json';
    return $.ajax(apiUrl, {
        type: 'DELETE'
    });
}

function deleteBoardData(boardId) {
    var apiUrl = '/api/v1/tack/'+boardId+'/?format=json';
    return $.ajax(apiUrl, {
        type: 'DELETE'
    });
}

function postTackData(data) {
    return $.ajax({
        type: "post",
        url: "/api/v1/tack/",
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
}

function postBoardData(data) {
    return $.ajax({
        type: "post",
        url: "/api/v1/board/",
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
}

function getUrlParameter(name) {
    var decode = decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
    if (decode == 'null') return null;
    else return decode;
}
