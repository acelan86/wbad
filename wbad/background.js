var profileManager = (function () {
    var key = "wbad",
        profile = {
            url : "http://10.77.6.74:8090/screenshot.php?ad_id="
        };

    return {
        getProfile : function () {
            return {
                //pageSize : parseInt(window.localStorage[key + 'pageSize'], 10) || profile.pageSize,
                url : window.localStorage[key + 'url'] || profile.url
            };
        },
        setProfile : function (url) {
            alert(url)
            window.localStorage[key + 'url'] = url;
            //window.localStorage[key + 'pageSize'] = parseInt(pageSize, 10);
        }
    };
})();

chrome.tabs.onSelectionChanged.addListener(function(tabid) {
    chrome.tabs.get(tabid, function (tab) {
        var icon = tab.url.indexOf('weibo.com') >= 0 ? './icon_16.png' : './icon_16_dis.png';
        chrome.browserAction.setIcon({path : icon});
    });
});
chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf('weibo.com') >= 0) {
        chrome.browserAction.setPopup({
            popup : './popup.html',
            tabId : tab.id
        });
    }
});
