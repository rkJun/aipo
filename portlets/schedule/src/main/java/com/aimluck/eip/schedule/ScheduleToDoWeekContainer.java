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
package com.aimluck.eip.schedule;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.aimluck.eip.common.ALData;
import com.aimluck.eip.schedule.util.ScheduleUtils;
import com.aimluck.eip.todo.util.ToDoUtils;

/**
 * スケジュールTodo のコンテナです。
 * 
 */
public class ScheduleToDoWeekContainer implements ALData {

  /** <code>dayList</code> JOB リスト */
  private List<ScheduleToDoDayContainer> dayList;

  /*
   * 
   */
  public void initField() {
    dayList = new ArrayList<ScheduleToDoDayContainer>();
  }

  /**
   * 表示開始する日付を設定します。
   * 
   * @param cal
   */
  public void setViewStartDate(Calendar cal) {
    for (int i = 1; i <= 7; i++) {
      // 日付を1日ずつずらす
      ScheduleToDoDayContainer con = new ScheduleToDoDayContainer();
      con.initField();
      con.setDate(cal.getTime());
      dayList.add(con);
      cal.add(Calendar.DATE, 1);
    }
  }

  /**
   * ToDo をコンテナに格納します。
   * 
   * @param rd
   */
  public void addToDoResultData(int index, ScheduleToDoResultData rd) {
    int span = rd.getRowspan();
    ScheduleToDoDayContainer con = dayList.get(index);
    con.setHasTodo(true);
    con.setToDoResultData(rd);
    for (int i = 1; i < span; i++) {
      con = dayList.get(index + i);
      con.setHasTodo(true);
    }
  }

  public boolean canAddTodo(ScheduleToDoResultData rd) {
    boolean canAdd = true;
    Date startDate = rd.getStartDate().getValue();
    Date endDate = rd.getEndDate().getValue();

    ScheduleToDoDayContainer con;
    int size = dayList.size();
    for (int i = 0; i < size; i++) {
      con = dayList.get(i);
      Date conDate = con.getDate().getValue();
      boolean isEmptyStartDate =
        ScheduleUtils.equalsToDate(ToDoUtils.getEmptyDate(), startDate, false);
      boolean isEmptyEndDate =
        ScheduleUtils.equalsToDate(ToDoUtils.getEmptyDate(), endDate, false);
      if (isEmptyStartDate && isEmptyEndDate) {
        // 開始日と入稿日が未設定の場合
        if (con.isHasTodo()) {
          canAdd = false;
        }
      } else {
        if (isEmptyStartDate) {
          // 開始日が未設定の場合
          if (ScheduleUtils.equalsToDate(endDate, conDate, false)
            || conDate.before(endDate)) {
            if (con.isHasTodo()) {
              canAdd = false;
            }
          }
        } else if (isEmptyEndDate) {
          // 入稿日が未設定の場合
          if (ScheduleUtils.equalsToDate(startDate, conDate, false)
            || conDate.after(startDate)) {
            if (con.isHasTodo()) {
              canAdd = false;
            }
          }
        } else {
          // 開始日と入稿日が設定されている場合
          if ((ScheduleUtils.equalsToDate(startDate, conDate, false) || conDate
            .after(startDate))
            && (ScheduleUtils.equalsToDate(endDate, conDate, false) || conDate
              .before(endDate))) {
            if (con.isHasTodo()) {
              canAdd = false;
            }
          }
        }
      }
    }
    return canAdd;
  }

  /**
   * JOB リストを取得します。
   * 
   * @return
   * 
   * @uml.property name="dayList"
   */
  public List<ScheduleToDoDayContainer> getDayList() {
    return dayList;
  }

}
