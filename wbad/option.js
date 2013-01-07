(function (d) {
    var extension = chrome.extension.getBackgroundPage();
        profileManager = extension.profileManager;
    
    var url = d.getElementById('Url'),
        form = d.getElementById('configForm'),
        profile = profileManager.getProfile(),
        info = d.getElementById('info'),
        timer = null;

    url.value = profile.url;

    function showinfo (msg) {
        timer && clearTimeout(timer);
        info.innerHTML = msg;
        info.style.display = 'inline';
        timer = setTimeout(function () {
            info.style.display = 'none';
        }, 2000);
    }

    form.onsubmit = function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.debug(profileManager, url.value);
        profileManager.setProfile(url.value);
        //console.debug(profileManager.getProfile());
        showinfo('已保存');
        return false;
    };
})(document);