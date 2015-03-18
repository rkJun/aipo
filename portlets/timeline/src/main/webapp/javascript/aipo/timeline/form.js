/*
 * Aipo is a groupware program developed by Aimluck,Inc.
 * Copyright (C) 2004-2011 Aimluck,Inc.
 * http://www.aipo.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

dojo.require("aipo.widget.MemberNormalSelectList");

dojo.provide("aipo.timeline");

aipo.timeline.addHiddenValue = function(form, name, value) {
	if (form[name] && document.getElementsByName(name).item(0)) {
		form[name].value = value;
	} else {
		var q = document.createElement('input');
		q.type = 'hidden';
		q.name = name;
		q.value = value;
		form.appendChild(q);
	}
}

aipo.timeline.addLike = function(form, name, value) {
}

aipo.timeline.showCommentField = function(pid, tid) {
	dojo.byId('comments_' + pid + '_' + tid).style.display = "block";// コメントを開く時は常に
	dojo.query('#comments_' + pid + '_' + tid).removeClass('mb0');
	dojo.byId('commentField_' + pid + '_' + tid).style.display = "";
	dojo.byId('note_' + pid + '_' + tid).focus();
	dojo.byId('note_' + pid + '_' + tid).style.color = 'black';
	var dummy = dojo.byId('commentInputDummy_' + pid + '_' + tid);
	if (typeof dummy != "undefined" && dummy != null) {
		dojo.byId('commentInputDummy_' + pid + '_' + tid).style.display = "none";
	}
}

aipo.timeline.showCommentAll = function(pid, tid) {
	dojo.byId('commentCaption_' + pid + '_' + tid).style.display = "none";
	dojo.query('#comments_' + pid + '_' + tid + ' .message').forEach(
			function(item) {
				item.style.display = "";
			});
}

aipo.timeline.onClick = function(url, pid, page, max) {
	try {
		dojo.xhrPost({
			portletId : pid,
			url : url,
			encoding : "utf-8",
			handleAs : "text",
			headers : {
				X_REQUESTED_WITH : "XMLHttpRequest"
			},
			load : function(data, event) {
				dojo.byId("content_" + pid + "_" + page).removeChild(
						dojo.byId("content_" + pid + "_" + page).children[0]);
				dojo.byId("content_" + pid + "_" + page).removeChild(
						dojo.byId("content_" + pid + "_" + page).children[0]);
				dojo.byId("content_" + pid + "_" + page).removeChild(
						dojo.byId("content_" + pid + "_" + page).children[0]);
				page++;
				dojo.byId("content_" + pid + "_" + page).innerHTML = data;
				if (page == max) {
					dojo.byId("more_" + pid).style.display = "none";
				}
				var obj_indicator = dojo.byId("indicator-dlg2-" + pid);
				if (obj_indicator) {
					dojo.style(obj_indicator, "display", "none");
				}
			}
		});
	} catch (e) {
		alert(e);
	}
}

aipo.timeline.onScroll = function(url, pid, page, max) {
	var scrollTop = dojo.byId("timeline_" + pid).scrollTop;
	var clientHeight = dojo.byId("timeline_" + pid).clientHeight;
	var scrollHeight = dojo.byId("timeline_" + pid).scrollHeight;
	var remain = scrollHeight - clientHeight - scrollTop;
	if (dojo.byId("height_" + pid) == 0 || remain < 5) {
		aipo.timeline.onClick(url, pid, page, max);
	}
}

aipo.timeline.nextThumbnail = function(pid) {
	var page = dojo.byId("TimelinePage_" + pid);
	var value = parseInt(page.value);
	var max = dojo.byId("TimelinePage_" + pid + "_imagesMaxCount").value;
	var maxval = parseInt(max);
	if (value < maxval) {
		dojo.byId("tlClipImage_" + pid + "_1").style.display = "none";
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "none";
		value++;
		page.value = value;
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "";
		dojo.byId("count_" + pid).innerHTML = maxval + " 件中 " + page.value + " 件";
	}
}

aipo.timeline.prevThumbnail = function(pid) {
	var page = dojo.byId("TimelinePage_" + pid);
	var value = parseInt(page.value);
	var max = dojo.byId("TimelinePage_" + pid + "_imagesMaxCount").value
	var maxval = parseInt(max);
	if (value > 1) {
		dojo.byId("tlClipImage_" + pid + "_1").style.display = "none";
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "none";
		value--;
		page.value = value;
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "";
		dojo.byId("count_" + pid).innerHTML = maxval + " 件中 " + page.value
				+ " 件";
	}
}

if (!aipo.timeline.revmaxlist) {
	aipo.timeline.revmaxlist = [];
}

aipo.timeline.refreshImageList = function(pid, i) {
	function showImageList(pid) {
		var page = dojo.byId("TimelinePage_" + pid);
		var value = parseInt(page.value);
		if (aipo.timeline.revmaxlist[pid] > 0) {
			if (dojo.hasClass(dojo.byId("auiSummaryMeta_" + pid),"hide")) {
				document.getElementById("tlClipImage_" + pid + "_1").style.display = "";
				dojo.removeClass(dojo.byId("auiSummaryMeta_" + pid),"hide");
				dojo.removeClass(dojo.byId("ViewThumbnail_" + pid),"hide");
			}
			if (!value) {
				value = 1;
			}
			dojo.byId("count_" + pid).innerHTML = aipo.timeline.revmaxlist[pid]
					+ " 件中 " + value + " 件";
			dojo.byId("TimelinePage_" + pid + "_imagesMaxCount").value = aipo.timeline.revmaxlist[pid];
		}
	}

	var page = dojo.byId("TimelinePage_" + pid);
	var value = parseInt(page.value);
	var max = dojo.byId("TimelinePage_" + pid + "_imagesMaxCount").value;
	var maxval = parseInt(max);
	var revmax = 0;

	var w = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").naturalWidth;
	var h = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").naturalHeight;

	if (dojo.isIE) {
		// IE対応
		var img = new Image();
		img.src = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").src;
		var iew = img.width;
		var ieh = img.height;
		if ((iew > 80) && (ieh > 80)){
			// 描画対象
			if (aipo.timeline.revmaxlist.hasOwnProperty(pid)) {
				revmax = aipo.timeline.revmaxlist[pid];
			}
			revmax++;
			aipo.timeline.revmaxlist[pid] = revmax;

			var info = dojo.byId("tlClipImage_" + pid + "_1_untiview");

			var divNode = document.createElement('div');
			divNode.id = "tlClipImage_" + pid + "_" + revmax;
			divNode.className = "tlClipImage";
			divNode.style.display = "none";

			var imgNode = document.createElement('img');
			imgNode.src = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").src;
			imgNode.name = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").name;

			divNode.appendChild(imgNode);
			info.parentNode.insertBefore(divNode, info);
			var delay = 200;
			setTimeout(function() {
				showImageList(pid);
			}, delay);
		}
	}else if ((w > 80) && (h > 80)){
		// 描画対象
		if (aipo.timeline.revmaxlist.hasOwnProperty(pid)) {
			revmax = aipo.timeline.revmaxlist[pid];
		}
		revmax++;
		aipo.timeline.revmaxlist[pid] = revmax;

		var info = dojo.byId("tlClipImage_" + pid + "_1_untiview");

		var divNode = document.createElement('div');
		divNode.id = "tlClipImage_" + pid + "_" + revmax;
		divNode.className = "tlClipImage";
		divNode.style.display = "none";

		var imgNode = document.createElement('img');
		imgNode.src = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").src;
		imgNode.name = dojo.byId("tlClipImage_" + pid + "_" + i + "_img").name;

		divNode.appendChild(imgNode);
		info.parentNode.insertBefore(divNode, info);
		var delay = 200;
		setTimeout(function() {
			showImageList(pid);
		}, delay);
	}
}

aipo.timeline.getUrl = function(url, pid) {
	try {
		dojo.xhrPost({
			portletId : pid,
			url : dojo.byId("TimelineUrl_" + pid).value,
			content : {
				"url" : url
			},
			encoding : "utf-8",
			handleAs : "text",
			headers : {
				X_REQUESTED_WITH : "XMLHttpRequest"
			},
			load : function(data, event) {
				if (data != "error") {
					dojo.byId("tlInputClip_" + pid).innerHTML = data;
					dojo.byId("flag_" + pid).value = "exist";
				} else {
					dojo.byId("flag_" + pid).value = "forbidden";
				}
			}
		});
	} catch (e) {
		alert(e);
	}

}

if (!aipo.timeline.onloadCountlist) {
	aipo.timeline.onloadCountlist = [];
}
aipo.timeline.onloadImage =function(pid){
	count = 0;
	if (aipo.timeline.onloadCountlist.hasOwnProperty(pid)) {
		count = aipo.timeline.onloadCountlist[pid];
	}
	count++;
	aipo.timeline.onloadCountlist[pid] = count;
	var max = dojo.byId("TimelinePage_" + pid + "_imagesMaxCount").value;
	if(count == max){
		for(var r = 1 ; r <= max ; r++){
			aipo.timeline.refreshImageList(pid,r);
		}
	}
}
aipo.timeline.setScrollTop = function(pid, scrollTop) {
	dojo.byId("timeline_" + pid).scrollTop = scrollTop;
}

aipo.timeline.onKeyUp = function(pid, tid, e) {
	var objId;
	if ((typeof tid !== "undefined") && (tid != null)) {
		objId = "note_" + pid + "_" + tid;
	} else {
		objId = "note_" + pid;
		var keycode;
		if (window.event)
			keycode = window.event.keyCode;
		else if (e)
			keycode = e.which;
		if ((keycode == 13) | (keycode == 32)) {
			var _val = dojo.byId(objId).value;
			if (dojo.byId("flag_" + pid).value == "none") {
				var spritval = _val.split(/\r\n|\n/g);
				for (i in spritval) {
					if (spritval[i].match(/^https?:\/\/[^ 	]/i)) {
						aipo.timeline.getUrl(spritval[i], pid);
						aipo.timeline.revmaxlist[pid] = 0;
					}
				}
			}
		}
	}

	function times(value, length) {
		var returnValue = "";
		var i = 0;
		while (i < length) {
			returnValue = returnValue + value;
			i++;
		}
		return returnValue;
	}

	var val = dojo.byId(objId).value;
	var shadowVal = val.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(
			/&/g, '&amp;').replace(/\n$/, '<br/>&nbsp;')
			.replace(/\n/g, '<br/>').replace(/ {2,}/g, function(space) {
				return times('&nbsp;', space.length) + ' ';
			});

	var shadow = document.createElement("div");
	shadow.id = "shadow"
	shadow.style.position = "absolute";
	shadow.style.top = "-1000";
	shadow.style.left = "-1000";
	shadow.style.border = "0";
	shadow.style.outline = "0";
	shadow.style.lineHeight = "normal";
	shadow.style.height = "auto";
	shadow.style.resize = "none";
	shadow.cols = "10"
	// これが呼ばれる際の入力はまだ入ってこないので、適当に1文字追加
	shadow.innerHTML = shadowVal + "あ";

	var objBody = document.getElementsByTagName("body").item(0);
	objBody.appendChild(shadow);
	dojo.byId("shadow").style.width = document.getElementById(objId).offsetWidth
			+ "px";

	var shadowHeight = document.getElementById("shadow").offsetHeight;

	// 13pxに変更したことにより、"あ"の高さが18→20に変更になった。
	if (shadowHeight < 20)
		shadowHeight = 20;
	dojo.byId(objId).style.height = shadowHeight * 1.0 + 19 + "px";
	objBody.removeChild(shadow);
}

aipo.timeline.onPaste = function(pid, tid, e) {
	setTimeout(function() {
		aipo.timeline.onKeyUp(pid, tid, e);
	}, 100);
}

aipo.timeline.onkeydown =function(pid){
	if(dojo.isSafari){
		var keycode = window.event.keyCode;
		if(keycode== dojo.keys.TAB){
		var	submit =dojo.byId("al_submit_"+pid);
		dojo.stopEvent(window.event);
		 submit.focus();
		}
	}
}
aipo.timeline.lock = false;
aipo.timeline.onReceiveMessage = function(msg) {
	var pid = dojo.byId("getTimelinePortletId").innerHTML;
	if (!msg) {
		var arrDialog = dijit.byId("modalDialog_" + pid);
		if (arrDialog) {
			arrDialog.hide();
		}
		if (!aipo.timeline.lock) {
			aipo.timeline.lock = true;
			aipo.portletReload('timeline');
			aipo.timeline.lock = false;
		}
	} else {
		dojo.byId('getTimelineOnClick').innerHTML = ''
	}
	if (dojo.byId("messageDiv_" + pid)) {
		dojo.byId("messageDiv_" + pid).innerHTML = msg;
	}
}

aipo.timeline.onReceiveMessageToList = function(msg) {
	var pid = dojo.byId("getTimelinePortletId").innerHTML;
	if (!msg) {
		var arrDialog = dijit.byId("modalDialog_" + pid);
		if (arrDialog) {
			arrDialog.hide();
		}
		aipo.portletReload('timeline');
	} else {
		dojo.byId('getTimelineOnClick').innerHTML = ''
	}
	if (dojo.byId("messageDivList_" + pid)) {
		dojo.byId("messageDivList_" + pid).innerHTML = msg;
	}
}

aipo.timeline.onReceiveLikeMessage = function(portletId, timelineId, mode,
		isComment) {
	var pidspan = dojo.byId("getTimelinePortletId");
	if (pidspan == undefined)
		pid = portletId;
	else
		var pid = pidspan.innerHTML;
	var arrDialog = dijit.byId("modalDialog_" + pid);
	if (arrDialog) {
		arrDialog.hide();
	}
	var form = dojo.byId("likeForm_" + portletId + "_" + timelineId);
	var a = dojo.query("#likeForm_" + portletId + "_" + timelineId + " > a")[0];
	var inputname = dojo.query("#likeForm_" + portletId + "_" + timelineId
			+ " > input")[1];
	if (mode == 'like') {
		form.onsubmit = function(event) {
			aimluck.io.submit(form, '', portletId,
					aipo.timeline.onReceiveLikeMessage(portletId, timelineId, 'dislike', isComment))
		}
		var onclick = a.getAttribute("onclick");
		if (typeof onclick == "string") {
			onclick = onclick.replace("\'like\'", "\'dislike\'");
			a.setAttribute("onclick", onclick);
		} else {
			var onclickString = onclick.toString().replace("\'like\'",
					"\'dislike\'");
			onclickString = onclickString.substring(
					onclickString.indexOf("{") + 1, onclickString
							.lastIndexOf("}") - 1);
			a.setAttribute("onclick", new Function(onclickString));
		}
		a.innerHTML = "いいね！を取り消す";
		if (isComment) {
			aipo.timeline.increaseComLikeValue(portletId, timelineId);
		} else {
			aipo.timeline.increaseLikeValue(portletId, timelineId);
		}
	} else if (mode == 'dislike') {
		form.onsubmit = function(event) {
			aimluck.io.submit(form, '', portletId,
					aipo.timeline.onReceiveLikeMessage(portletId, timelineId, 'like', isComment))
		}
		var onclick = a.getAttribute("onclick");
		if (typeof onclick == "string") {
			onclick = onclick.replace("\'dislike\'", "\'like\'");
			a.setAttribute("onclick", onclick);
		} else {
			var onclickString = onclick.toString().replace("\'dislike\'",
					"\'like\'");
			onclickString = onclickString.substring(
					onclickString.indexOf("{") + 1, onclickString
							.lastIndexOf("}") - 1);
			a.setAttribute("onclick", new Function(onclickString));
		}
		a.innerHTML = "いいね！";
		if (isComment) {
			aipo.timeline.decreaseComLikeValue(portletId, timelineId);
		} else {
			aipo.timeline.decreaseLikeValue(portletId, timelineId);
		}
	}
}

aipo.timeline.increaseLikeValue = function(portletId, timelineId) {
	var div = dojo.query("#like_" + portletId + "_" + timelineId)[0];
	var a = dojo.query("#like_" + portletId + "_" + timelineId + " > a")[0];
	if (dojo.isFF > 0) {
		var likeLinkString = a.textContent; // FirefoxではinnerTextが動作しないため
	} else {
		var likeLinkString = a.innerText;
	}
	var likeNum = parseInt(likeLinkString.substring(0,
			likeLinkString.length - 1)) + 1;
	if (div.style.display == 'none') {
		if (div.parentElement.nextElementSibling == null) {
			div.parentElement.className = "comments";
		} else if (div.parentElement.nextElementSibling.tagName == "P") {
			div.parentElement.className = "comments";
		}
		div.style.display = '';
	}
	if (dojo.isFF > 0) {
		a.textContent = likeNum
				+ likeLinkString.charAt(likeLinkString.length - 1); // FirefoxではinnerTextが動作しないため
	} else {
		a.innerText = likeNum
				+ likeLinkString.charAt(likeLinkString.length - 1);
	}
}

aipo.timeline.increaseComLikeValue = function(portletId, timelineId) {
	var a = dojo.query("#likeCount_" + portletId + "_" + timelineId)[0];
	if (dojo.isFF > 0) {
		var likeLinkString = a.textContent; // FirefoxではinnerTextが動作しないため
	} else {
		var likeLinkString = a.innerText;
	}
	var likeNum = parseInt(likeLinkString) + 1;
	if (a.style.display == 'none') {
		a.style.display = '';
		likeNum = 1;
	}
	if (dojo.isFF > 0) {
		a.innerHTML = a.innerHTML.replace(a.textContent, likeNum); // FirefoxではinnerTextが動作しないため
	} else {
		a.innerHTML = a.innerHTML.replace(a.innerText, likeNum);
	}
}

aipo.timeline.decreaseLikeValue = function(portletId, timelineId) {
	var a = dojo.query("#like_" + portletId + "_" + timelineId + " > a")[0];
	if (dojo.isFF > 0) {
		var likeLinkString = a.textContent; // FirefoxではinnerTextが動作しないため
	} else {
		var likeLinkString = a.innerText;
	}
	var likeNum = parseInt(likeLinkString.substring(0,
			likeLinkString.length - 1)) - 1;
	if (likeNum <= 0) {
		a.parentElement.style.display = 'none';
	}
	if (dojo.isFF > 0) {
		a.textContent = likeNum
				+ likeLinkString.charAt(likeLinkString.length - 1); // FirefoxではinnerTextが動作しないため
	} else {
		a.innerText = likeNum
				+ likeLinkString.charAt(likeLinkString.length - 1);
	}
}

aipo.timeline.decreaseComLikeValue = function(portletId, timelineId) {
	var a = dojo.query("#likeCount_" + portletId + "_" + timelineId)[0];
	if (dojo.isFF > 0) {
		var likeLinkString = a.textContent; // FirefoxではinnerTextが動作しないため
	} else {
		var likeLinkString = a.innerText;
	}
	var likeNum = parseInt(likeLinkString) - 1;
	if (likeNum <= 0) {
		a.style.display = 'none';
	}
	if (dojo.isFF > 0) {
		a.innerHTML = a.innerHTML.replace(a.textContent, likeNum); // FirefoxではinnerTextが動作しないため
	} else {
		a.innerHTML = a.innerHTML.replace(a.innerText, likeNum);
	}
}

aipo.timeline.onListReceiveMessage = function(msg) {
	if (!msg) {
		var arrDialog = dijit.byId("modalDialog");
		if (arrDialog) {
			arrDialog.hide();
		}
		aipo.portletReload('timeline');
	}
	if (dojo.byId('listmessageDiv')) {
		dojo.byId('listmessageDiv').innerHTML = msg;
	}
}

aipo.timeline.hideDialog = function() {
	var arrDialog = dijit.byId("modalDialog");
	if (arrDialog) {
		arrDialog.hide();
	}
	aipo.portletReload('timeline');
}

aipo.timeline.ellipse_message = function(_this) {
	var p = _this.parentElement;
	var body = p.parentElement;
	dojo.query(p).addClass("opened");
	dojo.query(".text_exposed_show", body).removeClass("ellipsis");
}

aipo.timeline.onFocus = function(pid) {
	dojo.byId("guide_" + pid).style.display = "none"
}

aipo.timeline.onBlur = function(pid) {
	var note = dojo.byId("note_" + pid);
	if (note.value == '') {
		dojo.byId("guide_" + pid).style.display = ""
	}
}

aipo.timeline.onBlurCommentField = function(pid, tid) {
	var note = dojo.byId("note_" + pid + "_" + tid);
	var dummy = dojo.byId('commentInputDummy_' + pid + '_' + tid);
	var field = dojo.byId('commentField_' + pid + '_' + tid);

	if (note.value == '') {
		note.value = dojo.byId("note_" + pid + "_" + tid).defaultValue;
		dummy.style.display = "";
		field.style.display = "none";
	}
}

aipo.timeline.addText = function(form, pid) {
	if (dojo.byId("tlInputClip_" + pid).innerHTML.length > 1) {
		var page = dojo.byId("TimelinePage_" + pid);
		if (dojo.byId("tlClipImage_" + pid + "_" + page.value) != null
				&& dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display != "none") {
			aipo.timeline
					.addHiddenValue(
							form,
							"tlClipImage",
							dojo.byId("tlClipImage_" + pid + "_" + page.value).children[0].name);
		}
		if (dojo.byId("tlClipUrl_" + pid).children[0].innerHTML) {
			aipo.timeline.addHiddenValue(form, "tlClipUrl", dojo
					.byId("tlClipUrl_" + pid).children[0].getAttribute("href"));
		}
	}
}

aipo.timeline.viewThumbnail = function(pid) {
	var page = dojo.byId("TimelinePage_" + pid);
	var value = parseInt(page.value);
	if (dojo.byId("checkbox_" + pid).checked) {
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "none";
		dojo.addClass(dojo.byId("auiSummaryMeta_" + pid),"hide");
	} else {
		dojo.byId("tlClipImage_" + pid + "_" + page.value).style.display = "";
		dojo.removeClass(dojo.byId("auiSummaryMeta_" + pid),"hide");
	}
}

aipo.timeline.deleteClip = function(pid) {
	dojo.byId("tlInputClip_" + pid).innerHTML = "";
	dojo.byId("flag_" + pid).value = "forbidden";
}

aipo.timeline.submit = function(form, indicator_id, pid, callback, cnt) {
	var note = dojo.byId('note_' + pid);
	if (dojo.byId(indicator_id + pid).style.display == "none" || cnt >= 8) {
		aimluck.io.createSelectFromFileList(form, pid);
		if (note.value != note.defaultValue) {
			aimluck.io.submit(form, indicator_id, pid, callback);
		}
	} else {
		setTimeout(function() {
			aipo.timeline.submit(form, indicator_id, pid, callback, cnt + 1)
		}, Math.pow(2, cnt) * 1000);
	}
}

aipo.timeline.write = function(inthis, indicator_id, pid) {
	aipo.timeline.addText(dojo.byId('form' + pid), pid);
	aipo.timeline.addHiddenValue(dojo.byId('form' + pid), 'mode', 'insert');
	aimluck.io.setHiddenValue(inthis);
	// 投稿中に、自分のポストを新着と勘違いするのを防ぐ
	dojo.byId('getTimelineOnClick').innerHTML = 'true';
}

aipo.timeline.setMinHeight = function(pid) {
	var min = 0;
	if (document.all) {
		min += (document.documentElement.clientHeight - dojo.byId(
				"message_" + pid).getBoundingClientRect().top);
	} else {
		min += (innerHeight - dojo.byId("message_" + pid)
				.getBoundingClientRect().top);
	}
	dojo.byId("message_" + pid).style.minHeight = min + "px";
}
aipo.timeline.changeDisplayCallback = function(pid) {
	if (dojo.byId('menubar_tlDisplayChanger_' + pid).style.display == 'none') {
		dojo.byId('menubar_tlDisplayChanger_' + pid).style.display = 'block';
	} else {
		dojo.byId('menubar_tlDisplayChanger_' + pid).style.display = 'none';
	}
}

aipo.timeline.changeDisplay = function(pid) {
	if (dojo.byId('menubar_tlDisplayChanger_' + pid).style.display == 'none') {
		setTimeout(function() {
			aipo.timeline.changeDisplayCallback(pid);
		}, 0);
	} else {
		aipo.timeline.changeDisplayCallback(pid);
	}
}

aipo.timeline.getNewMessage = function(url, pid) {
	var obj_message = dojo.byId('newMessage_' + pid);
	if (obj_message) {
		dojo.style(obj_message, "display", "none");
	}
	try {
		dojo.xhrPost({
			portletId : pid,
			url : url,
			content : {
				lastTimelineId : dojo.byId("last_timelineId_" + pid).value
			},
			encoding : "utf-8",
			handleAs : "text",
			headers : {
				X_REQUESTED_WITH : "XMLHttpRequest"
			},
			load : function(data, event) {
				dojo.query(".message.first").removeClass("first");
				if (data.length > 0) {
					var obj = dojo.byId("timeline_" + pid);
					var node = document.createElement("div");
					node.innerHTML = data;
					obj.insertBefore(node, obj.childNodes[1]);
				}
			}
		});
	} catch (e) {
		alert(e);
	}
}

aipo.timeline.displayIndicator = function(url, portletId, indicator_id, post) {
	dojo.byId("tlDisplayGroup_" + portletId).innerHTML = dojo.byId("PostName_"
			+ portletId + "_" + post).innerHTML;

	var obj_indicator = dojo.byId(indicator_id + portletId);
	if (obj_indicator) {
		dojo.style(obj_indicator, "display", "");
	}

	aipo.viewPage(url, portletId);

	obj_indicator = dojo.byId(indicator_id + portletId);
}

aipo.timeline.displayIndicatorNotViewPage = function(portletId, indicator_id) {
	var obj_indicator = dojo.byId(indicator_id + portletId);
	if (obj_indicator) {
		dojo.style(obj_indicator, "display", "");
	}

	obj_indicator = dojo.byId(indicator_id + portletId);
}

aipo.timeline.resizeThumbnailTag = function(elem) {
	function getImage(src) {
		var img = new Image();
		img.src = src;
		return img;
	}
	var img = getImage(elem.src);
	if (img.width > 0 && img.width < 86) {
		dojo.style(elem, 'width', img.width + 'px');
		dojo.style(elem, 'padding', '0 ' + (86 - img.width) / 2 + 'px');
	}
	dojo.style(elem, 'visibility', 'visible');
};

aipo.timeline.inactiveFileAttachments = function(pid) {
	// ファイルアップロードのあるダイアログと競合するためidを一時的に変更
	var obj = dojo.byId("attachments_" + pid);
	if (obj)
		obj.id = "attachments_" + pid + "-dialog";

	obj = dojo.byId("folderName_" + pid);
	if (obj)
		obj.id = "folderName_" + pid + "-dialog";
};

aipo.timeline.activeFileAttachments = function(pid) {
	// dialogを閉じた時に呼び出される。
	// idを元に戻す
	var obj = dojo.byId("attachments_" + pid + "-dialog");
	if (obj)
		obj.id = "attachments_" + pid;

	obj = dojo.byId("folderName_" + pid + "-dialog");
	if (obj)
		obj.id = "folderName_" + pid;
};
