dojo._xdResourceLoaded({
depends: [["provide", "aipo.calendar.weekly"],
["require", "aimluck.dnd.Draggable"],
["require", "aipo.widget.ToolTip"],
["require", "aipo.widget.MemberNormalSelectList"],
["require", "aipo.widget.GroupNormalSelectList"]],
defineResource: function(dojo){if(!dojo._hasResource["aipo.calendar.weekly"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["aipo.calendar.weekly"] = true;
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

dojo.provide("aipo.calendar.weekly");

dojo.require("aimluck.dnd.Draggable");
dojo.require("aipo.widget.ToolTip");
dojo.require("aipo.widget.MemberNormalSelectList");
dojo.require("aipo.widget.GroupNormalSelectList");

aipo.calendar.objectlist = Array();
aipo.calendar.maximum_to = 30;


function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
    	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}


aipo.calendar.changeDisypayPeriod = function(period, pid) {
	var children = dojo.byId("weeklyHeadRights-" + pid).children;
	var childrenTerm = dojo.byId("weeklyTermRights-" + pid).children;
    var childrenBody = dojo.byId("weeklyRights-" + pid).children;
	dojo.byId("view_type_" + pid).value = period;
	var dateCell = dojo.byId("indicateDate_" + pid);
	if(dateCell == null){
		return;
	}
	for(var i = 0; i < 7; i++){
		var child = children[i];
		var childBody = childrenBody[i];
		var childTerm = childrenTerm[i];
		var add = dojo.byId("scheduleDivAdd0" + i + "_" + pid)
		switch(period){
		case '1':
			dateCell.innerHTML = "<span>1日</span>";
			childBody.className = "weeklyRight";
			if(i == 0) {
				child.className = "weeklyHeadRightR" + " weeklyHeadRightborder" + i + "_" + pid;
				child.style.width = "100%";
				childBody.style.width = "100%";
				childTerm.style.width = "100%";
				addClass(childTerm, "weeklyTermRightR");
				add.style.width = "100%";
			} else {
				child.className = "weeklyHeadRight" + " weeklyHeadRightborder" + i + "_" + pid;
				child.style.width = "0%";
				child.style.display = "none";
				childBody.style.width = "0%";
				childBody.style.display = "none";
				childTerm.style.width = "0%";
				childTerm.style.display = "none";
				removeClass(childTerm, "weeklyTermRightR");
				add.style.width = "0%";
				add.style.display = "none";
			}
			break;
		case '4':
			dateCell.innerHTML = "<span>4日</span>";
			if(i == 0){
				removeClass(childTerm, "weeklyTermRightR");
			}
			if(i <= 3){
				child.style.width = "25%";
				child.style.left = i * 25 + "%";
				child.style.display = "";
				childBody.style.width = "25%";
				childBody.style.left = i * 25 + "%";
				childBody.style.display = "";
				childTerm.style.width = "25%";
				childTerm.style.left = i * 25 + "%";
				childTerm.style.display = "";
				add.style.width = "25%";
				add.style.left = i * 25 + "%";
				add.style.display = "";
				if(i < 3) {
					child.className = "weeklyHeadRight" + " weeklyHeadRightborder" + i + "_" + pid;
				} else if(i == 3) {
					child.className = "weeklyHeadRightR" + " weeklyHeadRightborder" + i + "_" + pid;
					childBody.className = "weeklyRightR";
					addClass(childTerm, "weeklyTermRightR");
				}
			} else {
				child.className = "weeklyHeadRight" + " weeklyHeadRightborder" + i + "_" + pid;
				child.style.width = "0%";
				child.style.display = "none";
				childBody.style.width = "0%";
				childBody.style.display = "none";
				childTerm.style.width = "0%";
				childTerm.style.display = "none";
				removeClass(childTerm, "weeklyTermRightR");
				add.style.width = "0%";
				add.style.display = "none";
			}
			break;
		case '7':
			dateCell.innerHTML = "<span>7日</span>";
			child.style.left = i * (100.0 / 7.0) + "%";
			child.style.display = "";
			child.style.width = "14.2857%";
			childBody.style.left = i * (100.0 / 7.0) + "%";
			childBody.style.display = "";
			childBody.style.width = "14.2857%";
			childTerm.style.left = i * (100.0 / 7.0) + "%";
			childTerm.style.display = "";
			childTerm.style.width = "14.2857%";
			add.style.left =  i * (100.0 / 7.0) + "%";
			add.style.display = "";
			add.style.width = "14.2857%";
			if(i == 0){
				removeClass(childTerm, "weeklyTermRightR");
			}
			if(i < 6) {
				child.className = "weeklyHeadRight" + " weeklyHeadRightborder" + i + "_" + pid;
				childBody.className = "weeklyRight";
				removeClass(childTerm, "weeklyTermRightR");
			} else {
				child.className = "weeklyHeadRightR" + " weeklyHeadRightborder" + i + "_" + pid;
				childBody.className = "weeklyRightR";
				addClass(childTerm, "weeklyTermRightR");
			}
		}
	}
}

aipo.calendar.populateWeeklySchedule = function(_portletId, params) {
    var _params;
    var member_to = dojo.byId('member_to-' + _portletId);
    if (typeof params == "undefined" || typeof ptConfig[_portletId].jsonData == "undefined") {
       _params = "";
    } else {
       _params = params;
    }

    /* セキュリティIDを追加 */
    var secid = dojo.byId('secid-' + _portletId);
    if(secid){
       _params += "&secid=" + secid.value;
    }

    /*設備重複時はパラメータを追加しない*/
    if( _params.match(/ign_dup_f/) == null){
	     if(member_to) {
	       var t_o = member_to.options;
	       to_size = t_o.length;
	       if(to_size == 0){
	           _params += "&m_id=" + aipo.schedule.login_id;
	           _params += "&m_empty=empty";
	           dojo.byId("calender_m_empty_" + _portletId).style.display = "";
	       }else{
	    	   _params += "&m_empty=";
	    	   dojo.byId("calender_m_empty_" + _portletId).style.display = "none";
	       }
	       for(i = 0 ; i < to_size; i++ ) {
	           t_o[i].selected = true;
	           _params += "&m_id=" + t_o[i].value;
	       }
	    }
	    var chk_all = dojo.byId('showAll-' + _portletId);
	    if(chk_all) { _params += "&s_all=" + chk_all.value;}
    }

    djConfig.usePlainJson=true;
    ptConfig[_portletId].reloadFunction = aipo.calendar.populateWeeklySchedule;

    ptConfig[_portletId].isTooltipEnable = false;
    if(aipo.calendar.dummyDivObj){
         aipo.calendar.dummyDivObj.destroy();
         aipo.calendar.dummyDivObj = null;
    }

    if(dojo.byId('groupselect-' + _portletId).value.indexOf("pickup") != -1){
    	_params += "&pickup=true";
    }


    if(ptConfig[_portletId].xhrUrl != ptConfig[_portletId].jsonUrl + _params){
	    ptConfig[_portletId].xhrUrl = ptConfig[_portletId].jsonUrl + _params;
	    dojo.xhrGet({
	        portletId: _portletId,
	        url: ptConfig[_portletId].jsonUrl + _params,
	        encoding: "utf-8",
	        handleAs: "json-comment-filtered",
	        load: function(data, event) {
	        	ptConfig[_portletId].xhrUrl = "";
	        	//月カレンダーを更新
	        	if(aipo.calendar.reloadMonthlyCalendar!=null){
	        		aipo.calendar.reloadMonthlyCalendar();
	        	}
	            //権限チェック
	            obj_error = dojo.byId('error-'+_portletId);
	            dojo.style(obj_error, "display" , "none");
	            if("PermissionError" == data[0]){
	               dojo.style(obj_error, "display" , "block");
	               obj_error.innerHTML = data[1];
	               obj_content = dojo.byId('content-'+_portletId);
	               dojo.style(obj_content,  "display" , "none");
	               obj_indicator = dojo.byId('indicator-'+_portletId);
	               dojo.style(obj_indicator, "display" , "none")
	               return;
	            } else if(data["errList"]){
	               if("duplicate_facility" == data.errList[0]){
	                    if(confirm('既に同じ時間帯に設備が予約されています。スケジュールを登録しますか？')) {
	                        var new_param = _params + '&ign_dup_f=true'
	                        aipo.calendar.populateWeeklySchedule(_portletId, new_param);
	                        aipo.portletReload('schedule', _portletId);
	                        return;
	                    }
	               }

	               if("UpdateError" == data.errList[0]){
	                     dojo.style(obj_error, "display" , "block");
	                     obj_error.innerHTML = "<ul><li><span class=\"caution\">"+data.errList[1]+"</span></li></ul>";
	                     obj_content = dojo.byId('content-'+_portletId);
	                     dojo.style(obj_content, "visibility" , "visible");
	                     obj_indicator = dojo.byId('indicator-'+_portletId);
	                     dojo.style(obj_indicator, "display" , "none")
	                }
	            }
	            //オブジェクト削除
	            var i;
	            if(!!aipo.calendar.objectlist){
	                var o_size = aipo.calendar.objectlist.length;
	                for(i = 0; i < o_size; i++){
	                    var obj = aipo.calendar.objectlist[i];
	                    if(obj.portletId == _portletId){
	                        obj.destroy();
	                    }
	                }
	            }

	            if (!aipo.errorTreatment(data, ptConfig[_portletId].thisUrl)) {
	                return;
	            }
	            ptConfig[_portletId].jsonData = data;
	            var scheduleDiv = Array(ptConfig[_portletId].scheduleDivDaySum);
	            for(var i=0;i<ptConfig[_portletId].scheduleDivDaySum;i++) {
	                scheduleDiv[i] = Array();
	            }
	            var count = 0;
	            var l_count = 0;
	            var m_count = 0;
	            var html = '';
	            var termHtml = '';
	            var termTableHtml = '';
	            var termScheduleItemGarageHtml = '';
	            var tmpHeight = [];
	            var tmpNode1, tmpNode2, tmpNode3, tmpNode4;
	            var startEnd = data.startDate.substring(0,4) + "年" + parseInt(data.startDate.substring(5,7),10) + "月" + parseInt(data.startDate.substring(8,10),10) + "日" + data.dayOfWeek[0];
	            dojo.byId('viewWeekly-' + _portletId).innerHTML = startEnd;

	            var simpleStyleFirst = "";
	            var simpleStyle = "";
	            var isSimple = dojo.byId("top_form_" + this.portletId).value == "simple";
	            var isOneSpan = dojo.byId("view_type_" + this.portletId).value == "1";
	            var isFourSpan = dojo.byId("view_type_" + this.portletId).value == "4";
	            var isIPad = window.navigator.userAgent.toLowerCase().indexOf("ipad") >= 0;
	            if(isSimple && isOneSpan){
	                simpleStyleFirst = "width: 100%;";
	            	simpleStyle = "width: 0%;display: none;";
	            }

	            termTableHtml += "<table id=\"termTable_" + this.portletId + "\" style=\"width:100%;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
	            dojo.query(".weeklyTermTailTd_" + _portletId).style("display", "none");
	            var Element = dojo.byId("weeklyScrollPane_" + this.portletId );
	//            if(Element.clientWidth == Element.offsetWidth){
	//              	dojo.byId('weeklySpan-'+_portletId).style.display = "none";
	//              	if(dojo.byId('isMac').value != 0){
	//              	dojo.byId('weeklyHeadRightborder-'+_portletId).style.borderRight = "none";
	//              	dojo.byId('termDay0-'+_portletId).style.borderRight = "none";
	//              	}
	//            }

	            	dojo.forEach(data.termSchedule, function(itemList) {
	                var simpleDisplay = "";
	                var simpleDisplayR = "";
	                if(isSimple && ( isOneSpan || isFourSpan)){
	                  simpleDisplay = ' style="display: none;"';
	                  m_count++;
	                  for (k = 0; k < itemList.length ; k++){
	                    item = itemList[k];
	                    if(item.index==0 || ( isSimple && isFourSpan && item.index < 4 )){
	                    	simpleDisplay = "";
	                    	simpleDisplayR = " weeklyTermRightR";
	                        m_count--;
	                    	break;
	                    }
	                  }
	                }

	//                if(Element.clientWidth == Element.offsetWidth){
	//                  	simpleDisplayR = " weeklyTermRightRnone";
	//                  	if(dojo.byId('isMac').value != 0){
	//                  	dojo.byId('weeklyHeadRightborder-'+_portletId).style.borderRight = "none";
	//                  	dojo.byId('termDay0-'+_portletId).style.borderRight = "none";
	//                  	}
	//                }


	                var item = null;


	                //IPADはスクロールバーを表示しないので表示調節用の列を削除
	                var ipad_border= scheduleTooltipEnable !==true && isSimple && isOneSpan ? "border-right:0":"";
	                if(scheduleTooltipEnable!==true && isSimple && isOneSpan )
	                	termTableHtml += '<tr'+simpleDisplay+'><td colspan="2" nowrap="nowrap" width="100%" height="17px" valign="top"><div class="weeklyTermRights">';
	                else
	                	termTableHtml += '<tr'+simpleDisplay+'><td nowrap="nowrap" width="100%" height="17px" valign="top"><div class="weeklyTermRights">';

	                if(isSimple && isFourSpan){
		                termTableHtml += '<div class="_weeklyHeadRightborder0_' + _portletId + ' weeklyTermRight weeklyTermRightL'+simpleDisplayR+'" id="termDay0-'+ l_count + '-' +_portletId+'" style="width: 25%;left: 0%;'+simpleStyleFirst+ipad_border+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder1_' + _portletId + ' weeklyTermRight" id="termDay1-'+ l_count + '-' +_portletId+'" style="width: 25%;left: 25%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder2_' + _portletId + ' weeklyTermRight" id="termDay2-'+ l_count + '-' +_portletId+'" style="width: 25%;left: 50%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder3_' + _portletId + ' weeklyTermRight weeklyTermRightR" id="termDay3-'+ l_count + '-' +_portletId+'" style="width: 25%;left: 75%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder4_' + _portletId + ' weeklyTermRight" id="termDay4-'+ l_count + '-' +_portletId+'" style="left: 57.1429%;display:none;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder5_' + _portletId + ' weeklyTermRight" id="termDay5-'+ l_count + '-' +_portletId+'" style="left: 71.4286%;display:none;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termTableHtml += '<div class="_weeklyHeadRightborder6_' + _portletId + ' weeklyTermRight weeklyTermRightR" id="termDay6-'+ l_count + '-' +_portletId+'" style="left: 85.7143%;display:none;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
		                termScheduleItemGarageHtml += '<div id="termScheduleItemGarage-' + l_count + '-' + _portletId + '" class="weeklyTermRights" style="top:' +  (-(17 * (l_count - m_count + 1))) + 'px"> </div>'
	                }else{
	                	termTableHtml += '<div class="_weeklyHeadRightborder0_' + _portletId + ' weeklyTermRight weeklyTermRightL'+simpleDisplayR+'" id="termDay0-'+ l_count + '-' +_portletId+'" style="left: 0%;'+simpleStyleFirst+ipad_border+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder1_' + _portletId + ' weeklyTermRight" id="termDay1-'+ l_count + '-' +_portletId+'" style="left: 14.2857%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder2_' + _portletId + ' weeklyTermRight" id="termDay2-'+ l_count + '-' +_portletId+'" style="left: 28.5714%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder3_' + _portletId + ' weeklyTermRight" id="termDay3-'+ l_count + '-' +_portletId+'" style="left: 42.8571%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder4_' + _portletId + ' weeklyTermRight" id="termDay4-'+ l_count + '-' +_portletId+'" style="left: 57.1429%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder5_' + _portletId + ' weeklyTermRight" id="termDay5-'+ l_count + '-' +_portletId+'" style="left: 71.4286%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termTableHtml += '<div class="_weeklyHeadRightborder6_' + _portletId + ' weeklyTermRight weeklyTermRightR" id="termDay6-'+ l_count + '-' +_portletId+'" style="left: 85.7143%;'+simpleStyle+'"><div class="weeklyTermRightTop">&nbsp;</div></div>';
	                    termScheduleItemGarageHtml += '<div id="termScheduleItemGarage-' + l_count + '-' + _portletId + '" class="weeklyTermRights" style="top:' + (-(17 * (l_count - m_count + 1))) + 'px"> </div>'
	                }

	                var weeklyTermtailHtml;
	                termTableHtml += "</div></td></tr>";

	                l_count++;
	            });
	            termTableHtml += "</tbody></table>"
	            dojo.byId('termScheduleGarage-'+_portletId).innerHTML = termTableHtml;
	            dojo.byId('termScheduleDivAdd_' + _portletId).style.height = (17 * (l_count - m_count + 1)) + "px";
	            dojo.byId('termScheduleDivAdd_' + _portletId).style.top =  (-(17 * (l_count - m_count + 1))) + "px";
	            dojo.byId('termScheduleContainer-' + _portletId).innerHTML = termScheduleItemGarageHtml;
	            dojo.byId('weeklyTermLeftTopTall-' +  _portletId).style.height = (17 * (l_count - m_count)) + "px";

	            for(var i = 0;i < ptConfig[_portletId].scheduleDivDaySum; i++) {
	                tmpNode1 = dojo.byId('weeklyDay' + i + '-' + _portletId);
	                tmpNode2 = dojo.byId('weeklyHoliday' + i + '-' + _portletId);
	                tmpNode3 = dojo.byId('weeklyRight' + i + '-' + _portletId);
	                tmpNode4 = dojo.byId('termDay' + i + '-' + _portletId);
	                var tmpNode1_a = dojo.byId('weeklyDay' + i + '_element_a-' + _portletId);
	                tmpNode1_a.innerHTML = parseInt(data.date[i].substring(8,10),10) + data.dayOfWeek[i];
	                if(location.href.toString().toLowerCase().indexOf((_portletId+"?action=controls.Maximize").toLowerCase())>0){
	                	tmpNode1_a.outerHTML = tmpNode1_a.outerHTML.toString().split(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/).join(data.date[i].substring(0,10)).split("ScheduleScreen").join("ScheduleListScreen");
	                }else{
	                    tmpNode1_a.outerHTML = tmpNode1_a.outerHTML.toString().split(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/).join(data.date[i].substring(0,10));
	                }
	                tmpNode2.innerHTML = data.holiday[i];
	                var temptoday = data.today + "-00-00";
	                if (data.dayOfWeek[i] == "(土)") {
	                    dojo.addClass(tmpNode1, "saturday");
	                    dojo.addClass(tmpNode2, "saturday");
	                    dojo.addClass(tmpNode3, "saturday");
	                    dojo.addClass(tmpNode4, "saturday");
	                } else {
	                    dojo.removeClass(tmpNode1, "saturday");
	                    dojo.removeClass(tmpNode2, "saturday");
	                    dojo.removeClass(tmpNode3, "saturday");
	                    dojo.removeClass(tmpNode4, "saturday");
	                }
	                if (data.dayOfWeek[i] == "(日)") {
	                    dojo.addClass(tmpNode1, "sunday");
	                    dojo.addClass(tmpNode2, "sunday");
	                    dojo.addClass(tmpNode3, "sunday");
	                    dojo.addClass(tmpNode4, "sunday");
	                } else {
	                    dojo.removeClass(tmpNode1, "sunday");
	                    dojo.removeClass(tmpNode2, "sunday");
	                    dojo.removeClass(tmpNode3, "sunday");
	                    dojo.removeClass(tmpNode4, "sunday");
	                }
	                if (data.holiday[i]) {
	                    dojo.addClass(tmpNode1, "holiday");
	                    dojo.addClass(tmpNode2, "holiday");
	                    dojo.addClass(tmpNode3, "holiday");
	                    dojo.addClass(tmpNode4, "holiday");
	                } else {
	                    dojo.removeClass(tmpNode1, "holiday");
	                    dojo.removeClass(tmpNode2, "holiday");
	                    dojo.removeClass(tmpNode3, "holiday");
	                    dojo.removeClass(tmpNode4, "holiday");
	                }
	                if (temptoday==data.date[i]) {
	                    dojo.addClass(tmpNode1, "today");
	                    dojo.addClass(tmpNode2, "today");
	                    dojo.addClass(tmpNode3, "today");
	                    dojo.addClass(tmpNode4, "today");
	                } else {
	                    dojo.removeClass(tmpNode1, "today");
	                    dojo.removeClass(tmpNode2, "today");
	                    dojo.removeClass(tmpNode3, "today");
	                    dojo.removeClass(tmpNode4, "today");
	                }
	            }

	            dojo.forEach(data.schedule, function(item) {
	                var rowHeight = ptConfig[_portletId].rowHeight;
	                var top = item.startDateHour * rowHeight * 2 + item.startDateMinute * rowHeight / 30;
	                var height = item.endDateHour * rowHeight * 2 + item.endDateMinute * rowHeight / 30 - top;
	                if(height <= rowHeight) {
	                    tmpHeight[count] = height;
	                    height = rowHeight;
	                } else {
	                    tmpHeight[count] = -1;
	                }
	                var left = 100 /  ptConfig[_portletId].scheduleDivDaySum * item.index;
	                var width = 100 / ptConfig[_portletId].scheduleDivDaySum * 0.99;
	                var name = item.name;
	                var startDate = tmpHeight[count] == -1 ? ((item.startDateHour > 9) ? item.startDate : "0" +item.startDate) : item.name;
	                var endDate = tmpHeight[count] == -1 ? ((item.endDateHour > 9) ? item.endDate : "0" +item.endDate) : '';
	                var sepalater = tmpHeight[count] == -1 ? '-' : '';
	                var scheduleId = item.scheduleId;

	                var str_tmp = "0";
	                var str_tmpflgmb = "";
	                var member_to = dojo.byId('member_to-' + _portletId);
	                if(member_to) {
	                     var t_o = member_to.options;
	                     for(i = 0 ; i < t_o.length; i++ ) {
	                       if(((item.type == "U") && (item.ownerId == t_o[i].value)) || ((item.type == "F") && (item.ownerId == t_o[i].value))){
	                           str_tmp = i %  aipo.calendar.maximum_to;
	                       }
	                       /*
	                       if(item.memberList){
	                           var ucount = 0;
	                           var fcount = 0;
	                           for (j = 0 ; j < item.memberList.length ; j ++){
	                               if(item.memberList[j].charAt(0) == 'f'){
	                                  fcount++;
	                               }else{
	                                  ucount++;
	                               }
	                           }
	                       }
	                       */
	                    }
	                    var str_tmpflgmb;
	                    if(item.userCount > 1){
	                     str_tmpflgmb   =  "[共有]";
	                    }
	                    if(item.facilityCount > 0){
	                     str_tmpflgmb   += "[設備]";
	                    }

	                }

	                if(!item['public']) {
	                    name += '<i class="auiIcon auiIconSecret" title="非公開"></i>';
	                }
	                if(item.duplicate) {
	                    name += '<i class="auiIcon auiIconOverlap" title="重複スケジュール"></i>';
	                }
	                if(item.repeat) {
	                    name += '<i class="auiIcon auiIconRepeat" title="繰り返し"></i>';
	                }
	                if(item.tmpreserve) {
	                    name += '<i class="auiIcon auiIconTmpreserve" title="仮スケジュール"></i>';
	                }
	                html += '<div id="schedule-' + count + '-' + _portletId+'" class="scheduleDiv color'+str_tmp+'" style="top: '+ top +'px; left: ' + left + '%; height: '+ (height-1) + 'px; width: '+ width + '%;z-index: 0; visibility: hidden; border-right-style:none;"><div class="scheduleDivFirstLine color'+str_tmp+'"><span id="scheduleDivStartTime-'+ count + '-' + _portletId + '" class="scheduleDivTime color'+str_tmp+'">' + str_tmpflgmb + startDate + '</span><span id="scheduleDivSepalater-'+ count + '-' + _portletId + '"  class="scheduleDivSepalater color'+str_tmp+'">' + sepalater + '</span><span id="scheduleDivEndTime-'+ count + '-' + _portletId + '" class="scheduleDivTime color'+str_tmp+'">' + endDate + '</span></div><div class="scheduleDivRightLine color'+str_tmp+'"></div><div style="overflow: hidden;" class="scheduleDivName color'+str_tmp+'">'  + name  + '</div><div class="scheduleDivLastLine color'+str_tmp+'"><div class="scheduleDivRightLine color'+str_tmp+'"></div><center><div class="handleDiv color'+str_tmp+'" align="center">&nbsp;</div></center></div></div>';
	                count++;
	            });
	            html += "<div id=\"dummy_div_" +  _portletId + "\" class=\"scheduleDivAdd dummy_div\" style=\" position:absolute; width: 0px; height : 0px; left: 0px; top: -10000px; Filter: Alpha(Opacity=10);opacity:.10; background-color:#FFFFFF; \">&nbsp;</div>"
	            dojo.byId('scheduleGarage-' + _portletId).innerHTML = html;

	            var tmpDraggable = null;
	            var draggable, draggable2;
	            var objs = [];
	            count = 0;
	            dojo.forEach(data.schedule, function(item) {
	                draggable = dojo.byId('schedule-' + count + '-' + _portletId);
	                var scheduleId = item.scheduleId;
	                tmpDraggable = new aipo.calendar.WeeklyScheduleDraggable(draggable, {pid:_portletId , sid:'"schedule-' + count + '-' + _portletId +'"' , handle: '"dummy_div_-' + _portletId +'"' });
	                aipo.calendar.objectlist.push(tmpDraggable);

	                if(item.member || item.loginuser || item.owner || item['public']){
	                    tmpDraggable.setDraggable(true);
	                } else {
	                    tmpDraggable.setDraggable(false);
	                }

	                tmpDraggable.schedule = item;
	                tmpDraggable.tmpIndex = item.index;
	                tmpDraggable.count = count;
	                tmpDraggable.tmpHeight = tmpHeight[count];
	                tmpDraggable.position = 0;
	                tmpDraggable.division = 1;
	                tmpDraggable.portletId = _portletId;

	                scheduleDiv[item.index].push(draggable);
	                if(item['public'] || item.member){
	                    dojo.connect(draggable,"onclick", tmpDraggable, "onScheduleClick");
	                }

	                dojo.connect(draggable,"onmouseover", tmpDraggable, "onScheduleOver");

	                count++;
	            });

	            for(var i=0;i<ptConfig[_portletId].scheduleDivDaySum;i++) {
	                aipo.calendar.relocation(_portletId, scheduleDiv[i].length, scheduleDiv[i], 100 /  ptConfig[_portletId].scheduleDivDaySum * i);
	                scheduleDiv[i] = Array();
	            }
	            count = 0;
	             l_count = 0;
	            dojo.forEach(data.termSchedule, function(itemList) {
	                var item = null;
	                var temptoday =　data.today + "-00-00";
	                termHtml = "";
	                for(var i = 0;i < ptConfig[_portletId].scheduleDivDaySum; i++) {
	                   tmpNode5 = dojo.byId('termDay' + i + '-' + l_count + '-' + _portletId);
	                   if (data.dayOfWeek[i] == "(土)") {
	                       dojo.addClass(tmpNode5, "saturday");
	                   } else {
	                       dojo.removeClass(tmpNode5, "saturday");
	                   }
	                   if (data.dayOfWeek[i] == "(日)") {
	                       dojo.addClass(tmpNode5, "sunday");
	                   } else {
	                       dojo.removeClass(tmpNode5, "sunday");
	                   }
	                   if (data.holiday[i]) {
	                       dojo.addClass(tmpNode5, "holiday");
	                   } else {
	                       dojo.removeClass(tmpNode5, "holiday");
	                   }
	                   if (temptoday==data.date[i]) {
	                       dojo.addClass(tmpNode5, "today");
	                   } else {
	                       dojo.removeClass(tmpNode5, "today");
	                   }
	                }
	                for (k = 0; k < itemList.length ; k++){
	                    item = itemList[k];

	                    if(isSimple && isFourSpan){
	                    	var rowspanday = item.rowspan;
	                    	if(item.rowspan + item.index > 4){
	                    		rowspanday = rowspanday - (item.rowspan + item.index - 4);
	                    	}
	                    	var width = 25 * rowspanday;
	                    	var left = 25 * item.index;
	                    	if(item.index > 4){
	                    		width = 0 ;
	                    	}
	                    }else{
	                    	var width = 100 / ptConfig[_portletId].scheduleDivDaySum * item.rowspan;
	                    	var left = 100 / ptConfig[_portletId].scheduleDivDaySum * item.index;
	                    }

	                    var simpleDisplay = "";
	                    if(isSimple && isOneSpan){
	                    	width = 100;
	                        simpleDisplay = ((item.index==0) ? "" : "display: none;");
	                    }
	                    var name = item.name;
	                    var scheduleId = item.scheduleId;

	                    var str_tmp = "0";
	                    var str_tmpflgmb = "";
	                    var member_to = dojo.byId('member_to-' + _portletId);
	                    if(member_to) {
	                         var t_o = member_to.options;
	                         for(i = 0 ; i < t_o.length; i++ ) {
	                           if(((item.type == "U") && (item.ownerId == t_o[i].value)) || ((item.type == "F") && (item.ownerId == t_o[i].value))){
	                               str_tmp = i %  aipo.calendar.maximum_to;
	                           }
	                        }
	                        var str_tmpflgmb;
	                        if(item.userCount > 1){
	                            str_tmpflgmb   =  "[共有]";
	                        }
	                    }

	                    if(!item['public']) {
	                        name += '<i class="auiIcon auiIconSecret" title="非公開"></i>';
	                    }
	                    if(item.duplicate) {
	                        name += '<i class="auiIcon auiIconOverlap" title="重複スケジュール"></i>';
	                    }
	                    if(item.repeat) {
	                        name += '<i class="auiIcon auiIconRepeat" title="繰り返し"></i>';
	                    }
	                    if(item.tmpreserve) {
	                        name += '<i class="auiIcon auiIconTmpreserve" title="仮スケジュール"></i>';
	                    }
	                    if(width==100)width='99.99999';
	                    termHtml += '<div id="termSchedule-' + count + '-' + _portletId +'" class="termScheduleDiv termColor'+str_tmp+'" style="left: ' + left + '%; width: '+ width + '%;'+simpleDisplay+'"><div class="termScheduleDivHandleLeft" id="termScheduleDivHandleLeft-' + count + '-' + _portletId +'">&nbsp;</div><div class="termScheduleDivNameDiv">' + str_tmpflgmb + name + '</div><div class="termScheduleDivHandleRight" id="termScheduleDivHandleRight-' + count + '-' + _portletId +'">&nbsp;</div></div>';
	                    count++;
	                }
	                dojo.byId('termScheduleItemGarage-' + l_count + '-' + _portletId).innerHTML = termHtml;
	                l_count++;
	            });

	            tableLeft = dojo.byId('weeklyTermLeft_'+_portletId);

	            tmpDraggable = null;
	            count = 0;
	            l_count = 0;
	            dojo.forEach(data.termSchedule, function(itemList) {
	                var item = null;
	                    for (k = 0; k < itemList.length ; k++){
	                        item = itemList[k];
	                        var scheduleId = item.scheduleId;
	                        draggable = dojo.byId('termSchedule-' + count + '-' + _portletId);
	                        draggable2 = dojo.byId('termScheduleDivHandleLeft-' + count + '-' + _portletId);
	                        draggable3 = dojo.byId('termScheduleDivHandleRight-' + count + '-' + _portletId);
	                        tmpDraggable = new aipo.calendar.WeeklyTermScheduleDraggable(draggable,{pid:_portletId , sid:  'termSchedule-' + count + '-' + _portletId});

	                        aipo.calendar.objectlist.push(tmpDraggable);
	                        tmpDraggable.schedule = item;
	                        tmpDraggable.scheduleNode = draggable;
	                        tmpDraggable.portletId = _portletId;
	                        tmpDraggable.termType = 'center';

	                        dojo.connect(draggable,"onclick", tmpDraggable, "onScheduleClick");
	                        draggable.style.zIndex = 1;

	                        if (item.indexReal >= 0) {
	                            tmpDraggable2 = new aipo.calendar.WeeklyTermScheduleDraggable(draggable2, {pid:_portletId , sid: 'termScheduleDivHandleLeft-' + count + '-' + _portletId});
	                            aipo.calendar.objectlist.push(tmpDraggable2);
	                            tmpDraggable2.schedule = item;
	                            tmpDraggable2.scheduleNode = draggable;
	                            tmpDraggable2.portletId = _portletId;
	                            tmpDraggable2.termType = 'left';
	                            if(item.member || item.loginuser || item.owner || item['public']){
	                                tmpDraggable2.setDraggable(true);
	                            } else {
	                                tmpDraggable2.setDraggable(false);
	                            }
	                        } else {
	                            dojo.style(draggable2, "cursor", "pointer");
	                            draggable2.style.zIndex = 1;
	                        }
	                        dojo.connect(draggable2,"onclick", tmpDraggable, "onScheduleClick");
	                        if (item.indexReal + item.colspanReal <= ptConfig[_portletId].scheduleDivDaySum ) {
	                            tmpDraggable3 = new aipo.calendar.WeeklyTermScheduleDraggable(draggable3, {pid:_portletId , sid: 'termScheduleDivHandleRight-' + count + '-' + _portletId});
	                            aipo.calendar.objectlist.push(tmpDraggable3);
	                            tmpDraggable3.schedule = item;
	                            tmpDraggable3.scheduleNode = draggable;
	                            tmpDraggable3.portletId = _portletId;
	                            tmpDraggable3.termType = 'right';
	                            if(item.member || item.loginuser || item.owner || item['public']){
	                                tmpDraggable3.setDraggable(true);
	                            } else {
	                                tmpDraggable3.setDraggable(false);
	                            }
	                        } else {
	                            dojo.style(draggable3, "cursor", "pointer");
	                            draggable3.style.zIndex = 1;
	                        }
	                        dojo.connect(draggable3,"onclick", tmpDraggable, "onScheduleClick");
	                        dojo.connect(draggable,"onmouseover", tmpDraggable, "onScheduleOver");

	                        if(item.member || item.loginuser || item.owner || item['public']){
	                            tmpDraggable.setDraggable(true);
	                        } else {
	                            tmpDraggable.setDraggable(false);
	                        }
	                        count++;
	                    }
					l_count++;
	            });



	            obj_content = dojo.byId('content-'+_portletId);
	            dojo.style(obj_content, "visibility" , "visible");
	            obj_indicator = dojo.byId('indicator-'+_portletId);
	            dojo.style(obj_indicator, "display" , "none");
	            dojo.removeClass(dojo.byId('tableWrapper_'+_portletId), "hide");
	            var Element = dojo.byId("weeklyScrollPane_" + _portletId);

	            if((Element.clientWidth == Element.offsetWidth) && !(isIPad && !isSimple)){
	            	if(dojo.byId("weeklySpan-" + _portletId) != null){
	            		dojo.byId("weeklySpan-" + _portletId).style.display = "none";
	            	}
	            	dojo.query(".weeklyTermTailTd_" + _portletId).style("display", "none");
	            	if(dojo.byId("termTable_" + _portletId) != null){
	            		dojo.query('termTable_' + _portletId).style("width", "99.9999%");
	            	}

	                	if(isSimple && isOneSpan){
	                		dojo.query('.weeklyHeadRightborder0_' + _portletId).style("border-right-style", "none");
	                		dojo.query('._weeklyHeadRightborder0_' + _portletId).style("border-right-style", "none");
	                		dojo.byId("weeklyRight0-" + _portletId).style.borderRightStyle = "";
	                    	if(isIPad){
	                    		if(dojo.byId("weeklyRight0-" + _portletId).className.indexOf("sunday")  >= 0 || dojo.byId("weeklyRight0-" + _portletId).className.indexOf("saturday")  >= 0){
	                    			dojo.query('.scroll_width').style("padding-right", "1px");
	        					}else{
	        						dojo.query('.scroll_width').style("padding-right", "0px");
	        					}
	                    		dojo.query('.weeklyTableHead').style("padding-right", "1px");
	                    	}else{
	                    		dojo.query('.weeklyTableHead').style("padding-right", "1px");
	                    	}
	                	} else if(isSimple && isFourSpan){

	                    	if(isIPad){
	                    		dojo.query('.weeklyTableHead').style("padding-right", "0px");
	                    		dojo.query('.scroll_width').style("padding-right", "0px");
	                    	}else{
	                    		dojo.byId("weeklyRight3-" + _portletId).style.borderRightStyle = "none";
	                    		dojo.query('.weeklyHeadRightborder3_' + _portletId).style("border-right-style", "none");
	                    		dojo.query('._weeklyHeadRightborder3_' + _portletId).style("border-right-style", "none");
	                    		dojo.query('.weeklyTableHead').style("padding-right", "1px");
	                    	}
	                	}else{

	                    	if(isIPad){
	                    		dojo.query('.scroll_width').style("padding-right", "0px");
	                    		dojo.query('.weeklyTableHead').style("padding-right", "0px");
	                    	}else{
	                    		if(window.navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 && (dojo.byId("weeklyRight6-" + _portletId).className.indexOf("sunday")  >= 0 || dojo.byId("weeklyRight6-" + _portletId).className.indexOf("saturday"))  >= 0){
	                    			dojo.query('.scroll_width').style("padding-right", "1px");
	                    			dojo.query('.weeklyTableHead').style("padding-right", "1px");
	                    		}else{
	                    			dojo.query('.scroll_width').style("padding-right", "0px");
	                    			dojo.query('.weeklyTableHead').style("padding-right", "0px");
	                    		}
	                    		dojo.byId("weeklyRight6-" + _portletId).style.borderRightStyle = "none";
	                    		dojo.query('.weeklyHeadRightborder6_' + _portletId).style("border-right-style", "none");
	                    		dojo.query('._weeklyHeadRightborder6_' + _portletId).style("border-right-style", "none");

	                    	}
	                	}


	            }else if(Element.clientWidth != Element.offsetWidth && Element.offsetWidth - Element.clientWidth != 18){
	            	if(dojo.byId("weeklySpan-" + _portletId) != null){
	            		dojo.byId("weeklySpan-" + _portletId).width = (Element.offsetWidth - Element.clientWidth  + 1) + "px";
	            	}
	            	dojo.query(".weeklyTermTailTd_" + _portletId).width = (Element.offsetWidth - Element.clientWidth + 1) + "px";
	            	dojo.query(".weeklyTermTail").style("width",  ((Element.offsetWidth - Element.clientWidth + 1) + "px"));
	            }

	            if(l_count == 0){
	            	dojo.byId("termScheduleContainer-" + _portletId).style.height = "0px";
	            }else{
	            }

	            dojo.byId("weeklyTableHead_" + _portletId).style.marginTop = "5px";
	            var headHeight = dojo.byId("weeklyTableHead_" + _portletId).offsetHeight;
	            var trHeight = dojo.byId("weeklyTermTr_" + _portletId).offsetHeight;
	            if(headHeight==0 || trHeight==0) {
	            	// display:none;状態だとoffsetHeightが取得できないため、一旦描画する
	                var status = dojo.byId("portletsBody").style.display;
	                dojo.byId("portletsBody").style.display = "";
		            headHeight = dojo.byId("weeklyTableHead_" + _portletId).offsetHeight;
		            trHeight = dojo.byId("weeklyTermTr_" + _portletId).offsetHeight;
	                dojo.byId("portletsBody").style.display = status;
	            }
	        	headHeight += 5;
	            headHeight -= trHeight;
	            trHeight -= trHeight % 17;
	            headHeight += trHeight;
	            dojo.byId("weeklyTableHeadWrapper_" + _portletId).style.overflow = "hidden";
	            dojo.byId("weeklyTableHeadWrapper_" + _portletId).style.height = headHeight + "px"

	            if(l_count > 0){
	            	var day_index = 0;
	            	for(day_index = 0; day_index < 7; day_index++){
	            		if(dojo.byId("termDay" + day_index + "-" + (l_count - 1) + "-" + _portletId).className.indexOf("sunday")  >= 0 || dojo.byId("termDay" + day_index + "-" + (l_count - 1) + "-" + _portletId).className.indexOf("saturday")  >= 0){
	            			dojo.byId("termDay" + day_index + "-" + (l_count - 1) + "-" + _portletId).style.height = "95%";
	            		}
	            	}
	            }

	            if (!ptConfig[_portletId].isScroll) {
	                dojo.byId('weeklyScrollPane_'+_portletId).scrollTop = ptConfig[_portletId].contentScrollTop;
	                if(dojo.byId('weeklyScrollPane_'+_portletId).scrollTop != ptConfig[_portletId].contentScrollTop) {
	                	// display:none;状態になっていると、scrollTopが変更できないため、とにもかくにも一旦描画する
	                    var status = dojo.byId("portletsBody").style.display;
	                    dojo.byId("portletsBody").style.display = "";
	                    dojo.byId('weeklyScrollPane_'+_portletId).scrollTop = ptConfig[_portletId].contentScrollTop;
	                    if(dojo.byId('weeklyScrollPane_'+_portletId).scrollTop == ptConfig[_portletId].contentScrollTop) {
	                        ptConfig[_portletId].isScroll = true;
	                    }
	                    dojo.byId("portletsBody").style.display = status;
	                } else {
	                    ptConfig[_portletId].isScroll = true;
	                }
	            }
	            ptConfig[_portletId].isTooltipEnable = true;

	            dojo.query(".weeklyTermTailTd_" + _portletId).style("display", "");
	        }
	    });
    }

};

// aipo.calendar.relocation
aipo.calendar.relocation = function(_portletId,sum,scheduleDiv,scheduleDivLeft) {
    var i,j;
    var offsetW = 0.99;
    var scheduleDivWidth = 100 / 7;
    var endoverlapSchedule=0;
    var overlapNumArrayMax=0;
    var bottomLineMax=0;
    var targetNum=0;
    var overlapNumArray = new Array(sum);
    var positionLeftArray = new Array(sum);
    var resizeWidthArray = new Array(sum);
    var singleWidth = 1;
    var sumWidth = 0;
    if(dojo.byId("view_type_" + _portletId).value == "1" && dojo.byId("top_form_" + _portletId).value == "simple"){
    	singleWidth = 7.2;
    } else if(dojo.byId("view_type_" + _portletId).value == "4"){
    	singleWidth = 1.75;
    	if(scheduleDivLeft > 57){
    		scheduleDivLeft = 100;
    	}
    }

    scheduleDiv.sort(aipo.calendar.sortByRegion);


    for (i=0; i<sum; i++) {
        scheduleDiv[i].style.zIndex = i+1;
    }
    for (i=0; i<sum; i=endoverlapSchedule) {
        endoverlapSchedule = aipo.calendar.overlapSchedule(scheduleDiv,i,i,++endoverlapSchedule,sum);
        if (bottomLineMax < parseInt(dojo.getComputedStyle(scheduleDiv[i]).top)) {
            targetNum = i;
            bottomLineMax = parseInt(dojo.getComputedStyle(scheduleDiv[targetNum]).top);
            overlapNumArrayMax = 0;
        }

        for (j=targetNum; j<endoverlapSchedule; j++)
            var divBottom = parseInt(dojo.getComputedStyle(scheduleDiv[j]).top) + parseInt(dojo.getComputedStyle(scheduleDiv[j]).height);
            if (bottomLineMax < divBottom)
                bottomLineMax = divBottom;

        for (j=targetNum; j<endoverlapSchedule; j++) {
            positionLeftArray[j] = aipo.calendar.positionLeft(scheduleDiv,positionLeftArray,targetNum,j,0);
            if (positionLeftArray[j] > overlapNumArrayMax) overlapNumArrayMax = positionLeftArray[j];
        }

        for (j=targetNum; j<endoverlapSchedule; j++)
            resizeWidthArray[j] = aipo.calendar.positionRight(scheduleDiv,positionLeftArray,overlapNumArrayMax,targetNum,j);

        for (j=targetNum; j<endoverlapSchedule; j++)
            overlapNumArray[j] = overlapNumArrayMax;
    }



        	 for (i=0; i<sum; i++) {
        		 var width;
        		 var left;
        	        if (overlapNumArray[i] != 0) {
        	               if (positionLeftArray[i] < positionLeftArray[i+1])
        	            	   width = (scheduleDivWidth * 2 / (overlapNumArray[i]+1)) * 0.8 * offsetW * singleWidth;
        	            else if (resizeWidthArray[i]==0)
        	            	width = (scheduleDivWidth - (scheduleDivWidth/(overlapNumArray[i]+1)) * positionLeftArray[i]) * offsetW * singleWidth;
        	            else
        	            	width = (scheduleDivWidth - (scheduleDivWidth/(overlapNumArray[i]+1)) * positionLeftArray[i] - (scheduleDivWidth*2/(overlapNumArray[i]+1)) * 0.2 - (scheduleDivWidth/(overlapNumArray[i]+1)) * (resizeWidthArray[i]-1)) * offsetW * singleWidth;
        	        }
        	        else
        	        	width = scheduleDivWidth * offsetW * singleWidth;

        	        left = (scheduleDivLeft + ((scheduleDivWidth/(overlapNumArray[i]+1)) * positionLeftArray[i])) * singleWidth;

        	        if(left + width > 100){
        	        	width = 100 - left;
        	        	if(width < 0)
        	        		width  = 0;
        	        }
    	            dojo.style(scheduleDiv[i], "width", width + "%");
        	        dojo.style(scheduleDiv[i], "left", left + "%");
        	        dojo.style(scheduleDiv[i], "visibility", "visible" );


        	     }
}

// aipo.calendar.overlapSchedule
aipo.calendar.overlapSchedule = function(scheduleDiv,mostLeftDiv,startNum,endNum,sum) {
    var mostLeftDivBottom = parseInt(dojo.getComputedStyle(scheduleDiv[mostLeftDiv]).top) + parseInt(dojo.getComputedStyle(scheduleDiv[mostLeftDiv]).height);
    var startNumBottom = parseInt(dojo.getComputedStyle(scheduleDiv[startNum]).top) + parseInt(dojo.getComputedStyle(scheduleDiv[startNum]).height);

    var endNumTop;
    if(scheduleDiv[endNum]){
        endNumTop = parseInt(dojo.getComputedStyle(scheduleDiv[endNum]).top);
    }else {
        endNumTop = 'NaN';
    }

    if ((endNum > sum-1) ||
        (mostLeftDivBottom < endNumTop) ||
            (startNumBottom < endNumTop))
        return endNum;
    else endNum = aipo.calendar.overlapSchedule(scheduleDiv,mostLeftDiv,endNum,++endNum,sum);
    endNum = aipo.calendar.overlapSchedule(scheduleDiv,mostLeftDiv,startNum,endNum,sum);
    return endNum;
}


// aipo.calendar.positionLeft
aipo.calendar.positionLeft = function(scheduleDiv,positionLeftArray,startNum,endNum,positionLeft) {
    var endNumTop = parseInt(dojo.getComputedStyle(scheduleDiv[endNum]).top);
    for (i=startNum; i<endNum; i++) {
        var tmpDivTop = parseInt(dojo.getComputedStyle(scheduleDiv[i]).top);
        var tmpDivBottom = tmpDivTop + parseInt(dojo.getComputedStyle(scheduleDiv[i]).height);
        if ((tmpDivTop <= endNumTop) &&
                (tmpDivBottom > endNumTop) &&
                (positionLeftArray[i]==positionLeft)) {
                positionLeft = aipo.calendar.positionLeft(scheduleDiv,positionLeftArray,startNum,endNum,++positionLeft);
        }
    }
    return positionLeft;
}

// aipo.calendar.positionRight
aipo.calendar.positionRight = function(scheduleDiv,positionLeftArray,overlapNumArrayMax,startNum,endNum) {
    var resizeWidth=0;
    var endNumTop = parseInt(dojo.getComputedStyle(scheduleDiv[endNum]).top);
    for (i=startNum; i<endNum; i++) {
        var tmpDivTop = parseInt(dojo.getComputedStyle(scheduleDiv[i]).top);
        var tmpDivBottom = tmpDivTop + parseInt(dojo.getComputedStyle(scheduleDiv[i]).height);
        if ((tmpDivTop <= endNumTop) &&
                (tmpDivBottom > endNumTop) &&
                (positionLeftArray[i]>positionLeftArray[endNum]) &&
                ((overlapNumArrayMax-positionLeftArray[i]+1)>resizeWidth)) {
                resizeWidth=overlapNumArrayMax-positionLeftArray[i]+1;
        }
    }
    return resizeWidth;
}

// aipo.calendar.sortByRegion
aipo.calendar.sortByRegion = function(a,b) {
    var aTop = parseInt(dojo.getComputedStyle(a).top);
    var bTop = parseInt(dojo.getComputedStyle(b).top);
    var aBottom = aTop + parseInt(dojo.getComputedStyle(a).height);
    var bBottom = aBottom + parseInt(dojo.getComputedStyle(b).height);
    if (aTop == bTop)
        return bBottom - aBottom;
    else return aTop - bTop;
}

// aipo.calendar.getDate
aipo.calendar.getDate = function (thisDate, days) {
    // ex: inputDate = "2007-01-01"
    //     days = "3"
    //     return = "2007-01-04"
    tmpYear = parseInt(thisDate.substring(0,4),10);
    tmpMonth = parseInt(thisDate.substring(5,7),10);
    tmpDay = parseInt(thisDate.substring(8,10),10);
    if (days > 0) {
        do {
            tmpMonthDays = aipo.calendar.getDay(tmpYear,tmpMonth);
            if (tmpDay + days <= tmpMonthDays) {
                tmpDay = tmpDay + days;
                if ((tmpMonth < 10) && (tmpDay < 10))
                    date = tmpYear + "-0" + tmpMonth + "-0" + tmpDay;
                else if ((tmpMonth < 10) && !(tmpDay < 10))
                    date = tmpYear + "-0" + tmpMonth + "-" + tmpDay;
                else if (!(tmpMonth < 10) && (tmpDay < 10))
                    date = tmpYear + "-" + tmpMonth + "-0" + tmpDay;
                else date = tmpYear + "-" + tmpMonth + "-" + tmpDay;
                days = -1;
            } else {
                days = days - (tmpMonthDays - tmpDay) - 1;
                if (tmpMonth == 12) {
                    tmpYear++;
                    tmpMonth=1;
                } else {
                    tmpMonth++;
                }
                tmpDay = 1;
            }
        } while (days >= 0)
    } else if (days < 0) {
        do {
            if (tmpDay + days > 0) {
                tmpDay = tmpDay + days;
                if ((tmpMonth < 10) && (tmpDay < 10))
                    date = tmpYear + "-0" + tmpMonth + "-0" + tmpDay;
                else if ((tmpMonth < 10) && !(tmpDay < 10))
                    date = tmpYear + "-0" + tmpMonth + "-" + tmpDay;
                else if (!(tmpMonth < 10) && (tmpDay < 10))
                    date = tmpYear + "-" + tmpMonth + "-0" + tmpDay;
                else date = tmpYear + "-" + tmpMonth + "-" + tmpDay;
                days = 1;
            } else {
                if (tmpMonth == 1) {
                    tmpYear--;
                    tmpMonth=12;
                } else {
                    tmpMonth--;
                }
                tmpMonthDays = aipo.calendar.getDay(tmpYear,tmpMonth);
                days = days + tmpDay;
                tmpDay = tmpMonthDays;
            }
        } while (days <= 0)
    } else date = thisDate;
    return date;
}

// aipo.calendar.getDay
aipo.calendar.getDay = function (year, month) {
    if ( month == 2 ) {
        if ( !(year % 4)  && ( (year % 100) || !(year % 400) ) ) return 29;
        else return 28;
    } else if ( month == 4 || month == 6 || month == 9 || month == 11 ) return 30;
    else return 31;
}

//aipo.calendar.setGridArray
aipo.calendar.setGridArray = function(_portletId, _colSize) {
    var tmpX = 0;
    if(aipo.calendar.gridArray) delete(aipo.calendar.gridArray);
    aipo.calendar.gridArray = new Array(_colSize);
    for(i = 0 ; i < _colSize ; i++){
        tmpX = dojo._abs(dojo.byId("weeklyDay"+ i +"-" + _portletId), true).x;
        aipo.calendar.gridArray[i]=tmpX;
    }
}

//aipo.calendar.getCurrentMouseX
aipo.calendar.getCurrentMouseX = function(_portletId, e){
       if(aipo.calendar.gridArray == null) return {index: -1, x: 0};
       var startX = aipo.calendar.gridArray[0];
       var _tmpIndex= 0 ;
       var i;
       if(e.pageX > startX){
       var max = parseInt(aipo.calendar.gridArray.length) - 1;
       if(dojo.byId("view_type_" + _portletId) && dojo.byId("top_form_" + _portletId).value == "simple"){
    	   max = parseInt(dojo.byId("view_type_" + _portletId).value) - 1;
       }
           for(i = max; i > -1 ; i-- ) {
                 if(e.pageX > aipo.calendar.gridArray[i]){
                    _tmpIndex = i;
                    break;
                 }
           }
       }else {
           _tmpIndex = 0;
       }
       var _tmpX = aipo.calendar.gridArray[_tmpIndex] - startX;
       return {index: _tmpIndex, x: _tmpX};
}

aipo.calendar.onCloseMemberpicker = function( _portletId ){
    aipo.calendar.populateWeeklySchedule(_portletId);
}

aipo.calendar.showTooltip = function(url, portlet_id, containerNode) {
    var datehtml = "";
    var mbhtml = "";
    var mbfhtml = "";
    var placehtml = "";

    var escapeHTML = function(value) {
        var replaceChars = function(ch) {
            switch (ch) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
                case "'":
                    return "&#39;";
                case '"':
                    return "&quot;";
            }
            return "?";
         };
         return String(value).replace(/[<>&"']/g, replaceChars);
    };
    dojo.style(containerNode, "display", "block");
    if(ptConfig[portlet_id].xhrUrl != url){
        ptConfig[portlet_id].xhrUrl = url;
	    dojo.xhrGet({
	        portletId: portlet_id,
	        url: url,
	        encoding: "utf-8",
	        handleAs: "json-comment-filtered",
	        load: function(data, event) {
	        	ptConfig[portlet_id].xhrUrl = "";
	            if (!data.id) {
	                dojo.style(containerNode, "display", "none");
	                return;
	            }

	            if (!data.isSpan) {
	                datehtml = "<span style=\"font-size: 0.90em;\">" + data.date + "</span><br/>";
	            }


	            if (data.memberList) {
	                var memberSize = data.memberList.length;
	                for (var i = 0 ; i < memberSize ; i++) {
	                    mbhtml += "<li>" + escapeHTML(data.memberList[i].aliasName.value) + "</li>";
	                }
	            }

	            if (data.facilityList) {
	                var facilitySize = data.facilityList.length;
	                for (var i = 0 ; i < facilitySize ; i++) {
	                    mbfhtml += "<li>" + escapeHTML(data.facilityList[i].facilityName.value) + "</li>";
	                }
	            }

	            if(data.place != ""){
	                placehtml = "<span style=\"font-size: 0.90em;\">場所</span><br/><ul><li>" + data.place + "</li></ul>";
	            }

	            if(mbhtml != ""){
	                mbhtml = "<span style=\"font-size: 0.90em;\">参加者</span><br/><ul>" + mbhtml + "</ul>";
	            }

	            if(mbfhtml != ""){
	                mbfhtml = "<span style=\"font-size: 0.90em;\">設備</span><br/><ul>" + mbfhtml + "</ul>";
	            }

	            var tooltiphtml = "<h4>" + data.name + "</h4>" + datehtml + mbhtml + mbfhtml + placehtml;

	            containerNode.innerHTML = tooltiphtml;
	        }
	    });
    }
};

dojo.declare("aipo.calendar.DummyDivObject", null, {
     portletId: null,
     parentnode: null,
     draggable: null,
     TooltipObject: null,
     constructor: function(node, params){
        this.portletId = params.pid;
        this.parentnode = params.node;
        this.node = dojo.byId(node);
        this.events = [
            dojo.connect(this.node, "onmousedown", this, "onMouseDown"),
            dojo.connect(this.node, "onmouseover", this, "onMouseOver")
        ];
     },
     onMouseDown: function(e){
        this.hide();
        if(this.parentnode == null || this.parentnode == "undefined"){return;}
        if(this.draggable){this.draggable.onMouseDown(e);}
     },
     onMouseOver: function(e){
        if(this.parentnode == null || this.parentnode == "undefined"){return;}
     },
     destroy: function(){
        dojo.forEach(this.events, dojo.disconnect);
        this.events = this.node = this.handle = null;
    },
    hide: function(){
        dojo.marginBox (this.node,{ l: 0, t: -10000, w: 0, h: 0 });
    }
});

// aipo.calendar.WeeklyScheduleDragMoveObject
dojo.declare("aipo.calendar.WeeklyScheduleDragMoveObject", [aimluck.dnd.DragMoveObject], {
    _rowHeight_: 18,
    isResize: false,
    distance: 3,
    lastScroll: 0,
    onFirstMove: function(e){
        if(this.dragSource.TooltipObject != null){
           this.dragSource.TooltipObject.uninitialize();
        }

        var tmpDraggable = dojo.clone(this.node);
        tmpDraggable.id = 'schedule-dummy-' + this.portletId;
        tmpDraggable.style.zIndex = 998;
        dojo.style(tmpDraggable, "opacity", 0.0);
        var garage = dojo.byId('scheduleGarage-' + this.portletId);
        garage.appendChild(tmpDraggable);

        this.tmpDraggable = tmpDraggable;

        dojo.connect(this.node, "onmousedown", this, "onMouseDown");

        if (dojo.isIE) {
            document.onkeydown = function(e) {
                dojo.style(tmpDraggable, "opacity", 0.3);
            };
            document.onkeyup = function(e) {
                dojo.style(tmpDraggable, "opacity", 0.0);
            };
        } else {
            dojo.connect(null, "onkeydown", this, "onKeyPress");
            dojo.connect(null, "onkeyup", this, "onKeyPress");
        }

        aimluck.dnd.DragMoveObject.prototype.onFirstMove.apply(this, arguments);
        dojo.style(this.node, "opacity", 0.5);
        this.node.style.zIndex = 999;
        this.startY = this._pageY;
        this.startAbsoluteY = dojo._abs(dojo.byId(this.node), true).y;

        //Google Chrome及びSafari、Firefox3.6以降ではdojo._absの挙動が異なるので、AbsoluteYを修正する
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("chrome") > -1 || (dojo.isFF && (dojo.isFF >= 3.6))) {
            this.startAbsoluteY += window.scrollY;     // ページスクロール分を修正
        } else if(userAgent.indexOf("safari") > -1) {
            this.startAbsoluteY -= dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop;     // DIVタグスクロール分を修正
        }

        this.startHeight = parseInt(dojo.getComputedStyle(this.node).height);
        this.startTop = parseInt(dojo.getComputedStyle(this.node).top);
        if(this.startHeight - 6 < this.startY-this.startAbsoluteY) {
            this.isResize = true;
        }
        aipo.calendar.setGridArray(this.portletId, parseInt(ptConfig[this.portletId].scheduleDivDaySum));
        lastScroll = dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop;
    },
    onKeyPress: function(e){
        if(e.ctrlKey) {
            dojo.style(this.tmpDraggable, "opacity", 0.3);
        } else {
            dojo.style(this.tmpDraggable, "opacity", 0.0);
        }
    },
    onMouseMove: function(e){
        if(this.dragSource.isDraggable == false) return;

        aimluck.dnd.DragMoveObject.prototype.onMouseMove.apply(this, arguments);
        this.dragSource.schedule.isDrag = true;
        if(this.dragSource.tmpHeight > 3) {
            dojo.style(this.node, "height", this.dragSource.tmpHeight + "px");
            this.dragSource.tmpHeight = 3;
        }
        var distance = ptConfig[this.portletId].distance;
        var distance_scr = dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop - lastScroll;

        this.leftTop.t = Math.floor((this.leftTop.t + distance_scr )/distance)*distance;
        if (this.isResize) {
            if(- this.startTop + this.leftTop.t + this.startHeight < 0) {
                dojo.style(this.node, "height", "0px");
                this.leftTop.t += this.startHeight;
            } else {
                var rh;
                if (this.leftTop.t + this.startHeight > 864 ) {
                    rh = 864 - this.startTop - 3;
                } else {
                    rh =  - this.startTop + this.leftTop.t + this.startHeight;
                }
                this.leftTop.t = this.startTop;
                this.leftTop.h = parseInt(rh) -1;
            }
        } else {
            if(!this.disableY) {
              if ( this.leftTop.t < 0 ) this.leftTop.t = 0;
              if ( this.leftTop.t + this.startHeight > 864)
                this.leftTop.t = 864 - this.startHeight - 6;
            }
        }
        if(!this.disableX) {
           mouseX = aipo.calendar.getCurrentMouseX(this.portletId, e);
           this.leftTop.l = mouseX.x;
           /*
           if(dojo.byId("top_form_" + this.portletId).value=="simple"){
             this.leftTop.l = 0;
           }*/
           this.dragSource.schedule.index = mouseX.index;
        }
        dojo.marginBox(this.node, this.leftTop);
        var tmpTop = parseInt(dojo.getComputedStyle(this.node).top);
        var tmpHeight = parseInt(dojo.getComputedStyle(this.node).height)+1;
        var quotient = tmpTop/distance;
        var hour = Math.floor(quotient/12);
        var minute = Math.floor(quotient%12);



        hour = (hour > 9)? hour : "0" + hour;
        minute = (minute > 1) ? minute*(60/12): "0" + minute*(60/12);
        var id = this.dragSource.count;
        dojo.byId('scheduleDivStartTime-'+ id + '-' + this.portletId).innerHTML = hour + ':'+ minute;
        this.dragSource.schedule.startDateHour = hour;
        this.dragSource.schedule.startDateMinute = minute;
        this.dragSource.schedule.startDate = hour + ':'+ minute;

        quotient += tmpHeight/distance;
        hour = Math.floor(quotient/12);
        minute = Math.floor(quotient%12);

        hour = (hour > 9)? hour : "0" + hour;
        minute = (minute > 1) ? minute*(60/12): "0" + minute*(60/12);

        dojo.byId('scheduleDivEndTime-'+ id + '-' + this.portletId).innerHTML = hour + ':'+ minute;
        this.dragSource.schedule.endDateHour = hour;
        this.dragSource.schedule.endDateMinute = minute;
        this.dragSource.schedule.endDate = hour + ':'+ minute;
        dojo.byId('scheduleDivSepalater-'+ id + '-' + this.portletId).innerHTML = '-';
        return;
    },
    onMouseUp: function (e) {
        ptConfig[this.portletId].isTooltipEnable = true;
        /*
        if(dojo.byId("top_form_" + this.portletId).value=="simple"){
          this.dragSource.schedule.index = 0;
        }*/

        if (dojo.isIE) {
            document.onkeydown = "";
            document.onkeyup = "";
        }

        if(this.dragSource.schedule.isDrag != true){
            dojo.style(this.node, "opacity", 1.0 );
            aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);
            return;
        }

        var tmpHeight = parseInt(dojo.getComputedStyle(this.node).height);
        if(tmpHeight < ptConfig[this.portletId].rowHeight) {
            dojo.style(this.node, "height", ptConfig[this.portletId].rowHeight+ "px");
            this.dragSource.tmpHeight = tmpHeight;
        } else {
            this.dragSource.tmpHeight = -1;
        }

        var params = "";
        if(e.ctrlKey) {
            params += "&mode=insert";
        } else {
            params += "&mode=update";
        }
        params += "&entityid="+ this.dragSource.schedule.scheduleId;
        params += "&view_start=" + ptConfig[this.portletId].jsonData.date[0].substring(0, 10);

        if(this.dragSource.schedule.repeat) {
            params += "&edit_repeat_flag=1";
            params += "&view_date=" + ptConfig[this.portletId].jsonData.date[this.dragSource.tmpIndex].substring(0, 10);
        }

        params += "&start_date=" + ptConfig[this.portletId].jsonData.date[this.dragSource.schedule.index].substring(0, 11) + this.dragSource.schedule.startDateHour + '-' + this.dragSource.schedule.startDateMinute;
        params += "&end_date=" + ptConfig[this.portletId].jsonData.date[this.dragSource.schedule.index].substring(0, 11) + this.dragSource.schedule.endDateHour + '-' + this.dragSource.schedule.endDateMinute;

        aipo.calendar.populateWeeklySchedule(this.portletId, params);
        aipo.portletReload('schedule', this.portletId);

        aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);
         this.dragSource.destroy();
    }
});

// aipo.calendar.WeeklyScheduleDraggable
dojo.declare("aipo.calendar.WeeklyScheduleDraggable", [aimluck.dnd.Draggable], {
    DragMoveObject: aipo.calendar.WeeklyScheduleDragMoveObject,
    isDraggable: false,
    scheduleObjId: null,
    constructor: function(node, params){
        this.scheduleObjId = params.sid;
    },
    onMouseDown: function(e){
        ptConfig[this.portletId].isTooltipEnable = false;
        if(!!aipo.calendar.dummyDivObj && !!aipo.calendar.dummyDivObj.TooltipObject)aipo.calendar.dummyDivObj.TooltipObject.close();
        aimluck.dnd.Draggable.prototype.onMouseDown.apply(this, arguments);
    },
    onScheduleClick: function(e) {
        if(this.schedule.isDrag || !this.isDraggable) {
            return;
        }
        var uid = this.schedule.ownerId;
        aipo.common.showDialog(ptConfig[this.portletId].detailUrl + "&entityId=" + this.schedule.scheduleId + "&view_date=" + ptConfig[this.portletId].jsonData.date[this.schedule.index] + "&userid=" + uid, this.portletId, aipo.schedule.onLoadScheduleDetail );
        //** FIXME IEで追加ダイアログを閉じるとスクロールバーのｙ座標が強制的に０になってしまう現象
        aipo.schedule.tmpScroll = parseInt(dojo.byId('weeklyScrollPane_'+this.portletId)["scrollTop"]);
        //**//
    },
    onScheduleOver: function(e) {
        if(ptConfig[this.portletId].isTooltipEnable == false){return;}
        /*
        var ttdiv = dojo.byId("dummy_div_" + this.portletId);
        var left =  dojo.getComputedStyle(this.node).left ;
        var top =  dojo.getComputedStyle(this.node).top;
        var width =  dojo.getComputedStyle(this.node).width;
        var height =  dojo.getComputedStyle(this.node).height;
        dojo.marginBox (ttdiv,dojo._getMarginBox(this.node,{ l: left, t: top, w: width, h: height }));
        ttdiv.style.zIndex = this.node.style.zIndex ;
        ttdiv.style.height = (parseInt(height) - 6) + "px";
        if(!aipo.calendar.dummyDivObj){
            aipo.calendar.dummyDivObj = new aipo.calendar.DummyDivObject(ttdiv , {pid: this.scheduleObjId , node: this.node});
        }else{
            aipo.calendar.dummyDivObj.parentnode = this.node;
        }
        aipo.calendar.dummyDivObj.draggable = this;
        if(aipo.calendar.dummyDivObj.TooltipObject){
            aipo.calendar.dummyDivObj.TooltipObject.destroyRecursive();
            aipo.calendar.dummyDivObj.TooltipObject = null;
        }
                 */
        // IPADではツールチップ非表示
        if (scheduleTooltipEnable) {
          this.setupTooltip(e);
        }
    },
    setupTooltip: function(e) {
        var schedule_id = this.schedule.scheduleId;
        var view_date = ptConfig[this.portletId].jsonData.endDate;
        if(!this.TooltipObject){
            this.TooltipObject = new aipo.widget.ToolTip({
                label: "<div class='indicator'>読み込み中...</div>",
                connectId: [this.node.id]
            }, this.portletId, function(containerNode, node){
                var request_url = ptConfig[this.portletId].jsonUrl.split("?")[0] + "?template=ScheduleDetailJSONScreen&view_date="+view_date+"&scheduleid="+schedule_id;

                aipo.calendar.showTooltip(request_url, this.portletId, containerNode);
            });
            this.TooltipObject._onHover(e);
        }
        aipo.calendar.objectlist.push(this.TooltipObject);
    },
    setDraggable: function(flag){
        this.isDraggable = flag;
    }
});

/*
*/

// aipo.calendar.WeeklyTermScheduleDragMoveObject
dojo.declare("aipo.calendar.WeeklyTermScheduleDragMoveObject", [aimluck.dnd.DragMoveObject], {
    positionFrom: -1,
    positionTo: -1,
    moveIndex: 0,
    onFirstMove: function(e){
        if(this.dragSource.TooltipObject != null){
               this.dragSource.TooltipObject.uninitialize();
        }
       aimluck.dnd.DragMoveObject.prototype.onFirstMove.apply(this, arguments);
       dojo.style(this.node, "opacity", 0.5);
       aipo.calendar.setGridArray(this.portletId, parseInt(ptConfig[this.portletId].scheduleDivDaySum));

       var tmpDraggable = dojo.clone(this.node);
       tmpDraggable.id = 'schedule-dummy-' + this.portletId;
       tmpDraggable.style.zIndex = 998;
       dojo.style(tmpDraggable, "opacity", 0.0);

       var garage = dojo.byId(this.node.parentNode.id);
       garage.appendChild(tmpDraggable);

       this.tmpDraggable = tmpDraggable;

       if (dojo.isIE) {
           document.onkeydown = function(e) {
               dojo.style(tmpDraggable, "opacity", 0.3);
           };
           document.onkeyup = function(e) {
               dojo.style(tmpDraggable, "opacity", 0.0);
           };
       } else {
           dojo.connect(null, "onkeydown", this, "onKeyPress");
           dojo.connect(null, "onkeyup", this, "onKeyPress");
       }
    },
    onKeyPress: function(e){
        if(e.ctrlKey) {
            dojo.style(this.tmpDraggable, "opacity", 0.3);
        } else {
            dojo.style(this.tmpDraggable, "opacity", 0.0);
        }
    },
    onMouseMove: function(e){
        if(this.dragSource.isDraggable == false) return;

        aimluck.dnd.DragMoveObject.prototype.onMouseMove.apply(this, arguments);
        this.dragSource.schedule.isDrag = true;
        var distance = ptConfig[this.portletId].distance;

        var view_type=(dojo.byId("view_type_" + this.portletId) && dojo.byId("top_form_" + this.portletId) && dojo.byId("top_form_" + this.portletId).value == "simple")?dojo.byId("view_type_" + this.portletId).value:ptConfig[this.portletId].scheduleDivDaySum;

        var mouseX = aipo.calendar.getCurrentMouseX(this.portletId, e);
        _tmpIndex = mouseX.index;
        /*y = Math.floor(y/distance)*distance;
        if(!this.disableY) { this.node.style.top = y + "px"; }*/
        if(!this.disableX) {
            var tmpSchedule = this.dragSource.schedule;
            var type = this.dragSource.termType;
            var scheduleNode = this.dragSource.scheduleNode;
            var tmpW, tmpL;
            if (type == "center") {
                if(this.positionFrom == -1 && _tmpIndex != -1) {
                    this.positionFrom = _tmpIndex;
                    this.positionTo = this.positionFrom;
                }
                if(this.positionTo != -1 && _tmpIndex != -1) {
                    this.positionTo = _tmpIndex;
                }
                this.moveIndex = - this.positionFrom + this.positionTo;
                tmpL = tmpSchedule.indexReal + this.moveIndex;
                tmpW = tmpSchedule.colspanReal;
                var tmpS = view_type;
                if (tmpW + tmpL > tmpS) {
                    if (tmpL < 0) {
                        tmpW = tmpS;
                    } else {
                        tmpW = tmpS - tmpL;
                    }
                } else if (tmpL < 0) {
                    tmpW = tmpW + tmpL;
                }

                if (tmpL < 0) {
                    tmpL = 0;
                }
            } else if(type == "left") {
                if(this.positionFrom == -1) {
                    this.positionFrom = tmpSchedule.index;
                    this.positionTo = tmpSchedule.index;
                }
                if(this.positionTo != -1 && _tmpIndex != -1) {
                    this.positionTo = _tmpIndex;
                }
                this.moveIndex = - this.positionFrom + this.positionTo;
                if (this.positionTo >= this.positionFrom + tmpSchedule.colspanReal) {
                    tmpL = tmpSchedule.indexReal+ tmpSchedule.rowspan - 1;
                    tmpW = this.positionTo - this.positionFrom - tmpSchedule.colspanReal + 2;
                } else {
                    tmpL = this.positionTo;
                    tmpW = tmpSchedule.rowspan + this.positionFrom - this.positionTo;
                }

            } else {
                if(this.positionFrom == -1) {
                    this.positionFrom = tmpSchedule.index;
                    this.positionTo = tmpSchedule.index;
                }
                if(this.positionTo != -1 && _tmpIndex != -1 && this._tmpIndex != -1) {
                    this.positionTo = _tmpIndex;
                }
                this.moveIndex =   - tmpSchedule.index - tmpSchedule.rowspan + this.positionTo + 1;
                if (this.positionTo <= this.positionFrom) {
                    tmpL = this.positionTo;
                    tmpW = this.positionFrom - this.positionTo + 1;
                } else {
                    tmpL = tmpSchedule.index;
                    tmpW = this.positionTo - tmpSchedule.index + 1;
                }
            }
            var width = 100 /view_type * tmpW;
            var left = 100 /view_type * tmpL;
            /*
            if(dojo.byId("top_form_" + this.portletId).value=="simple"){
            	width = 100 * tmpW;
            	left = 100 * tmpL;
            }*/
            dojo.style(scheduleNode, "left",  left + "%");
            dojo.style(scheduleNode, "width", width + "%");
        }
    },
    onMouseUp: function (e) {
        ptConfig[this.portletId].isTooltipEnable = true;

        if (dojo.isIE) {
            document.onkeydown = "";
            document.onkeyup = "";
        }

        if(this.dragSource.schedule.isDrag != true){
            dojo.style(this.node, "opacity", 1.0 );
            aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);
            return;
        }
        var tmpSchedule = this.dragSource.schedule;
        var viewStart = ptConfig[this.portletId].jsonData.date[0].substring(0, 10);
        var type = this.dragSource.termType;
        var scheduleNode = this.dragSource.scheduleNode;
        var startDate, endDate;


        if(dojo.byId("top_form_" + this.portletId).value=="simple"){
        	startDate = ptConfig[this.portletId].jsonData.date[0];
        	endDate = ptConfig[this.portletId].jsonData.date[0];
        }

        if (type == 'center') {
            startDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + this.moveIndex) + "-00-00";
            endDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + this.moveIndex + tmpSchedule.colspanReal-1) + "-00-00";
        } else if (type == 'left') {
            if (tmpSchedule.colspanReal - this.moveIndex > 0) {
                startDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + this.moveIndex) + "-00-00";
                endDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + tmpSchedule.colspanReal - 1) + "-00-00";
            } else {
                startDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + tmpSchedule.colspanReal - 1) + "-00-00";
                endDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + this.moveIndex) + "-00-00";
            }
        } else {
            if (tmpSchedule.colspanReal + this.moveIndex > 0) {
                startDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal) + "-00-00";
                endDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + tmpSchedule.colspanReal + this.moveIndex-1) + "-00-00";
            } else {
                startDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal + tmpSchedule.colspanReal + this.moveIndex-1) + "-00-00";
                endDate = aipo.calendar.getDate(viewStart, tmpSchedule.indexReal) + "-00-00";

            }
        }


        this.positionFrom = -1;
        this.positionTo = -1;
        this.moveIndex = 0;
        this.tmpIndex = 0;

        var params = "";
        if(e.ctrlKey) {
            params += "&mode=insert";
        } else {
            params += "&mode=update";
        }
        params += "&is_span=TRUE";
        params += "&entityid="+ this.dragSource.schedule.scheduleId;
        params += "&view_start=" + viewStart;
        params += "&start_date=" + startDate;
        params += "&end_date=" + endDate;

        aipo.calendar.populateWeeklySchedule(this.portletId, params);

        aipo.portletReload('schedule', this.portletId);
        aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);
    }
});

