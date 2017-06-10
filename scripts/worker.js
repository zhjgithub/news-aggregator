addEventListener('message', function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', e.data.url, true);
    xhr.responseType = 'json';
    xhr.onload = function(evt) {
        postMessage({callbackID: e.data.callbackID, response: evt.target.response});
    };
    xhr.send();
});