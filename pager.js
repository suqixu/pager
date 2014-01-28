String.prototype.GetPara = function(e) { var svalue = this.match(new RegExp("[\?\&]" + e + "=([^\&]*)(\&?)", "i")); return svalue ? svalue[1] : svalue; };
String.prototype.Format = function() { var t = this; for (var i = 0, j = arguments.length; i < j; i += 1) t = t.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]); return t; };
var eventBind = function eventBind(C, A, B) { if (C.addEventListener) { C.addEventListener(A, B, false) } else { if (C.attachEvent) { C.attachEvent("on" + A, B) } } };

//分页 by zzy 2013-11-30
var pagerUtil = {
    enable: true,
    //设置query参数
    setQuery: function(query, key, value) {
        query = query || '';
        var reg = new RegExp(key + '=\\d+', 'i');
        var keyValue = key + '=' + value;
        var sign = query.indexOf('?') > -1 ? '&' : '?';

        if (reg.test(query)) query = query.replace(reg, keyValue);
        else query += (sign + keyValue);

        return query;
    },
    //获取要跳转的链接
    getHref: function(pageIndex, total) {
        var query = location.search;
        query = pagerUtil.setQuery(query, 't', total);
        query = pagerUtil.setQuery(query, 'p', pageIndex);
        return location.pathname + query;
    },
    //分页文本框输入检查
    check: function(o, total) {
        var succeed = false;
        var value = o.value;
        if (!/^\d+$/.test(value) || value <= 0) o.value = '';
        if (value > total) o.value = total;
        if (o.value >= 1 && o.value <= total) succeed = true;

        return succeed;
    },
    //阻止事件冒泡和浏览器默认行为
    stop: function(event) {
        if (window.event) {
            event.cancelBubble = true;
            window.event.returnValue = false;
        }
        else {
            event.stopPropagation();
            event.preventDefault();
        }
    },
    //分页文本框跳转
    go: function(o, total, event) {
        if (pagerUtil.check(o, total)) {
            event = event || window.event;
            var keyCode = event.which || event.keyCode;

            if (keyCode == 13) {
                pagerUtil.stop(event);
                location.href = pagerUtil.getHref(o.value, total);
            }
        }
    },
    //键盘操作
    keyboard: function(event, index, total) {
        event = event || window.event;
        var keyCode = event.which || event.keyCode;

        if (keyCode == 37) if (pagerUtil.enable) location.href = pagerUtil.getHref(index <= 1 ? total : index - 1, total);
        if (keyCode == 39) if (pagerUtil.enable) location.href = pagerUtil.getHref(index >= total ? 1 : index + 1, total);
    },
    //分页控件
    render: function(pre, next, index, total) {
        if (total <= 1) return '';

        var html = [];
        var minInterval = pre + next + 1;
        var start = index - pre;
        var end = index + next;
        var query = location.search;
        var cur = '<span class="mod_page_on">{0}</span>';
        var etc = '<span class="mod_page_etc">...</span>';
        var go = '<input class="mod_page_turn" type="text" maxlength="3" value="{0}" onkeyup="pagerUtil.check(this,{1});" onkeydown="pagerUtil.go(this,{1},event);"><span class="mod_page_num">/{1}页</span>'.Format(index, total);
        var getA = function(pageIndex, text) { return '<a class="mod_page_lk" href="{0}">{1}</a>'.Format(pagerUtil.getHref(pageIndex, total), text); };

        if (start > total - minInterval) start = total - minInterval;
        if (end < minInterval) end = minInterval;
        if (start < 1) start = 1;
        if (end > total) end = total;
        if (index > 1) html.push(getA(index - 1 < 1 ? 1 : index - 1, '&lt;'));
        if (start > 1) html.push(getA(1, 1));
        if (start > 2) html.push(etc);

        for (var i = start; i <= end; i++) {
            if (i === index) html.push(cur.Format(i));
            else html.push(getA(i, i));
        }

        if (end < total - 1) html.push(etc);
        if (end < total) html.push(getA(total, total));
        html.push(go);
        if (index < total) html.push(getA(index + 1 > total ? total : index + 1, '下一页'));

        return html.join('');
    },
    init: function(pre, next, total) {
        var index = parseInt(location.href.GetPara('p') || 1);
        document.write(pagerUtil.render(pre, next, index, total));
        eventBind(document, 'keydown', function(event) { pagerUtil.keyboard(event, index, total); });
    }
}