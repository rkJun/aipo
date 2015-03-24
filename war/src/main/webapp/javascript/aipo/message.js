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

dojo.provide("aipo.message");

aipo.message.currentRoomId = null;
aipo.message.tmpRoomId = null;
aipo.message.tmpPortletTitle = null;
aipo.message.currentUserId = null;
aipo.message.currentGroupName = "all";
aipo.message.currentRoomSearchKeyword = null;
aipo.message.currentUserSearchKeyword = null;
aipo.message.moreMessageLock = false;
aipo.message.isActive = true;
aipo.message.portletId = null;
aipo.message.jslink = null;
aipo.message.isMobile = false;
aipo.message.isInit = false;
aipo.message.isDirect = false;

aipo.message.setup = function(portletId, jslink, isMobile) {
    aipo.message.portletId = portletId;
    aipo.message.jslink = jslink;
    aipo.message.isMobile = isMobile;
}

aipo.message.init = function(portletId, jslink, isMobile) {
    aipo.message.portletId = portletId;
    aipo.message.jslink = jslink;
    aipo.message.isMobile = isMobile;
    if(!aipo.message.isMobile) {
       dojo.connect(window, "onresize", null, function(e) {
           aipo.message.fixMessageWindow();
       });
    }
    dojo.connect(window, "onfocus", null, function(e) {
        aipo.message.isActive = true;
        if (aipo.message.isOpenWindow()
                && aipo.message.currentRoomId && !aipo.message.moreMessageLock) {
            aipo.message.latestMessageList();
        }
    });
    dojo.connect(window, "onblur", null, function(e) {
        aipo.message.isActive = false;
        //
    });
    var messagePane = dojo.byId("messagePane");
    if (messagePane) {
        dojo
                .connect(aipo.message.isMobile ? window : messagePane, "onscroll", null,
                        function(e) {
                            if (e.target.scrollTop + messagePane.clientHeight
                                    + 100 >= e.target.scrollHeight
                                    && !aipo.message.moreMessageLock) {
                                aipo.message.moreMessageList();
                            }
                        });
    }
    aipo.message.reloadRoomList();
    aipo.message.isInit = true;
}

aipo.message.messagePane = null;
aipo.message.reloadMessageList = function() {
    if (!aipo.message.messagePane) {
        aipo.message.messagePane = dijit.byId("messagePane");
        aipo.message.messagePane = new aimluck.widget.Contentpane({},
                'messagePane');
        aipo.message.messagePane.onLoad = function() {
            aipo.message.read(aipo.message.currentRoomId);
        }
    }

    dojo.byId("messagePane").innerHTML = '<div class="loader"><i class="indicator"></i></div>';
    var screen = aipo.message.jslink + "?template=MessageListScreen";
    if (aipo.message.currentRoomId) {
        screen += "&r=" + aipo.message.currentRoomId;
    } else if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }
    aipo.message.moreMessageLock = false;
    aipo.message.messagePane.viewPage(screen);
}