// aipo.calendar.WeeklyTermScheduleDraggable
dojo.declare("aipo.calendar.WeeklyTermScheduleDraggable", [aimluck.dnd.Draggable], {
    DragMoveObject: aipo.calendar.WeeklyTermScheduleDragMoveObject,
    isDraggable: false,
    TooltipObject: null,
    scheduleObjId: null,
    isDraggable: false,
    constructor: function(node, params){
        this.scheduleObjId = params.sid;
    },
    onMouseDown: function(e){
        ptConfig[this.portletId].isTooltipEnable = false;
        if(this.TooltipObject)this.TooltipObject.close();
        aimluck.dnd.Draggable.prototype.onMouseDown.apply(this, arguments);
    },
    onScheduleClick: function(e) {
        if(this.schedule.isDrag || !this.isDraggable) {
            return;
        }
        var uid = this.schedule.ownerId;
        aipo.common.showDialog(ptConfig[this.portletId].detailUrl + "&entityId=" + this.schedule.scheduleId + "&view_date=" + ptConfig[this.portletId].jsonData.date[this.schedule.index]  + "&userid=" + uid, this.portletId, aipo.schedule.onLoadScheduleDetail);
        //** FIXME IEで追加ダイアログを閉じるとスクロールバーのｙ座標が強制的に０になってしまう現象
        aipo.schedule.tmpScroll = parseInt(dojo.byId('weeklyScrollPane_'+this.portletId)["scrollTop"]);
        //**//
    },
    onScheduleOver: function(e) {
        if(ptConfig[this.portletId].isTooltipEnable == false){return;}
        /*

        var ttdiv = dojo.byId("dummy_div_" + this.portletId);
        var left =  dojo.getComputedStyle(this.node).left ;
        var top =  dojo.getComputedStyle(this.node).top;
        var width =   dojo.getComputedStyle(this.node).width;
        var height =  dojo.getComputedStyle(this.node).height;
        dojo.marginBox (ttdiv,dojo._getMarginBox(this.node,{ l: left, t: top, w: width, h: height }));
        ttdiv.style.zIndex = this.node.style.zIndex ;

        if(!aipo.calendar.dummyDivObj){
            aipo.calendar.dummyDivObj = new aipo.calendar.DummyDivObject(ttdiv , {pid: this.portletId , node: this.node});
        }else{
            aipo.calendar.dummyDivObj.parentnode = this.node;
        }
        aipo.calendar.dummyDivObj.draggable = this;
         */
        // IPADではツールチップ非表示
        if (scheduleTooltipEnable) {
          this.setupTooltip(e);
        }
    },
    setupTooltip: function(e) {
        var schedule_id = this.schedule.scheduleId;
        var view_date = ptConfig[this.portletId].jsonData.endDate;
        if(!this.TooltipObject){
            this.TooltipObject = new aipo.widget.ToolTip({
                label: "<div class='indicator'>読み込み中...</div>",
                connectId: [this.node.id]
            }, this.portletId, function(containerNode, node){
                var request_url = ptConfig[this.portletId].jsonUrl.split("?")[0] + "?template=ScheduleDetailJSONScreen&view_date="+view_date+"&scheduleid="+schedule_id;

                aipo.calendar.showTooltip(request_url, this.portletId, containerNode);
            });
            this.TooltipObject._onHover(e);
        }
        aipo.calendar.objectlist.push(this.TooltipObject);
    },
    setDraggable: function(flag){
        this.isDraggable = flag;
    }
});


