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
package com.aimluck.eip.page.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import org.apache.jetspeed.om.profile.Entry;
import org.apache.jetspeed.om.profile.Layout;
import org.apache.jetspeed.om.profile.Portlets;
import org.apache.jetspeed.om.profile.Profile;
import org.apache.jetspeed.portal.Portlet;
import org.apache.jetspeed.portal.security.portlets.PortletWrapper;
import org.apache.jetspeed.services.PortletFactory;
import org.apache.jetspeed.services.logging.JetspeedLogFactoryService;
import org.apache.jetspeed.services.logging.JetspeedLogger;
import org.apache.jetspeed.services.rundata.JetspeedRunData;
import org.apache.turbine.util.RunData;
import org.apache.velocity.context.Context;

import com.aimluck.eip.modules.actions.controls.Restore;

/**
 * ページ設定のユーティリティクラスです
 */
public class PageUtils {

  /** logger */
  private static final JetspeedLogger logger = JetspeedLogFactoryService
    .getLogger(PageUtils.class.getName());

  public static final String PAGE_PORTLET_NAME = "Page";

  public static Portlets getPortlets(RunData rundata, String portletId) {
    Portlets portletSet = null;
    Portlets portlets =
      ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
    if (portlets == null) {
      return null;
    }

    Portlets[] portletList = portlets.getPortletsArray();
    if (portletList == null) {
      return null;
    }

    int length = portletList.length;
    for (int i = 0; i < length; i++) {
      if (portletList[i].getId().equals(portletId)) {
        portletSet = portletList[i];
        break;
      }
    }
    return portletSet;
  }

  public static boolean deletePages(RunData rundata, Context context,
      List<String> values, List<String> msgList) {

    try {
      if (values == null || values.size() <= 0) {
        return false;
      }

      // 個人設定のページ ID を取得する．
      String portletId = rundata.getParameters().getString("js_peid");
      String pageId = getPortletSetId(rundata, portletId);

      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
      if (portlets == null) {
        return false;
      }

      new Restore().doPerform(rundata);

      Portlets p = null;

      List<Integer> deletedList = new ArrayList<Integer>();
      List<String> list = new ArrayList<String>(values);
      int valuesLength = values.size();
      int portletsLength = portlets.getPortletsCount();
      for (int i = 0; i < portletsLength; i++) {
        for (int j = 0; j < valuesLength; j++) {
          p = portlets.getPortlets(i);

          // 個人設定とシステム管理と마이 페이지のページは削除不可にする．
          if (p.getId().equals(pageId)
            || p.getSecurityRef().getParent().equals("admin-view")
            || p.getTitle().equals("마이 페이지")) {
            continue;
          }

          if (p.getId().equals(list.get(j))) {
            deletedList.add(Integer.valueOf(i));
            break;
          }
        }
      }

      int length = deletedList.size();
      Collections.sort(deletedList);
      for (int i = length - 1; i >= 0; i--) {
        portlets.removePortlets((deletedList.get(i)).intValue());
      }

      doSave(rundata, context);

      updateLayoutPositions(portlets);
    } catch (Exception ex) {
      logger.error("page", ex);
      return false;
    }
    return true;
  }

  /**
   * Updates the layout position based on physical order within the resorted
   * portlet list. Assures that layout position is always consecutive and within
   * bounds.
   * 
   * @param set
   */
  public static void updateLayoutPositions(Portlets set) {
    if (set == null) {
      return;
    }

    // Load the panes into a list
    List<Portlets> list = new ArrayList<Portlets>();
    for (int i = 0; i < set.getPortletsCount(); i++) {
      Portlets pane = set.getPortlets(i);
      list.add(pane);
    }

    // Sort list using the current layout position
    Collections.sort(list, new Comparator<Portlets>() {
      @Override
      public int compare(Portlets pane1, Portlets pane2) {
        Long pos1 = Long.valueOf(pane1.getLayout().getPosition());
        Long pos2 = Long.valueOf(pane2.getLayout().getPosition());
        return pos1.compareTo(pos2);
      }
    });

    // Update the layout position based on the physical order within the sorted
    // list
    int position = 0;
    for (Iterator<Portlets> iter = list.iterator(); iter.hasNext();) {
      Portlets pane = iter.next();
      Layout layout = pane.getLayout();
      layout.setPosition(position++);
    }
  }

  /** Save the general informations for this set */
  public static void doSave(RunData rundata, Context context) throws Exception {

    Profile profile = ((JetspeedRunData) rundata).getProfile();
    try {
      String mtype = rundata.getParameters().getString("mtype");

      if (mtype != null) {
        profile.setMediaType(mtype);
      }
      profile.store();

      // PsmlManager.refresh(((JetspeedRunData)
      // rundata).getCustomizedProfile());
    } catch (Exception ex) {
      logger.error("page", ex);
    }
  }

  /**
   * 指定したポートレット ID を含むページの ID を取得する．
   * 
   * @param rundata
   * @param portletId
   * @return
   */
  public static String getPortletSetId(RunData rundata, String portletId) {
    try {
      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
      if (portlets == null) {
        return null;
      }

      Portlets[] portletList = portlets.getPortletsArray();
      if (portletList == null) {
        return null;
      }

      int length = portletList.length;
      for (int i = 0; i < length; i++) {
        Entry[] entries = portletList[i].getEntriesArray();
        if (entries == null || entries.length <= 0) {
          continue;
        }

        int ent_length = entries.length;
        for (int j = 0; j < ent_length; j++) {
          if (entries[j].getId().equals(portletId)) {
            return portletList[i].getId();
          }
        }
      }
    } catch (Exception ex) {
      logger.error("page", ex);
      return null;
    }
    return null;
  }

  /**
   * 指定したポートレット ID を持つポートレットのオブジェクトを取得する．
   * 
   * @param rundata
   * @param portletId
   * @return
   */
  public static Portlet getPortlet(RunData rundata, String portletId) {
    try {
      Portlets portlets =
        ((JetspeedRunData) rundata).getProfile().getDocument().getPortlets();
      if (portlets == null) {
        return null;
      }

      Portlets[] portletList = portlets.getPortletsArray();
      if (portletList == null) {
        return null;
      }

      int length = portletList.length;
      for (int i = 0; i < length; i++) {
        Entry[] entries = portletList[i].getEntriesArray();
        if (entries == null || entries.length <= 0) {
          continue;
        }

        int ent_length = entries.length;
        for (int j = 0; j < ent_length; j++) {
          if (entries[j].getId().equals(portletId)) {
            PortletWrapper wrapper =
              (PortletWrapper) PortletFactory.getPortlet(entries[j]);
            if (wrapper != null) {
              return wrapper.getPortlet();
            } else {
              return null;
            }
          }
        }
      }
    } catch (Exception ex) {
      logger.error("page", ex);
      return null;
    }
    return null;
  }
}
