/*
 * Aipo is a groupware program developed by Aimluck,Inc.
 * Copyright (C) 2004-2015 Aimluck,Inc.
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
dojo.provide("aipo.memo");

aipo.memo.onLoadMemoDialog = function(portlet_id){

    dojo.byId("memo_name").focus();

}

aipo.memo.formSwitchCategoryInput = function(button) {
    if(button.form.is_new_category.value == 'TRUE' || button.form.is_new_category.value == 'true') {
        button.value = '새로 입력하기';
        aipo.memo.formCategoryInputOff(button.form);
    } else {
        button.value = '목록에서 선택하기';
        aipo.memo.formCategoryInputOn(button.form);
    }
}

aipo.memo.formCategoryInputOn = function(form) {
    dojo.byId('memoCategorySelectField').style.display = "none";
    dojo.byId('memoCategoryInputField').style.display = "";

    form.is_new_category.value = 'TRUE';
}

aipo.memo.formCategoryInputOff = function(form) {
    dojo.byId('memoCategoryInputField').style.display = "none";
    dojo.byId('memoCategorySelectField').style.display = "";

    form.is_new_category.value = 'FALSE';
}

aipo.memo.onReceiveMessage = function(msg){
    if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(!!arrDialog){
            arrDialog.hide();
        }
        aipo.portletReload('memo');
    }

    if (dojo.byId('messageDiv')) {
        dojo.byId('messageDiv').innerHTML = msg;
    }
    var modalDialog = document.getElementById('modalDialog');
    if(modalDialog && msg != '') {
    	var wrapper = document.getElementById('wrapper');
    	wrapper.style.minHeight = modalDialog.clientHeight + 'px';
    }
}

aipo.memo.onReceiveMessageUpdate = function(msg){
    if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(!!arrDialog){
            arrDialog.hide();
        }
        aipo.portletReload('memo');
    }

    var node = dojo.query('.messageDiv_memo.enabled');
    if (node.length >= 1) {
        node[0].innerHTML = msg;
    }

    var modalDialog = document.getElementById('modalDialog');
    if(modalDialog && msg != '') {
    	var wrapper = document.getElementById('wrapper');
    	wrapper.style.minHeight = modalDialog.clientHeight + 'px';
    }
}


aipo.memo.enableMessageDiv = function(portlet_id) {
    dojo.query('.messageDiv_memo').forEach(function(node, index, arr){
        dojo.removeClass(node, 'enabled');
    });
    dojo.addClass('memo_'+portlet_id, 'enabled');
}