// aipo.calendar.WeeklyScheduleAddDragMoveObject
dojo.declare("aipo.calendar.WeeklyScheduleAddDragMoveObject", [aimluck.dnd.DragMoveObject], {
   _rowHeight_: 18,
    positionFrom: 0,
    positionTo: 0,
    _isDragging: false,
    lastScroll: 0,
    _isLocked: false,
    onMouseDown: function(e){
       this._isDragging = false;
       aimluck.dnd.DragMoveObject.prototype.onMouseDown.apply(this, arguments);
    },
    onFirstMove: function(e){
        this.startY = this.dragSource._lastY;
        this.startAbsoluteY = dojo._abs(dojo.byId(this.node), true).y;
        this.startX =  dojo.getComputedStyle(this.node).left;

        //Google Chrome及びSafari、Firefox/3.6ではdojo._absの挙動が異なるので、AbsoluteYを修正する
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("chrome") > -1 || (dojo.isFF && (dojo.isFF >= 3.6))) {
            this.startAbsoluteY += window.scrollY;     // ページスクロール分を修正
        } else if(userAgent.indexOf("safari") > -1) {
            this.startAbsoluteY -= dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop;     // DIVタグスクロール分を修正
        }

        lastScroll = dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop;
        aimluck.dnd.DragMoveObject.prototype.onFirstMove.apply(this, arguments);
    },
    onMouseMove: function(e){
    	if(this._isLocked){
    		return;
    	}
        aimluck.dnd.DragMoveObject.prototype.onMouseMove.apply(this, arguments);
        this._isDragging = true;
        var distance_scr = dojo.byId('weeklyScrollPane_'+this.portletId).scrollTop - lastScroll;

        var quotient = Math.floor((this.startY-this.startAbsoluteY) / this._rowHeight_);
        var currentQuotient = Math.floor((this.startY+this.leftTop.t-this.startAbsoluteY+distance_scr) / this._rowHeight_);
        var nextTop = 0;
        var nextHeight = 0;
        if( currentQuotient < quotient) {
            nextTop = currentQuotient*this._rowHeight_  +1;
            nextHeight = (quotient - currentQuotient+1)*this._rowHeight_;
            this.positionFrom = currentQuotient;
            this.positionTo= quotient+1;
        } else {
            nextTop = quotient*this._rowHeight_  +1;
            nextHeight = (currentQuotient - quotient+1)*this._rowHeight_;
            this.positionTo = currentQuotient+1;
            this.positionFrom = quotient;
        }

        if (nextTop + nextHeight > 864 ) {
             nextHeight = 864 - nextTop - this._rowHeight_;
             this.positionTo = 47;
        }

        this.leftTop.t = nextTop;
        this.leftTop.l = this.startX;
        this.leftTop.h = nextHeight;
        dojo.marginBox(this.node, this.leftTop);

        dojo.style(this.node, "opacity", 0.5);
    },
    onMouseUp: function(e) {
        if(!this._isDragging){
            /** ドラッグでなく、クリックされた場合 */
            this.onFirstMove(e);
            this.onMouseMove(e);
        }
        var hour = Math.floor(this.positionFrom/2);
        hour = (hour > 9) ? hour : "0" + hour;
        var minute = Math.floor(this.positionFrom%2)*30;
        var date = ptConfig[this.portletId].jsonData.date[this.dragSource.index].substring(0, 10);
        var startTime = date + '-' + hour + '-' + minute;

        hour = Math.floor(this.positionTo/2);
        hour = (hour > 9) ? hour : "0" + hour;
        minute = Math.floor(this.positionTo%2)*30;
        var endTime = date + '-' + hour + '-' + minute;

        this.node.style.top = "0px";
        this.node.style.height = "864px";
        dojo.style(this.node, "opacity", 0.0 );
        if(this._isDragging == true){
            aipo.common.showDialog(ptConfig[this.portletId].formUrl + "&entityid=new&mode=form"  + "&form_start=" + startTime + '&form_end=' + endTime , this.portletId , aipo.schedule.onLoadScheduleDialog);
        }
        //** FIXME IEで追加ダイアログを閉じるとスクロールバーのｙ座標が強制的に０になってしまう現象
        aipo.schedule.tmpScroll = parseInt(dojo.byId('weeklyScrollPane_'+this.portletId)["scrollTop"]);

       this._isDragging = false;
       aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);

       this._isLocked = true;
       setTimeout(function(){
    	   this._isLocked = false;
       }, 5000)
    }
});

