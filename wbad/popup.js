(function (d) {
    var extension = chrome.extension.getBackgroundPage(),
        profileManager = extension.profileManager,
        id = d.getElementById('AdId'),
        form = d.getElementById('SubmitForm');
    form.onsubmit = function (e) {
        e.stopPropagation();
        e.preventDefault();
        chrome.tabs.executeScript(null, {code:"window._wbadExt.replace('" + profileManager.getProfile().url + id.value + "');"});
        window.close();
        return false;
    };
})(document);