aipo.message.roomMemberPane = null;
aipo.message.reloadRoomMemberList = function() {
    if (!aipo.message.roomMemberPane) {
        aipo.message.roomMemberPane = dijit.byId("roomMemberPane");
        aipo.message.roomMemberPane = new aimluck.widget.Contentpane({},
                'roomMemberPane');
        aipo.message.roomMemberPane.onLoad = function() {

        }
    }

    dojo.byId("roomMemberPane").innerHTML = '';
    var screen = aipo.message.jslink + "?template=MessageRoomMemberListScreen";
    if (aipo.message.currentRoomId) {
        screen += "&r=" + aipo.message.currentRoomId;
    } else if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }
    aipo.message.roomMemberPane.viewPage(screen);
}
aipo.message.moreMessageList = function() {
    var screen = aipo.message.jslink + "?template=MessageListScreen";
    if (aipo.message.currentRoomId) {
        screen += "&r=" + aipo.message.currentRoomId;
    } else if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }
    var cursor = aipo.message.getLastMessageId();
    if (cursor) {
        aipo.message.moreMessageLock = true;
        screen += "&c=" + cursor;
        screen += "&js_peid=" + aipo.message.portletId;
        dojo.xhrGet({
            url : screen,
            timeout : 30000,
            encoding : "utf-8",
            handleAs : "text",
            headers : {
                X_REQUESTED_WITH : "XMLHttpRequest"
            },
            load : function(response, ioArgs) {
                var messagePane = dojo.byId("messagePane");
                if(messagePane) {
                    messagePane.innerHTML += response;
                    if(messagePane.children.length > 1) {
                        var emptyMessage = dojo.query("#messagePane .emptyMessage");
                        if(emptyMessage.length == 1) {
                            emptyMessage[0].parentNode.removeChild(emptyMessage[0]);
                        }
                    }
                }
                aipo.message.moreMessageLock = false;
            },
            error : function(error) {
                aipo.message.moreMessageLock = false;
            }
        });
    }
}

aipo.message.latestMessageList = function() {
    var screen = aipo.message.jslink + "?template=MessageListScreen";
    if (aipo.message.currentRoomId) {
        screen += "&r=" + aipo.message.currentRoomId;
    } else if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }
    var cursor = aipo.message.getFirstMessageId();
    if(!cursor) {
        cursor = 0;
    }
    aipo.message.moreMessageLock = true;
    screen += "&c=" + cursor;
    screen += "&latest=1";
    screen += "&js_peid=" + aipo.message.portletId;
    dojo.xhrGet({
        url : screen,
        timeout : 30000,
        encoding : "utf-8",
        handleAs : "text",
        headers : {
            X_REQUESTED_WITH : "XMLHttpRequest"
        },
        load : function(response, ioArgs) {
            var messagePane = dojo.byId("messagePane");
            if(messagePane) {
                messagePane.innerHTML = response + messagePane.innerHTML;
                if(messagePane.children.length > 1) {
                    var emptyMessage = dojo.query("#messagePane .emptyMessage");
                    if(emptyMessage.length == 1) {
                        emptyMessage[0].parentNode.removeChild(emptyMessage[0]);
                    }
                }
            }
            aipo.message.moreMessageLock = false;
            aipo.message.reloadRoomList();
        },
        error : function(error) {
            aipo.message.moreMessageLock = false;
        }
    });
}

aipo.message.messageRoomListPane = null;
aipo.message.reloadRoomList = function(roomId, userId) {
    if (!aipo.message.messageRoomListPane) {
        aipo.message.messageRoomListPane = dijit.byId("messageRoomListPane");
        aipo.message.messageRoomListPane = new aimluck.widget.Contentpane({},
                'messageRoomListPane');
        aipo.message.messageRoomListPane.onLoad = function() {
            aipo.message.fixMessageWindow();
            var messageTotalUnreadCountValue = dojo
                    .byId("messageTotalUnreadCountValue");
            var count = parseInt(messageTotalUnreadCountValue.innerHTML);
            if (count != NaN) {
                aipo.menu.message.count(count);
                aipo.menu.updateTitle();
            }
            if (aipo.message.messageRoomListPane.roomId) {
                aipo.message
                        .selectRoom(aipo.message.messageRoomListPane.roomId);
                aipo.message.messageRoomListPane.roomId = null;
            }
            if (aipo.message.messageRoomListPane.userId) {
                var messageCurrentRoomValue = dojo
                        .byId("messageCurrentRoomValue");
                var currentRoomId = parseInt(messageCurrentRoomValue.innerHTML);
                if (currentRoomId != NaN) {
                    aipo.message.selectRoom(currentRoomId);
                } else {
                    aipo.message.selectRoom(0);
                }
                aipo.message.messageRoomListPane.userId = null;
            }
            if(aipo.message.isDirect) {
            	aipo.message.reloadUserList();
            }
        }
    }

    if (roomId) {
        aipo.message.messageRoomListPane.roomId = roomId;
    }
    if (userId) {
        aipo.message.messageRoomListPane.userId = userId;
    }

    var screen = aipo.message.jslink + "?template=MessageRoomListScreen";
    if (aipo.message.currentRoomId) {
        screen += "&r=" + aipo.message.currentRoomId;
    } else if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }
    if (aipo.message.currentRoomSearchKeyword) {
        aipo.message.messageRoomListPane.setParam("k", aipo.message.currentRoomSearchKeyword);
    }
    aipo.message.messageRoomListPane.viewPage(screen);
}
aipo.message.searchRoomList = function(form) {
    aipo.message.currentRoomSearchKeyword = form.keyword.value;
    aipo.message.reloadRoomList();
}

