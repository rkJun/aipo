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
dojo.provide("aipo.timecard");

dojo.require("aimluck.widget.Contentpane");
dojo.require("aipo.widget.DropdownDatepicker");

aipo.timecard.onLoadTimecardDialog = function(portlet_id){

  var obj = dojo.byId("reason");
  if(obj){
     obj.focus();
  } 
    
}

aipo.timecard.formSwitchCategoryInput = function(button) {
    if(button.form.is_new_category.value == 'TRUE' || button.form.is_new_category.value == 'true') {
        button.value = '새로 입력하기';
        aipo.timecard.formCategoryInputOff(button.form);
    } else {
        button.value = '목록에서 선택하기';
        aipo.timecard.formCategoryInputOn(button.form);
    }
}

aipo.timecard.formCategoryInputOn = function(form) {
    dojo.html.setDisplay(dojo.byId('timecardCategorySelectField'), false);
    dojo.html.setDisplay(dojo.byId('timecardCategoryInputField'), true);

    form.is_new_category.value = 'TRUE';
}

aipo.timecard.formCategoryInputOff = function(form) {
    dojo.html.setDisplay(dojo.byId('timecardCategoryInputField'), false);
    dojo.html.setDisplay(dojo.byId('timecardCategorySelectField'), true);
    
    form.is_new_category.value = 'FALSE';
}

aipo.timecard.onReceiveMessage = function(msg){
    if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(arrDialog){
            arrDialog.hide();
        }
        aipo.portletReload('timecard');
    }
    if (dojo.byId('messageDiv')) {
        dojo.byId('messageDiv').innerHTML = msg;
    }
}

aipo.timecard.onListReceiveMessage = function(msg){
    if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(arrDialog){
            arrDialog.hide();
        }
        aipo.portletReload('timecard');
    }
    if (dojo.byId('timecardmessageDiv')) {
        dojo.byId('timecardmessageDiv').innerHTML = msg;
    }
}
