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
package com.aimluck.eip.page;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.jetspeed.om.SecurityReference;
import org.apache.jetspeed.om.profile.Controller;
import org.apache.jetspeed.om.profile.Layout;
import org.apache.jetspeed.om.profile.MetaInfo;
import org.apache.jetspeed.om.profile.Portlets;
import org.apache.jetspeed.om.profile.psml.PsmlController;
import org.apache.jetspeed.om.profile.psml.PsmlLayout;
import org.apache.jetspeed.om.profile.psml.PsmlMetaInfo;
import org.apache.jetspeed.om.profile.psml.PsmlPortlets;
import org.apache.jetspeed.services.PortalToolkit;
import org.apache.jetspeed.services.idgenerator.JetspeedIdGenerator;
import org.apache.jetspeed.services.logging.JetspeedLogFactoryService;
import org.apache.jetspeed.services.logging.JetspeedLogger;
import org.apache.jetspeed.services.rundata.JetspeedRunData;
import org.apache.turbine.util.RunData;
import org.apache.velocity.context.Context;

import com.aimluck.commons.field.ALStringField;
import com.aimluck.eip.common.ALAbstractFormData;
import com.aimluck.eip.common.ALDBErrorException;
import com.aimluck.eip.common.ALEipConstants;
import com.aimluck.eip.common.ALPageNotFoundException;
import com.aimluck.eip.modules.actions.common.ALAction;
import com.aimluck.eip.page.util.PageUtils;
import com.aimluck.eip.util.ALEipUtils;

/**
 * ページ設定フォームデータを管理するためのクラスです。
 */
public class PageFormData extends ALAbstractFormData {
  /** logger */
  private static final JetspeedLogger logger = JetspeedLogFactoryService
    .getLogger(PageFormData.class.getName());

  /** 追加可能なページ（タブ）数。タブ [個人設定],[システム管理] を数に含める */
  private static final int MAX_PAGE_NUM = 7;

  /** 現在のページ数 */
  private int currentPageNum = 1;

  /** ページ ID */
  private ALStringField page_id;

  /** ページ名 */
  private ALStringField page_title;

  /** ページの説明 */
  private ALStringField page_description;

  /** ページを追加可能かどうか */
  private boolean enableAddPage = true;

  /**
   * 
   * @param action
   * @param rundata
   * @param context
   * @throws ALPageNotFoundException
   * @throws ALDBErrorException
   */
  @Override
  public void init(ALAction action, RunData rundata, Context context)
      throws ALPageNotFoundException, ALDBErrorException {

    // 自ポートレットからのリクエストであれば、パラメータを展開しセッションに保存する。
    if (ALEipUtils.isMatch(rundata, context)) {
      // ENTITY ID
      if (rundata.getParameters().containsKey(ALEipConstants.ENTITY_ID)) {
        // entityid=new を指定することによって明示的にセッション変数を削除することができる。
        if (rundata.getParameters().getString(ALEipConstants.ENTITY_ID).equals(
          "new")) {
          ALEipUtils.removeTemp(rundata, context, ALEipConstants.ENTITY_ID);
        } else {
          ALEipUtils.setTemp(
            rundata,
            context,
            ALEipConstants.ENTITY_ID,
            rundata.getParameters().getString(ALEipConstants.ENTITY_ID));
        }
      }
    }

    // 現在のページ（タブ）数を取得
    Portlets portlets =
      ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
    if (portlets != null) {
      Portlets[] portletList = portlets.getPortletsArray();
      currentPageNum = portletList.length;
    }
  }

  /**
   *
   */
  @Override
  protected void setValidator() {
    // ページ名
    page_title.setNotNull(true);
    page_title.limitMaxLength(10);

    // ページの説明
    page_description.setNotNull(false);
    page_description.limitMaxLength(20);
  }

  /**
   * 
   * @param msgList
   * @return
   */
  @Override
  protected boolean validate(List<String> msgList) {

    // ページ（タブ）数をチェック
    if (currentPageNum > MAX_PAGE_NUM) {
      msgList.add("これ以上ページを追加できません。");
    }

    if (page_title.getValue().equals("마이 페이지")) {
      msgList.add("ページ名「마이 페이지」はすでに追加されています。");
      return false;
    }

    page_title.validate(msgList);
    page_description.validate(msgList);
    return (msgList.size() == 0);
  }

  /**
   * 
   * @param rundata
   * @param context
   * @param msgList
   * @return
   */
  @Override
  protected boolean loadFormData(RunData rundata, Context context,
      List<String> msgList) {

    try {
      String pageId =
        ALEipUtils.getTemp(rundata, context, ALEipConstants.ENTITY_ID);
      if (pageId == null || pageId.equals("")) {
        // ENTITY_ID を含まないアクセスの場合：
        return false;
      }
      page_id.setValue(pageId);

      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
      if (portlets == null) {
        return false;
      }

      Portlets[] portletList = portlets.getPortletsArray();
      if (portletList == null) {
        return false;
      }

      String pageidStr = page_id.getValue();
      int length = portletList.length;
      for (int i = 0; i < length; i++) {
        if (portletList[i].getId().equals(pageidStr)) {
          MetaInfo info = portletList[i].getMetaInfo();
          if (info != null) {
            page_title.setValue(info.getTitle());
            page_description.setValue(info.getDescription());
          }
          break;
        }
      }
    } catch (Exception ex) {
      logger.error("page", ex);
      return false;
    }
    return true;
  }

