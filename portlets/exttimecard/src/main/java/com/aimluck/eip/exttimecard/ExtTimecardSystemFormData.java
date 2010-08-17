/*
 * Aipo is a groupware program developed by Aimluck,Inc.
 * Copyright (C) 2004-2008 Aimluck,Inc.
 * http://aipostyle.com/
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.aimluck.eip.exttimecard;

import java.util.Calendar;
import java.util.List;

import org.apache.cayenne.access.DataContext;
import org.apache.cayenne.exp.Expression;
import org.apache.cayenne.exp.ExpressionFactory;
import org.apache.cayenne.query.SelectQuery;
import org.apache.jetspeed.services.logging.JetspeedLogFactoryService;
import org.apache.jetspeed.services.logging.JetspeedLogger;
import org.apache.turbine.util.RunData;
import org.apache.velocity.context.Context;

import com.aimluck.commons.field.ALNumberField;
import com.aimluck.commons.field.ALStringField;
import com.aimluck.eip.cayenne.om.portlet.EipTExtTimecardSystem;
import com.aimluck.eip.common.ALAbstractFormData;
import com.aimluck.eip.common.ALDBErrorException;
import com.aimluck.eip.common.ALEipConstants;
import com.aimluck.eip.common.ALPageNotFoundException;
import com.aimluck.eip.exttimecard.util.ExtTimecardUtils;
import com.aimluck.eip.modules.actions.common.ALAction;
import com.aimluck.eip.orm.DatabaseOrmService;
import com.aimluck.eip.services.eventlog.ALEventlogConstants;
import com.aimluck.eip.services.eventlog.ALEventlogFactoryService;
import com.aimluck.eip.util.ALEipUtils;

/**
 * タイムカード集計のフォームデータを管理するためのクラスです。 <br />
 * 
 */

public class ExtTimecardSystemFormData extends ALAbstractFormData {

  /** logger */
  private static final JetspeedLogger logger = JetspeedLogFactoryService
    .getLogger(ExtTimecardSystemFormData.class.getName());

  private ALNumberField system_id;

  private ALNumberField user_id;

  private ALStringField system_name;

  /** 開始時刻 */
  private ALNumberField start_hour;

  private ALNumberField start_minute;

  /** 終了時刻 */
  private ALNumberField end_hour;

  private ALNumberField end_minute;

  private ALNumberField worktime_in;

  private ALNumberField resttime_in;

  private ALNumberField worktime_out;

  private ALNumberField resttime_out;

  private ALNumberField change_hour;

  private ALStringField outgoing_add_flag;

  private int entity_id;

  private DataContext dataContext;

  @Override
  public void init(ALAction action, RunData rundata, Context context)
      throws ALPageNotFoundException, ALDBErrorException {
    super.init(action, rundata, context);

    dataContext = DatabaseOrmService.getInstance().getDataContext();
  }

  /**
   * 
   */
  public void initField() {
    // TODO 自動生成されたメソッド・スタブ

    system_id = new ALNumberField();
    system_id.setNotNull(true);

    user_id = new ALNumberField();
    user_id.setNotNull(true);

    system_name = new ALStringField();
    system_name.setFieldName("勤務形態");
    system_name.setNotNull(true);

    start_hour = new ALNumberField();
    start_minute = new ALNumberField();
    end_hour = new ALNumberField();
    end_minute = new ALNumberField();

    worktime_in = new ALNumberField();
    worktime_in.setFieldName("勤務時間内の勤務時間");
    worktime_in.setNotNull(true);
    worktime_in.limitMinValue(0);

    resttime_in = new ALNumberField();
    resttime_in.setFieldName("勤務時間内の休憩時間");
    resttime_in.setNotNull(true);
    resttime_in.limitValue(0, 360);

    worktime_out = new ALNumberField();
    worktime_out.setFieldName("勤務時間外の勤務時間");
    worktime_out.setNotNull(true);
    worktime_out.limitMinValue(0);

    resttime_out = new ALNumberField();
    resttime_out.setFieldName("勤務時間外の休憩時間");
    resttime_out.setNotNull(true);
    resttime_out.limitValue(0, 360);

    change_hour = new ALNumberField();
    change_hour.setNotNull(true);

    outgoing_add_flag = new ALStringField();

  }

  @Override
  protected boolean loadFormData(RunData rundata, Context context,
      List<String> msgList) throws ALPageNotFoundException, ALDBErrorException {
    try {
      EipTExtTimecardSystem record = ExtTimecardUtils.getEipTExtTimecardSystem(
        rundata, context);
      if (record == null) {
        return false;
      }

      system_id.setValue(String.valueOf(record.getSystemId()));
      user_id.setValue(String.valueOf(record.getUserId()));
      system_name.setValue(record.getSystemName());

      start_hour.setValue(String.valueOf(record.getStartHour()));
      start_minute.setValue(String.valueOf(record.getStartMinute()));
      end_hour.setValue(String.valueOf(record.getEndHour()));
      end_minute.setValue(String.valueOf(record.getEndMinute()));

      worktime_in.setValue(record.getWorktimeIn());
      resttime_in.setValue(record.getResttimeIn());
      worktime_out.setValue(record.getWorktimeOut());
      resttime_out.setValue(record.getResttimeOut());

      change_hour.setValue(String.valueOf(record.getChangeHour()));
      outgoing_add_flag.setValue(record.getOutgoingAddFlag());

    } catch (Exception ex) {
      logger.error("Exception", ex);
      return false;
    }
    return true;
  }