// aipo.calendar.WeeklyScheduleAddDraggable
dojo.declare("aipo.calendar.WeeklyScheduleAddDraggable", [aimluck.dnd.Draggable], {
    DragMoveObject: aipo.calendar.WeeklyScheduleAddDragMoveObject,
    constructor: function(node, params){
        this.index = params.idx;
    }
});

/*
*/

// aipo.calendar.WeeklyTermScheduleAddDragMoveObject
dojo.declare("aipo.calendar.WeeklyTermScheduleAddDragMoveObject", [aimluck.dnd.DragMoveObject], {
    _rowHeight_: 18,
    positionFrom: -1,
    positionTo: -1,
    _isDragging: false,
    scheduleObjId: null,
    onMouseDown: function(e){
       this._isDragging = false;
       aimluck.dnd.DragMoveObject.prototype.onMouseDown.apply(this, arguments);
    },
    onFirstMove: function(e){
           aimluck.dnd.DragMoveObject.prototype.onFirstMove.apply(this, arguments);
           aipo.calendar.setGridArray(this.portletId, parseInt(ptConfig[this.portletId].scheduleDivDaySum));
    },
    onMouseMove: function(e){
        aimluck.dnd.DragMoveObject.prototype.onMouseMove.apply(this, arguments);
        this._isDragging = true;
        dojo.style(this.node, "opacity", 0.5);
        var mouseX = aipo.calendar.getCurrentMouseX(this.portletId, e);
        var tmpIndex = mouseX.index;
        if(this.positionFrom == -1 && tmpIndex != -1) {
            this.positionFrom = tmpIndex;
            this.positionTo = this.positionFrom;
        }
        if(this.positionTo != -1 && tmpIndex != -1) {
            this.positionTo = tmpIndex;
        }
        if(this.positionTo != -1 && this.positionFrom != -1) {
            var tmpW, tmpL;
            if(this.positionTo > this.positionFrom) {
                tmpL = this.positionFrom;
                tmpW = this.positionTo - this.positionFrom + 1;
            } else {
                tmpL = this.positionTo;
                tmpW = this.positionFrom - this.positionTo + 1;
            }
            var width;
            var left;

            if(dojo.byId("view_type_" + this.portletId) && dojo.byId("top_form_" + this.portletId).value == "simple") {
            	var sum = parseInt(dojo.byId("view_type_" + this.portletId).value);
                width = 100 / sum * tmpW;
                left = 100 / sum * tmpL;
            } else {
                width = 100 / ptConfig[this.portletId].scheduleDivDaySum * tmpW;
                left = 100 / ptConfig[this.portletId].scheduleDivDaySum * tmpL;
            }
            /*
            if(dojo.byId("top_form_" + this.portletId).value=="simple"){
            	width = 0;
            	left = 0;
            }*/
            dojo.style(this.node, "left",  left + "%");
            dojo.style(this.node, "width", width + "%");

        } else {
            dojo.style(this.node, "left",  0 + "%");
            dojo.style(this.node, "width", 0 + "%");
        }
    },
    onMouseUp: function (e) {
        if(!this._isDragging){
            /** ドラッグでなく、クリックされた場合 */
            this.onFirstMove(e);
            this.onMouseMove(e);
        }
        var left1, left2;
        if (this.positionTo != -1 && this.positionFrom != -1) {
            if(this.positionTo > this.positionFrom) {
                left1 = this.positionFrom;
                left2 = this.positionTo;
            } else {
                left2 = this.positionFrom;
                left1 = this.positionTo;
            }
            /*
            if(dojo.byId("top_form_" + this.portletId).value=="simple"){
            	left1 = 0;
            	left2 = 0;
            }*/
            var date1 = ptConfig[this.portletId].jsonData.date[left1];
            var date2 = ptConfig[this.portletId].jsonData.date[left2];
            if(this._isDragging == true){
                aipo.common.showDialog(ptConfig[this.portletId].formUrl + "&entityid=new&mode=form&is_span=TRUE"  + "&form_start=" + date1 + '&form_end=' + date2 ,this.portletId , aipo.schedule.onLoadScheduleDialog );
            }
            //** FIXME IEで追加ダイアログを閉じるとスクロールバーのｙ座標が強制的に０になってしまう現象
            aipo.schedule.tmpScroll = parseInt(dojo.byId('weeklyScrollPane_'+this.portletId)["scrollTop"]);
        }
        this.positionFrom = -1;
        this.positionTo = -1;
        dojo.style(this.node, "left",  0 + "%");
        dojo.style(this.node, "width", 100 + "%");
        dojo.style(this.node, "opacity", 0.0 );

        aimluck.dnd.DragMoveObject.prototype.onMouseUp.apply(this, arguments);
    }
});

