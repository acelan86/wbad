var _wbadExt = (function (w, d) {
    var DEFAULT_REPLACE = {
        'wb_relinfo' : function () {
            return '有' + (parseInt(Math.random() * 20, 10) + 1)  + '人对此感兴趣';
        },
        'wb_fy' : 'none',
        'wb_have_social_y' : 'none'
    };

    function insertInterest(html) {
        var panel = document.getElementById('trustPagelet_recom_interestv5'),
            dls = panel.getElementsByTagName('dl'),
            last,
            parent,
            node;
        if (dls && dls.length > 0) {
            last = dls[dls.length - 1],
            parent = last.parentNode,
            node = document.createElement('div');
            node.innerHTML = html;
            parent.insertBefore(node.childNodes[0], last);
            parent.removeChild(last);
            last = null;
        }
    }
    function decodeText(text) {
        return decodeURIComponent(text.replace(/\+/g, ' ')).replace("try{{wb_func}(", '').replace(");}catch(e){}", '');
    }
    function psid2pos(psid) {
        var ads = document.getElementsByTagName('div'),
            i = 0,
            ad;
        while (ad = ads[i++]) {
            var adData = ad.getAttribute('ad-data');
            if (adData && adData.indexOf('&psid=' + psid + '&') >= 0) {
                return ad;
            }
        }
        return null;
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
    return {
        /**
         * 替换广告
         * @param  {String} adid  请求广告id
         * @param  {String} posid 广告位id
         */
        replace : function (url, posid) {
            var el;

            fetchAD(url + '&_rnd=' + (+new Date()), function (text) {
                var json,
                    html;
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    alert("解析返回数据出错：" + text);
                }

                if (json && json.psid && json.creatives && json.creatives[0] && json.creatives[0].html) {
                    if ('string' === typeof json.creatives[0].html) {
                        json.creatives[0].html = {
                            v5 : json.creatives[0].html
                        };
                    }
                    if (json.creatives[0].html.v5) {
                        html = decodeText(json.creatives[0].html.v5);
                        if (json.psid === 'PDPS000000037704') {
                            try {
                                html = JSON.parse(html);
                                //感兴趣的人，二次decode
                                html = decodeText(html.data.html).replace(/\\"/g, '"');
                                insertInterest(parseTemplate(html, DEFAULT_REPLACE));
                            } catch (e) {
                                alert("解析返回数据出错：" + text);
                            }
                        } else if (el = psid2pos(json.psid)) { 
                            html = html.replace(/^'/, '').replace(/'$/, '');
                            el.innerHTML = parseTemplate(html, DEFAULT_REPLACE);
                        }
                    }
                } else {
                    alert('此id无法找到广告或广告数据有误，数据如下：' + text);
                }
            }); 
        }
    };
})(window, document);