  @Override
  protected boolean updateFormData(RunData rundata, Context context,
      List<String> msgList) throws ALPageNotFoundException, ALDBErrorException {
    try {
      EipTExtTimecardSystem record = ExtTimecardUtils.getEipTExtTimecardSystem(
        rundata, context);
      if (record == null) {
        return false;
      }

      record.setSystemName(system_name.getValue());
      record.setUserId((int) user_id.getValue());
      record.setStartHour((int) start_hour.getValue());
      record.setStartMinute((int) start_minute.getValue());
      record.setEndHour((int) end_hour.getValue());
      record.setEndMinute((int) end_minute.getValue());
      record.setWorktimeIn((int) worktime_in.getValue());
      record.setResttimeIn((int) resttime_in.getValue());
      record.setWorktimeOut((int) worktime_out.getValue());
      record.setResttimeOut((int) resttime_out.getValue());
      record.setChangeHour((int) change_hour.getValue());
      String tmp;
      if ("T".equals(outgoing_add_flag.getValue())) {
        tmp = "T";
      } else {
        tmp = "F";
      }
      record.setOutgoingAddFlag(tmp);

      // 更新日
      record.setUpdateDate(Calendar.getInstance().getTime());

      dataContext.commitChanges();
    } catch (Exception ex) {
      logger.error("Exception", ex);
      return false;
    }
    return true;
  }

  @Override
  protected boolean deleteFormData(RunData rundata, Context context,
      List<String> msgList) throws ALPageNotFoundException, ALDBErrorException {
    try {
      // オブジェクトモデルを取得
      EipTExtTimecardSystem record = ExtTimecardUtils.getEipTExtTimecardSystem(
        rundata, context);
      if (record == null)
        return false;

      if (record.getSystemId().intValue() == 1) {
        // 勤務形態「通常」は削除不可
        msgList.add("勤務形態『 <span class='em'>通常</span> 』は削除できません。");
        return false;
      }

      dataContext.deleteObject(record);
      dataContext.commitChanges();

      // イベントログに保存
      ALEventlogFactoryService.getInstance().getEventlogHandler().log(
        record.getSystemId(),
        ALEventlogConstants.PORTLET_TYPE_EXTTIMECARD_SYSTEM,
        record.getSystemName());
    } catch (Exception ex) {
      logger.error("Exception", ex);
      return false;
    }
    return true;
  }

  @Override
  protected boolean insertFormData(RunData rundata, Context context,
      List<String> msgList) throws ALPageNotFoundException, ALDBErrorException {
    try {
      EipTExtTimecardSystem record = (EipTExtTimecardSystem) dataContext
        .createAndRegisterNewObject(EipTExtTimecardSystem.class);
      record.setSystemName(system_name.getValue());
      record.setUserId((int) user_id.getValue());
      record.setStartHour((int) start_hour.getValue());
      record.setStartMinute((int) start_minute.getValue());
      record.setEndHour((int) end_hour.getValue());
      record.setEndMinute((int) end_minute.getValue());
      record.setWorktimeIn((int) worktime_in.getValue());
      record.setResttimeIn((int) resttime_in.getValue());
      record.setWorktimeOut((int) worktime_out.getValue());
      record.setResttimeOut((int) resttime_out.getValue());
      record.setChangeHour((int) change_hour.getValue());
      String tmp;
      if ("T".equals(outgoing_add_flag.getValue())) {
        tmp = "T";
      } else {
        tmp = "F";
      }
      record.setOutgoingAddFlag(tmp);
      record.setCreateDate(Calendar.getInstance().getTime());
      record.setUpdateDate(Calendar.getInstance().getTime());
      dataContext.commitChanges();
      // イベントログに保存
      ALEventlogFactoryService.getInstance().getEventlogHandler().log(
        record.getSystemId(),
        ALEventlogConstants.PORTLET_TYPE_EXTTIMECARD_SYSTEM,
        record.getSystemName());
    } catch (Exception ex) {
      logger.error("Exception", ex);
      return false;
    }
    return true;
  }

