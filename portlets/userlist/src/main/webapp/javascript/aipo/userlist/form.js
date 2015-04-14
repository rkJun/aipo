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
dojo.provide("aipo.userlist");

//dojo.require("aipo.widget.MemberNormalSelectList");
//dojo.require("aipo.widget.GroupNormalSelectList");

//aipo.addressbook.onLoadAddressbookDialog = function(portlet_id){
//
//    var fpicker = dijit.byId("groupnormalselect");
//    if(fpicker){
//        var select = dojo.byId('init_grouplist');
//        var i;
//        var s_o = select.options;
//        if (s_o.length == 1 && s_o[0].value == "") return;
//        for(i = 0 ; i < s_o.length; i ++ ) {
//            fpicker.addOptionSync(s_o[i].value,s_o[i].text,true);
//        }
//    }
//
//    var obj = dojo.byId("lastname");
//    if(obj){
//        obj.focus();
//    }
//}

//aipo.addressbook.onLoadAddressbookCompanyDialog = function(portlet_id){
//
//    var obj = dojo.byId("company_name");
//    if(obj){
//        obj.focus();
//    }
//
//}

//aipo.addressbook.onLoadAddressbookGroupDialog = function(portlet_id){
//
//    var mpicker = dijit.byId("membernormalselect");
//    if(mpicker){
//        var select = dojo.byId('init_memberlist');
//        var i;
//        var s_o = select.options;
//        if (s_o.length == 1 && s_o[0].value == "") return;
//        for(i = 0 ; i < s_o.length; i ++ ) {
//            mpicker.addOptionSync(s_o[i].value,s_o[i].text,true);
//        }
//    }
//
//    var obj = dojo.byId("group_name");
//    if(obj){
//        obj.focus();
//    }
//}
//
//aipo.addressbook.formSwitchCompanyInput = function(button) {
//    if(button.form.is_new_company.value == 'TRUE' || button.form.is_new_company.value == 'true') {
//        button.value = '새로 입력하기';
//        aipo.addressbook.formCompanyInputOff(button.form);
//    } else {
//        button.value = '목록에서 선택하기';
//        aipo.addressbook.formCompanyInputOn(button.form);
//    }
//}
//
//aipo.addressbook.formCompanyInputOn = function(form) {
//    dojo.byId('AddressBookCompanySelectField').style.display = "none";
//    dojo.byId('AddressBookCompanyInputField').style.display = "";
//
//    form.is_new_company.value = 'TRUE';
//}
//
//aipo.addressbook.formCompanyInputOff = function(form) {
//    dojo.byId('AddressBookCompanyInputField').style.display = "none";
//    dojo.byId('AddressBookCompanySelectField').style.display = "";
//
//    form.is_new_company.value = 'FALSE';
//
//
//}

aipo.userlist.onSubmitSearchButton = function(form,url,p_id,tab,indicator_id){

    var obj_indicator = dojo.byId(indicator_id + p_id);
    if(obj_indicator){
       dojo.style(obj_indicator, "display" , "");
    }

     var exec_url = url;

     if(tab==""){
        if(form.tab != undefined ){
	       if(form.tab[0].checked){
	           tab = form.tab[0].value;
	       }else{
	           tab = form.tab[1].value;
	       }
        }
     }

     var search_params = [["sword",form.sword.value],["tab",tab],["mode",form.mode.value]];
     aimluck.io.disableForm(form, true);
     aipo.viewPage(exec_url, p_id, search_params);


}

aipo.userlist.onReceiveMessage = function(msg){
    if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(arrDialog){
            arrDialog.hide();
        }
        aipo.portletReload('addressbook');
    }
    if (dojo.byId('messageDiv')) {
      dojo.byId('messageDiv').innerHTML = msg;
    }
}

aipo.userlist.onListReceiveMessage = function(msg){
   if(!msg) {
        var arrDialog = dijit.byId("modalDialog");
        if(arrDialog){
           arrDialog.hide();
        }
        aipo.portletReload('addressbook');
    }
    if (dojo.byId('listmessageDiv')) {
        dojo.byId('listmessageDiv').innerHTML = msg;
    }
}
