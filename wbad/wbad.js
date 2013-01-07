var _wbadExt = (function (w, d) {
    var POSID_MAP = {
        'pl_content_biztips' : {
            'PDPS000000037693' : 1
        },
        'pl_rightmod_ads35' : {
            'PDPS000000037694' : 1
        },
        'pl_bottom' : {
        }
    };
    var defaultReplacer = {
        'wb_relinfo' : function () {
            return '有' + parseInt(Math.random() * 20, 10)  + '人对此感兴趣';
        },
        'wb_fy' : 'none'
    };
    function psid2posid(psid) {
        for (var k in POSID_MAP) {
            if (POSID_MAP[k][psid]) {
                return k;
            }
        }
        return 0;
    }
    function fetchAD(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr.responseText);
                } else {
                    callback(null);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
    };
    function init () {
        var div = d.createElement('div');
        div.innerHTML = "小助手使用中";
        div.style.cssText = "border-radius:2px;margin:2px;opacity:.7;z-index:99999;background-color:#000;color:#fff;padding:6px 10px; position:fixed;right:0px;top:0px;font-size:12px";
        d.body.appendChild(div);
    }
    function parseTemplate(source, data) {
        var toString = Object.prototype.toString,
            data = data || {};
        return source.replace(/\{(.+?)\}/g, function (match, key){
            var replacer = data[key];
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    init();
    return {
        /**
         * 替换广告
         * @param  {String} adid  请求广告id
         * @param  {String} posid 广告位id
         */
        replace : function (url, posid) {
            var el;

            fetchAD(url, function (text) {
                var json,
                    html;
                try {
                    json = JSON.parse(text);
                } catch (e) {}

                if (json && json.psid && json.creatives && json.creatives[0] && json.creatives[0].html) {
                    if ('string' === typeof json.creatives[0].html) {
                        json.creatives[0].html = {
                            v5 : json.creatives[0].html
                        };
                    }
                    if (json.creatives[0].html.v5) {
                        var posid = psid2posid(json.psid);
                        if (posid && (el = document.getElementById(posid)) && (el = el.childNodes[0]) && el.getAttribute('ad-data')) { 
                            html = json.creatives[0].html.v5;
                            el.innerHTML = parseTemplate(decodeURIComponent(html.replace(/\+/g, ' ').replace("try{{wb_func}('", '').replace("');}catch(e){}", '')), defaultReplacer);
                        }
                    }
                } else {
                    alert('此id无法找到广告或广告数据有误，数据如下：' + text);
                }
            }); 
        }
    };
})(window, document);