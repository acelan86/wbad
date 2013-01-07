var profileManager = (function () {
    var key = "wbad",
        profile = {
            url : "http://10.77.6.74:8090/screenshot.php?ad_id="
        };

    return {
        getProfile : function () {
            return {
                url : window.localStorage[key + 'url'] || profile.url
            };
        },
        setProfile : function (url) {
            alert(url)
            window.localStorage[key + 'url'] = url;
        }
    };
})();

function changeState(tabid) {
    chrome.tabs.get(tabid, function (tab) {
        var icon;
        if (tab.url.indexOf('weibo.com') >= 0) {
            icon = './icon_16.png';
            chrome.browserAction.setPopup({
                popup : './popup.html',
                tabId : tab.id
            });
        } else {
            icon = './icon_16_dis.png';
        }
        chrome.browserAction.setIcon({path : icon});
    });
}

chrome.tabs.onUpdated.addListener(changeState);
chrome.tabs.onSelectionChanged.addListener(changeState);