aipo.message.clearSearchRoomList = function() {
    var messageRoomSearchForm = dojo.byId("messageRoomSearchForm");
    if(messageRoomSearchForm) {
        messageRoomSearchForm.keyword.value = "";
        aipo.message.searchRoomList(messageRoomSearchForm);
    }
}

aipo.message.messageUserListPane = null;
aipo.message.reloadUserList = function(group_name) {
    if (!aipo.message.messageUserListPane) {
        aipo.message.messageUserListPane = dijit.byId("messageUserListPane");
        aipo.message.messageUserListPane = new aimluck.widget.Contentpane({},
                'messageUserListPane');
        aipo.message.messageUserListPane.onLoad = function() {
            aipo.message.fixMessageWindow();
            if(aipo.message.isDirect) {
            	aipo.message.isDirect = false;
            	aipo.message.selectUser(aipo.message.currentUserId);
            	dojo.byId("messageUserlist").scrollTop = dojo.byId("messageUser" + aipo.message.currentUserId).offsetTop - dojo.byId("messageUserlist").offsetTop
            }
        }
    }

    if (group_name) {
        aipo.message.currentGroupName = group_name;
    }

    var screen = aipo.message.jslink + "?template=MessageUserListScreen&target_group_name="
            + aipo.message.currentGroupName;
    if (aipo.message.currentUserSearchKeyword) {
        aipo.message.messageUserListPane.setParam("k", aipo.message.currentUserSearchKeyword);
    }
    if (aipo.message.currentUserId) {
        screen += "&u=" + aipo.message.currentUserId;
    }

    aipo.message.messageUserListPane.viewPage(screen);
}

aipo.message.searchUserList = function() {
    var messageUserGroupSelect = dojo.byId("messageUserGroupSelect");
    var messageUserSearchForm = dojo.byId("messageUserSearchForm");
    aipo.message.currentUserSearchKeyword = messageUserSearchForm.keyword.value;
    aipo.message
            .reloadUserList(messageUserGroupSelect.options[messageUserGroupSelect.selectedIndex].value);
}

aipo.message.clearSearchUserList = function() {
    var messageUserSearchForm = dojo.byId("messageUserSearchForm");
    if(messageUserSearchForm) {
        messageUserSearchForm.keyword.value = "";
        aipo.message.searchUserList();
    }
}

aipo.message.updateReadCount = function(roomId) {
    if(roomId == aipo.message.currentRoomId) {
        var url = aipo.message.jslink + "?template=MessageReadCountListJSONScreen";
        url += "&r=" + roomId;
        url += "&max=" + aipo.message.getFirstMessageId();
        url += "&min=" + aipo.message.getLastMessageId();
        url += "&js_peid=" + aipo.message.portletId;
        dojo.xhrGet({
            url : url,
            timeout : 30000,
            encoding: "utf-8",
            handleAs: "json-comment-filtered",
            headers : {
                X_REQUESTED_WITH : "XMLHttpRequest"
            },
            load : function(response, ioArgs) {
                for(read in response) {
                    var messageReadCount = dojo.byId("messageReadCount" + read);
                    if(messageReadCount) {
                        if(response[read] == -1 || response[read] == "-1") {
                            messageReadCount.innerHTML = aimluck.io.escapeText("message_val_all_read");
                        } else {
                            messageReadCount.innerHTML = response[read] + aimluck.io.escapeText("message_val_read");
                        }
                    }
                }
            },
            error : function(error) {

            }
        });
    }
}