  protected boolean setFormData(RunData rundata, Context context,
      List<String> msgList) throws ALPageNotFoundException, ALDBErrorException {
    boolean res = super.setFormData(rundata, context, msgList);

    if (res) {
      if (ALEipConstants.MODE_NEW_FORM.equals(this.getMode())) {
        try {
          DataContext dataContext = DatabaseOrmService.getInstance()
            .getDataContext();
          SelectQuery query = new SelectQuery(EipTExtTimecardSystem.class);
          Expression exp1 = ExpressionFactory.matchDbExp(
            EipTExtTimecardSystem.SYSTEM_ID_PK_COLUMN, 1);
          query.setQualifier(exp1);

          List list = dataContext.performQuery(query);
          EipTExtTimecardSystem record = (EipTExtTimecardSystem) list.get(0);

          user_id.setValue(String.valueOf(record.getUserId()));
          system_name.setValue("");

          start_hour.setValue(String.valueOf(record.getStartHour()));
          start_minute.setValue(String.valueOf(record.getStartMinute()));
          end_hour.setValue(String.valueOf(record.getEndHour()));
          end_minute.setValue(String.valueOf(record.getEndMinute()));

          worktime_in.setValue(record.getWorktimeIn());
          resttime_in.setValue(record.getResttimeIn());
          worktime_out.setValue(record.getWorktimeOut());
          resttime_out.setValue(record.getResttimeOut());

          change_hour.setValue(String.valueOf(record.getChangeHour()));
          outgoing_add_flag.setValue(record.getOutgoingAddFlag());
        } catch (Exception ex) {
          logger.error("[ExtTimecardSystemFormData]", ex);
        }
      }
      if (ALEipConstants.MODE_UPDATE.equals(this.getMode())) {
        if (!(this.entity_id > 0)) {
          entity_id = Integer.parseInt(ALEipUtils.getTemp(rundata, context,
            ALEipConstants.ENTITY_ID));
          system_id.setValue(entity_id);
        }
      }
    }
    return res;
  }

  @Override
  protected void setValidator() throws ALPageNotFoundException,
      ALDBErrorException {
    start_hour.limitValue(0, 23);
    start_minute.limitValue(0, 59);
    end_hour.limitValue(0, 23);
    end_minute.limitValue(0, 59);

    worktime_in.limitValue(0, 480);
    worktime_out.limitValue(0, 480);
    resttime_in.limitValue(0, 480);
    resttime_out.limitValue(0, 480);
  }

  @Override
  protected boolean validate(List<String> msgList)
      throws ALPageNotFoundException, ALDBErrorException {

    try {
      SelectQuery query = new SelectQuery(EipTExtTimecardSystem.class);
      Expression exp1 = ExpressionFactory.matchExp(
        EipTExtTimecardSystem.SYSTEM_NAME_PROPERTY, system_name.getValue());
      query.setQualifier(exp1);
      if (ALEipConstants.MODE_UPDATE.equals(getMode())) {

        Expression exp2 = ExpressionFactory.noMatchDbExp(
          EipTExtTimecardSystem.SYSTEM_ID_PK_COLUMN, system_id.getValue());
        query.andQualifier(exp2);
      }
      if (dataContext.performQuery(query).size() != 0) {
        msgList.add("勤務形態『 <span class='em'>" + system_name.toString()
          + "</span> 』は既に登録されています。");
      }

      long start_time = start_hour.getValue() * 60 + start_minute.getValue();
      long end_time = end_hour.getValue() * 60 + end_minute.getValue();
      long change_time = change_hour.getValue() * 60;
      if (!isValidChangeTime(start_time, end_time, change_time)) {
        msgList
          .add("『 <span class='em'>日付切替時刻</span> 』は『 <span class='em'>勤務時間</span> 』の範囲外の時刻を指定してください。");
      }
    } catch (Exception ex) {
      logger.error("Exception", ex);
      return false;
    }

    system_name.validate(msgList);
    worktime_in.validate(msgList);
    resttime_in.validate(msgList);
    worktime_out.validate(msgList);
    resttime_out.validate(msgList);

    return (msgList.size() == 0);
  }

  /**
   * 勤務時間と日付切替時刻の関係の妥当性を検証します。
   * 
   * @param start_time
   * @param end_time
   * @param change_time
   * @return
   */
  private boolean isValidChangeTime(long start_time, long end_time,
      long change_time) {
    if (end_time <= start_time) {
      end_time += 24 * 60;
    }

    if (start_time <= change_time) {
      return false;
    } else {
      change_time += 24 * 60;
      if (end_time >= change_time) {
        return false;
      }
    }
    return true;
  }

  /**
   * 詳細データを取得する抽象メソッドです。
   * 
   * @param rundata
   * @param context
   * @return
   */
  protected Object selectDetail(RunData rundata, Context context)
      throws ALPageNotFoundException, ALDBErrorException {
    return null;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getStartTimeHour() {
    return this.start_hour;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getStartTimeMinute() {
    return this.start_minute;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getEndTimeHour() {
    return this.end_hour;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getEndTimeMinute() {
    return this.end_minute;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getWorktimeIn() {
    return this.worktime_in;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getWorktimeOut() {
    return this.worktime_out;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getResttimeIn() {
    return this.resttime_in;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getResttimeOut() {
    return this.resttime_out;
  }

  /**
   * 
   * @return
   */
  public ALNumberField getChangeHour() {
    return this.change_hour;
  }

  /**
   * 
   * @return
   */
  public ALStringField getSystemName() {
    return this.system_name;
  }

  /**
   * 
   * @return
   */
  public ALStringField getOutgoingAddFlag() {
    return this.outgoing_add_flag;
  }

  public ALNumberField getSystemId() {
    return this.system_id;
  }

}