// aipo.calendar.WeeklyTermScheduleAddDraggable
dojo.declare("aipo.calendar.WeeklyTermScheduleAddDraggable", [aimluck.dnd.Draggable], {
    DragMoveObject: aipo.calendar.WeeklyTermScheduleAddDragMoveObject,
    constructor: function(node, params){
        this.index = params.idx;
    }
});



aipo.schedule.initCalendar=function(_portletId){
	for(var i =0; i < ptConfig[_portletId].scheduleDivDaySum; i++) {
      tmpDraggable = new aipo.calendar.WeeklyScheduleAddDraggable('scheduleDivAdd0'+i+'_'+_portletId , {idx: i});
      tmpDraggable.portletId = _portletId;
      tmpDraggable.index = i;
    };

    tmpDraggable = new aipo.calendar.WeeklyTermScheduleAddDraggable('termScheduleDivAdd_'+_portletId,  {idx: 0});
    tmpDraggable.portletId = _portletId;

    aipo.calendar.populateWeeklySchedule(_portletId);
};

aipo.schedule.groupSelectOnchange=function(obj, e, _portletId, mp){
	var ajaxMemberSelectLoad=function(data, event) {
		//paramsの編集+namesの変更
		var html="";
		mp.dropDown.removeMember(dojo.byId("member_to-"+_portletId));
		for(var i=0;i<data.length;i++){
			var aliasName = data[i].aliasName.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			if (i != 0) {
				html += ' ';
			}
			params+="&m_id="+data[i].name;
            var j = i % aipo.calendar.maximum_to;
			html+="<span class=\"dispUser color" + j +"\">" + aliasName+ "</span>";
			aimluck.io.addOption(dojo.byId("member_to-"+_portletId), data[i].name, aliasName, true);
		}
		dojo.byId("member_to_input-"+_portletId).innerHTML=html;
	};
	var addtxt=dojo.query("#adduser-"+_portletId);
	switch(obj.value.indexOf("pickup")){
	case -1:
		addtxt.addClass("hide");
		var params="";
		  dojo.xhrGet({
            portletId:_portletId,
            url:obj.value,
            encoding: "utf-8",
            handleAs: "json-comment-filtered",
            load:ajaxMemberSelectLoad,
			handle:function(){
				aipo.calendar.populateWeeklySchedule(_portletId,params);//スケジュール更新
			}
		});
		break;
	default:
		addtxt.removeClass("hide");
		mp.dropDown.removeMember(dojo.byId("member_to-"+_portletId));
		mp.dropDown.removeMember(dojo.byId("tmp_member_to-"+_portletId));
		var p_mo = dojo.byId("picked_memberlist-"+_portletId).options;
		for(var i = 0; i < p_mo.length; i++)(function(opt, index){
			opt.selected = true;
		})(p_mo[i], i);
		mp.dropDown.addMember(dojo.byId("picked_memberlist-"+_portletId), dojo.byId("tmp_member_to-"+_portletId));
		mp.dropDown.addMember(dojo.byId("picked_memberlist-"+_portletId), dojo.byId("member_to-"+_portletId));
		mp.inputMemberSync();

		aipo.calendar.populateWeeklySchedule(_portletId);//スケジュール更新

		//デフォルトを保存するためにajax送信
		dojo.xhrGet({
			portletId:_portletId,
			url:dojo.byId("groupselect-defaulturl-"+_portletId).value,
			encoding: "utf-8",
			handleAs: "json-comment-filtered"
		});
		break;
	}
}
}
}});