  /**
   * 
   * @param rundata
   * @param context
   * @param msgList
   * @return
   */
  @Override
  protected boolean insertFormData(RunData rundata, Context context,
      List<String> msgList) {
    try {
      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();

      String title = page_title.getValue();
      if (title == null || title.equals("")) {
        title = "마이 페이지";
      }

      if (portlets != null) {
        // 個人設定 と システム管理の位置を一つ後ろにずらす
        List<Portlets> portletList = Arrays.asList(portlets.getPortletsArray());

        int length = portletList.size();
        if (length >= MAX_PAGE_NUM) {
          enableAddPage = false;
          msgList.add("これ以上ページを追加できません。");
          return false;
        }

        long move_pages = 1;
        Collections.sort(portletList, new Comparator<Portlets>() {
          @Override
          public int compare(Portlets o1, Portlets o2) {
            return (int) (o1.getLayout().getPosition() - o2
              .getLayout()
              .getPosition());
          }
        });

        if (ALEipUtils.isAdmin(rundata)) {
          // システム管理の移動分
          move_pages++;
        }

        int portletSize = portletList.size();
        long position = Long.MAX_VALUE;
        for (; move_pages > 0; move_pages--) {
          Layout layout =
            portletList.get((int) (portletSize - move_pages)).getLayout();
          long newPosition = layout.getPosition() + 1;
          layout.setPosition(newPosition);
          position = position > newPosition ? newPosition : position;
        }

        // レイアウトの作成
        Layout newLayout = new PsmlLayout();
        position--;
        newLayout.setPosition(position);
        newLayout.setSize(-1);

        // コントローラの作成
        Controller controller = new PsmlController();
        // デフォルト配置の指定
        controller.setName("TwoColumnsRight");

        Portlets p = new PsmlPortlets();
        p.setLayout(newLayout);
        p.setController(controller);
        p.setMetaInfo(new PsmlMetaInfo());
        p.getMetaInfo().setTitle(title);
        p.getMetaInfo().setDescription(page_description.getValue());
        p.setId(JetspeedIdGenerator.getNextPeid());
        SecurityReference defaultRef =
          PortalToolkit.getDefaultSecurityRef(((JetspeedRunData) rundata)
            .getProfile());
        if (defaultRef != null) {
          p.setSecurityRef(defaultRef);
        }

        // 個人設定、システム管理タブの前に配置する
        List<Portlets> olist = new ArrayList<Portlets>();
        List<Portlets> nolist = new ArrayList<Portlets>();

        Portlets[] childPortlets = portlets.getPortletsArray();
        for (Portlets _portlets : childPortlets) {
          if (_portlets.getSecurityRef().getParent().equals("owner-only")) {
            olist.add(_portlets);
          } else {
            nolist.add(_portlets);
          }
        }

        for (int pos = childPortlets.length; 0 < pos; pos--) {
          portlets.removePortlets(pos - 1);
        }

        for (Portlets _p : olist) {
          portlets.addPortlets(_p);
        }

        portlets.addPortlets(p);

        for (Portlets _p : nolist) {
          portlets.addPortlets(_p);
        }

        PageUtils.doSave(rundata, context);
        PageUtils.updateLayoutPositions(portlets);
      }
    } catch (Exception ex) {
      logger.error("page", ex);
      return false;
    }
    return true;
  }

  /**
   * 
   * @param rundata
   * @param context
   * @param msgList
   * @return
   */
  @Override
  protected boolean updateFormData(RunData rundata, Context context,
      List<String> msgList) {

    try {
      String pageId =
        ALEipUtils.getTemp(rundata, context, ALEipConstants.ENTITY_ID);
      if (pageId == null || pageId.equals("")) {
        return false;
      }
      page_id.setValue(pageId);

      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
      if (portlets == null) {
        return false;
      }

      Portlets[] portletList = portlets.getPortletsArray();
      if (portletList == null) {
        return false;
      }

      String pageidStr = page_id.getValue();
      int length = portletList.length;
      for (int i = 0; i < length; i++) {
        if (portletList[i].getId().equals(pageidStr)) {
          MetaInfo info = portletList[i].getMetaInfo();
          if (info == null) {
            info = new PsmlMetaInfo();
            portletList[i].setMetaInfo(info);
          }
          info.setTitle(page_title.getValue());
          info.setDescription(page_description.getValue());
          break;
        }
      }
      PageUtils.doSave(rundata, context);
      PageUtils.updateLayoutPositions(portlets);
    } catch (Exception ex) {
      logger.error("page", ex);
      return false;
    }
    return true;
  }

  /**
   * 
   * @param rundata
   * @param context
   * @param msgList
   * @return
   */
  @Override
  protected boolean deleteFormData(RunData rundata, Context context,
      List<String> msgList) {
    boolean result = false;
    try {
      String portletId =
        ALEipUtils.getTemp(rundata, context, ALEipConstants.ENTITY_ID);
      if (portletId == null || portletId.equals("")) {
        return false;
      }

      List<String> values = new ArrayList<String>();
      values.add(portletId);
      result = PageUtils.deletePages(rundata, context, values, msgList);
    } catch (Exception ex) {
      logger.error("page", ex);
      return false;
    }
    return result;
  }

  /**
   *
   */
  @Override
  public void initField() {
    // ページ ID
    page_id = new ALStringField();
    page_id.setFieldName("ページ ID");
    page_id.setTrim(true);

    // ページ名
    page_title = new ALStringField();
    page_title.setFieldName("ページ名");
    page_title.setTrim(true);

    // ページの説明
    page_description = new ALStringField();
    page_description.setFieldName("ページの説明");
    page_description.setTrim(true);
  }

  public ALStringField getPageId() {
    return page_id;
  }

  /**
   * @return
   */
  public ALStringField getPageDescription() {
    return page_description;
  }

  /**
   * @return
   */
  public ALStringField getPageTitle() {
    return page_title;
  }

  public boolean enableAddPage() {
    return enableAddPage;
  }

}