aipo.message.updateUnreadCount = function() {
    var url = aipo.message.jslink + "?template=MessageUnreadCountJSONScreen";
    dojo.xhrGet({
        url : url,
        timeout : 30000,
        encoding: "utf-8",
        handleAs: "json-comment-filtered",
        headers : {
            X_REQUESTED_WITH : "XMLHttpRequest"
        },
        load : function(response, ioArgs) {
            var unreadCount = response.unreadCount;
            if(!isNaN(unreadCount)) {
                aipo.menu.message.count(unreadCount);
                aipo.menu.updateTitle();
            }
        },
        error : function(error) {

        }
    });
}

aipo.message.swapView = function() {
    if (dojo.byId("portletsBody") && dojo.byId("dd_message")) {
        if (dojo.hasClass("dd_message", "open")) {
            dojo.byId("portletsBody").style.display = "none";
            aipo.message.fixMessageWindow();
            aipo.message.focusInput();
            if (aipo.message.isOpenWindow()
                    && aipo.message.currentRoomId && !aipo.message.moreMessageLock) {
                aipo.message.latestMessageList();
            }
        } else {
            dojo.byId("portletsBody").style.display = "";
        }
    }
}

aipo.message.selectTab = function(tab) {
    var messageRoomTab = dojo.byId("messageRoomTab");
    var messageUserTab = dojo.byId("messageUserTab");
    var messageRoomContents = dojo.byId("messageRoomContents");
    var messageUserContents = dojo.byId("messageUserContents");

    if ("room" == tab) {
        if(aipo.message.currentUserId && !aipo.message.tmpRoomId) {
            aipo.message.unselectRoom();
        }
        aipo.message.currentUserId = null;
        if(aipo.message.tmpRoomId) {
            aipo.message.selectRoom(aipo.message.tmpRoomId);
            aipo.message.tmpRoomId = null;
        }

        dojo.query(".messageUserlist li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });

        dojo.addClass(messageRoomTab, "active");
        dojo.removeClass(messageUserTab, "active");
        dojo.addClass(messageRoomContents, "active");
        dojo.removeClass(messageUserContents, "active");
    }

    if ("user" == tab) {
        dojo.query(".messageUserlist li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });

        dojo.addClass(messageUserTab, "active");
        dojo.removeClass(messageRoomTab, "active");
        dojo.addClass(messageUserContents, "active");
        dojo.removeClass(messageRoomContents, "active");

        aipo.message.reloadUserList();

    }
}

aipo.message.inputHistory = {};
aipo.message.selectRoom = function(room_id) {
    var messageSideBlock = dojo.byId("messageSideBlock");
    var messageMainBlock = dojo.byId("messageMainBlock");
    var messageMainBlockEmpty = dojo.byId("messageMainBlockEmpty");
    var messageForm = dojo.byId("messageForm");
    var messageRoom = dojo.byId("messageRoom" + room_id);
    var messageRoomType = dojo.byId("messageRoomType" + room_id);
    var messageRoomAvatar = dojo.byId("messageRoomAvatar");
    var messageRoomName = dojo.byId("messageRoomName");
    var messageRoomSetting = dojo.byId("messageRoomSetting");
    if (messageForm && messageRoom) {
        if(aipo.message.isMobile) {
            dojo.removeClass(document.body, "messageRoomList");
        }
        messageMainBlock.style.display = "";
        if(messageMainBlockEmpty) {
            messageMainBlockEmpty.style.display = "none";
        } else {
            messageSideBlock.style.display = "none";
        }
        aipo.message.inputHistory[aipo.message.currentRoomId] = messageForm.message.value;
        aipo.message.currentRoomId = room_id;
        dojo.query(".messageSummary li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });
        if(!aipo.message.isMobile) {
            dojo.addClass(messageRoom, "active");
        }
        if (aipo.message.inputHistory[aipo.message.currentRoomId]) {
            aipo.message
                    .changeInput(aipo.message.inputHistory[aipo.message.currentRoomId]);
        } else {
            aipo.message.clearInput();
        }

        if(aipo.message.isMobile) {
            var roomTitle = dojo.query("#messageRoom" + room_id + " .name");
            if(roomTitle && roomTitle[0]) {
                if(!aipo.message.tmpPortletTitle) {
                    aipo.message.tmpPortletTitle = dojo.byId("portletTitle").innerHTML;
                }
                dojo.byId("portletTitle").innerHTML = roomTitle[0].innerHTML;
            }
        }

        messageRoomSetting.style.display = "G" == messageRoomType.innerHTML ? ""
                : "none";
        dojo.style(dojo.byId("messageInputAttachment"), "display", "none");
        dojo.byId("attachments_global-" + aipo.message.portletId).innerHTML="";

        if (room_id == 0 && aipo.message.currentUserId) {
            messageForm.roomId.value = 0;
            messageForm.userId.value = aipo.message.currentUserId;
        } else {
            messageForm.userId.value = 0;
            messageForm.roomId.value = aipo.message.currentRoomId;
        }

        aipo.message.reloadRoomMemberList();
        aipo.message.reloadMessageList();
    }
}

aipo.message.unselectRoom = function() {
    var messageMainBlock = dojo.byId("messageMainBlock");
    var messageMainBlockEmpty = dojo.byId("messageMainBlockEmpty");
    var messageForm = dojo.byId("messageForm");
    if (messageForm) {
        if(aipo.message.isMobile) {
            dojo.addClass(document.body, "messageRoomList");
        }
        dojo.query(".messageSummary li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });
        dojo.query(".messageUserlist li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });
        aipo.message.clearInput();
        if(messageMainBlockEmpty) {
            messageMainBlockEmpty.style.display = "";
        } else {
            messageSideBlock.style.display = "";
        }
        messageMainBlock.style.display = "none";

        if(aipo.message.isMobile) {
            if(aipo.message.tmpPortletTitle) {
                dojo.byId("portletTitle").innerHTML = aipo.message.tmpPortletTitle;
            }
        }

        aipo.message.currentRoomId = null;
        aipo.message.currentUserId = null;

    }
}

aipo.message.selectUser = function(user_id) {
    var messageForm = dojo.byId("messageForm");
    var messageUser = dojo.byId("messageUser" + user_id);
    if (messageForm && messageUser) {
        if(aipo.message.currentRoomId) {
            aipo.message.tmpRoomId = aipo.message.currentRoomId;
        }
        aipo.message.currentRoomId = 0;
        aipo.message.currentUserId = user_id;
        aipo.message.inputHistory[aipo.message.currentRoomId] = messageForm.message.value;
        aipo.message.inputHistory[0] = "";
        dojo.query(".messageUserlist li").forEach(function(item) {
            dojo.removeClass(item, "active")
        });
        if(!aipo.message.isMobile) {
            dojo.addClass(messageUser, "active");
        }
        aipo.message.reloadRoomList(null, user_id);
    }
}

aipo.message.changeInput = function(value) {
    var messageForm = dojo.byId("messageForm");
    if (messageForm) {
        messageForm.message.value = value;
        aipo.message.resizeInput(messageForm.message);
        aipo.message.focusInput();
    }
}

aipo.message.clearInput = function() {
    var messageForm = dojo.byId("messageForm");
    if (messageForm) {
        messageForm.message.value = "";
        aipo.message.resizeInput(messageForm.message);
        aipo.message.focusInput();
    }
}

aipo.message.focusInput = function() {
    var messageForm = dojo.byId("messageForm");
    if (messageForm && !aipo.message.isMobile) {
    	try{
    		messageForm.message.focus();
    	}catch(e){
    		//ignore
    	}

    }
}

aipo.message.fixMessageWindow = function() {
    if(aipo.message.isMobile) {
        return;
    }
    if (dojo.byId("dd_message") != null) {
        var minusH = 55 + 40 + 35 + 10;
        var w = dojo.byId("wrapper").clientWidth - 20;
        var h = document.documentElement.clientHeight - minusH;
        var tabh = document.documentElement.clientHeight - (minusH + 106);
        dojo.byId("dd_message").style.width = w + "px";
        if(dojo.byId("messageSideBlock1") != null) {
            dojo.byId("messageSideBlock1").style.height = h + "px";
        }
        if(dojo.byId("messageSideBlock2") != null) {
            dojo.byId("messageSideBlock2").style.height = h + "px";
        }
        if(dojo.byId("messageSummary") != null) {
            dojo.byId("messageSummary").style.height = tabh + "px";
        }
        if(dojo.byId("messageUserlist") != null) {
            dojo.byId("messageUserlist").style.height = tabh + "px";
        }
    }
    if (dojo.byId("messagePane") != null) {
        var minusH = 55 + 40 + 45 + 90 + 10 + 10 + 4;
        var h = document.documentElement.clientHeight - minusH;
        dojo.byId("messagePane").style.height = h + "px";
    }
};

aipo.message.onLoadMessageRoomDialog = function() {
    var mpicker = dijit.byId("membernormalselect");
    if (mpicker) {
        var select = dojo.byId('init_memberlist');
        var i;
        var s_o = select.options;
        if (s_o.length == 1 && s_o[0].value == "")
            return;
        for (i = 0; i < s_o.length; i++) {
            mpicker.addOptionSync(s_o[i].value, s_o[i].text, true);
        }
    }
    var btn_ma = dojo.byId("button_member_add");
    if (btn_ma) {
        dojo.connect(btn_ma, "onclick", function() {
            aipo.message.changeMember();
        });
    }

    var btn_mr = dojo.byId("button_member_remove");
    if (btn_mr) {
        dojo.connect(btn_mr, "onclick", function() {
            aipo.message.changeMember();
        });
    }
    aipo.message.changeMember();
};

aipo.message.changeMember = function() {
    var node = dojo.byId("memberFieldDisplay");
    if (node) {
        var HTML = "";
        HTML += "<table class=\"w100\"><tbody><tr><td style=\"border:none;\">";
        var m_t = dojo.byId("member_to");
        if (m_t) {
            var t_o = m_t.options;
            to_size = t_o.length;
            for (i = 0; i < to_size; i++) {
                var text = t_o[i].text.replace(/&/g, "&amp;").replace(/"/g,
                        "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                HTML += "<span>" + text + "</span>";
                if (i < to_size - 1) {
                    HTML += ",<wbr/>";
                }
            }
        }
        HTML += "</td></tr></tbody></table>";
        node.innerHTML = HTML;
    }

    aipo.message.setWrapperHeight();
}

aipo.message.onReceiveMessage = function(msg) {
    if (!msg["error"]) {
        aimluck.io.disableForm(dojo.byId("messageForm"), false);
        aipo.message.latestMessageList();
        aipo.message.clearInput();
        dojo.byId("messagePane").scrollTop = 0;
        dojo.style(dojo.byId("messageInputAttachment"), "display", "none");
        dojo.byId("attachments_global-" + aipo.message.portletId).innerHTML="";
        if(dojo.hasClass("messageUserTab","active")) {
            var tmpRoomId = parseInt(msg["params"]);
            if (tmpRoomId != NaN) {
                aipo.message.currentRoomId = tmpRoomId;
                aipo.message.currentUserId = null;
                aipo.message.tmpRoomId = null;
                aipo.message.reloadRoomList();
            }
            aipo.message.selectTab("room");
        }
    }
};

aipo.message.onReceiveMessageRoom = function(msg) {
    if (!msg["error"]) {
        var arrDialog = dijit.byId("modalDialog");
        if (arrDialog) {
            arrDialog.hide();
            aipo.message.currentUserId = null;
            var tmpRoomId = parseInt(msg["params"]);
            if (tmpRoomId != NaN) {
                aipo.message.reloadRoomList(tmpRoomId);
            } else {
                aipo.message.reloadRoomList();
            }
        }
    }
    if (dojo.byId('messageDiv')) {
        dojo.byId('messageDiv').innerHTML = msg["error"];
    }
};

aipo.message.onReceiveMessageRoomDelete = function(msg) {
    if (!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if (arrDialog) {
            arrDialog.hide();
            aipo.message.unselectRoom();
            aipo.message.reloadRoomList();
        }
    }
    if (dojo.byId('messageDiv')) {
        dojo.byId('messageDiv').innerHTML =msg;
    }
};

aipo.message.setWrapperHeight = function() {
    var modalDialog = document.getElementById('modalDialog');
    if (modalDialog) {
        var wrapper = document.getElementById('wrapper');
        wrapper.style.minHeight = modalDialog.clientHeight + 'px';
    }
}

aipo.message.resizeInput = function(input) {
    var shadowVal = input.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/&/g, '&amp;').replace(/\n$/, '<br/>&nbsp;').replace(
                    /\n/g, '<br/>').replace(/ {2,}/g, function(space) {
                var result = "";
                var i = 0;
                while (i < space.length) {
                    result += '&nbsp;';
                    i++;
                }
                return result;
            });

    var shadowDiv = document.createElement("div");
    shadowDiv.id = "shadow-message"
    shadowDiv.style.position = "absolute";
    shadowDiv.style.top = "-1000";
    shadowDiv.style.left = "-1000";
    shadowDiv.style.border = "0";
    shadowDiv.style.outline = "0";
    shadowDiv.style.lineHeight = "normal";
    shadowDiv.style.height = "auto";
    shadowDiv.style.resize = "none";
    shadowDiv.cols = "10"
    shadowDiv.innerHTML = shadowVal + "あ";

    var objBody = document.getElementsByTagName("body").item(0);

    objBody.appendChild(shadowDiv);
    var objShadow = dojo.byId("shadow-message");
    objShadow.style.width = input.offsetWidth + "px";

    var shadowHeight = objShadow.offsetHeight;
    // 文字サイズを13ptに設定したため、高さが18→20に変更
    if (shadowHeight < 20) {
        shadowHeight = 20;
    }
    if (shadowHeight > 20*20) {
        shadowHeight = 20*20;
    }
    input.style.height = shadowHeight * 1.0 + 19 + "px";
    objBody.removeChild(shadowDiv);
}

aipo.message.onPaste = function(input) {
    setTimeout(function() {
        aipo.message.resizeInput(input);
    }, 100);
}

aipo.message.inputHandle = null;
aipo.message.onFocus = function(input) {
    if(!aipo.message.inputHandle) {
        aipo.message.inputHandle = dojo.connect(input, "onkeydown", null, function(e) {
            if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
                this.form.onsubmit();
            }
        });
	}
}

aipo.message.read = function(room_id) {
    var messageRoomUnreadCount = dojo.byId("messageRoomUnreadCount" + room_id);
    if (messageRoomUnreadCount) {
        messageRoomUnreadCount.parentNode.removeChild(messageRoomUnreadCount);
    }
    aipo.message.refreshUnreadCount();
}
aipo.message.refreshUnreadCount = function() {
    var total = 0;
    dojo.query(".messageSummary .nrCount").forEach(function(item) {
        var value = parseInt(item.innerHTML);
        if (value != NaN) {
            total += value;
        }
    });
    aipo.menu.message.count(total);
    aipo.menu.updateTitle();
}

aipo.message.onFocusPlaceholder = function(input) {
    input.nextSibling.style.display = "none";
}

aipo.message.onBlurPlaceholder = function(input) {
    if (!input.value) {
        input.nextSibling.style.display = "";
    }
}

aipo.message.getFirstMessageId = function() {
    var messagePane = dojo.byId("messagePane");
    if(messagePane) {
        if(messagePane.children.length > 0) {
            var id = messagePane.children[0].id;
            if(id) {
                return id.replace("message", "");
            }
        }
    }
    return null;
}

aipo.message.getLastMessageId = function() {
    var messagePane = dojo.byId("messagePane");
    if(messagePane) {
        if(messagePane.children.length > 0) {
            var id = messagePane.children[messagePane.children.length-1].id;
            if(id) {
                return id.replace("message", "");
            }
        }
    }
    return null;
}

aipo.message.isOpenWindow = function() {
    return aipo.message.isMobile ? true : dojo.hasClass("dd_message", "open");
}

aipo.message.onLoadMessageReadUserList = function() {

}

aipo.message.switchDesktopNotify = function() {
    var messageDesktopNotifySwitch = dojo.byId("messageDesktopNotifySwitch");
    if (messageDesktopNotifySwitch) {
        if (window.webkitNotifications
                && (!aipo.activityDesktopNotifyEnable || window.webkitNotifications
                        .checkPermission() != 0)) {
            messageDesktopNotifySwitch.value = aimluck.io.escapeText("message_val_desktop_notify_on");
        } else if (window.Notification
                && (!aipo.activityDesktopNotifyEnable || window.Notification.permission != "granted")) {
            messageDesktopNotifySwitch.value = aimluck.io.escapeText("message_val_desktop_notify_on");
        } else {
            messageDesktopNotifySwitch.value = aimluck.io.escapeText("message_val_desktop_notify_off");
        }
        messageDesktopNotifySwitch.style.display="";
    }
}

aipo.message.openDirect = function(user_id) {
	if(aipo.message.isMobile) {
		location.href = aipo.message.jslink +"?action=controls.Maximize&u=" + user_id
	} else {
	    if(aipo.message.isDirect) {
		    return;
	    }
        var dialog = dijit.byId("modalDialog");
	    if(dialog) {
	    	dialog.hide();
	    }
	    aipo.message.isDirect = true;
	    if(aipo.message.currentRoomId) {
            aipo.message.tmpRoomId = aipo.message.currentRoomId;
        }
        aipo.message.currentRoomId = null;
	    aipo.message.currentRoomSearchKeyword = null;
	    aipo.message.currentUserSearchKeyword = null;
	    aipo.message.currentGroupName = "all";
	    aipo.message.currentUserId = user_id;
	    aipo.menu.toggleDropdown("message");
	    aipo.message.selectTab("user");
	}
}

aipo.message.openDirectMessage = function(user_id) {
	    if(aipo.message.isDirect) {
		    return;
	    }
        var dialog = dijit.byId("modalDialog");
	    if(dialog) {
	    	dialog.hide();
	    }
	    aipo.message.isDirect = true;
	    if(aipo.message.currentRoomId) {
            aipo.message.tmpRoomId = aipo.message.currentRoomId;
        }
        aipo.message.currentRoomId = null;
	    aipo.message.currentRoomSearchKeyword = null;
	    aipo.message.currentUserSearchKeyword = null;
	    aipo.message.currentGroupName = "all";
	    aipo.message.currentUserId = user_id;
		if(aipo.message.isMobile) {
			aipo.message.reloadUserList();
		} else {
		    aipo.message.selectTab("user");
		}
}
