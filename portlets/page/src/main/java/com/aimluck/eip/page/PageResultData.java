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

import com.aimluck.commons.field.ALNumberField;
import com.aimluck.commons.field.ALStringField;
import com.aimluck.eip.common.ALData;

/**
 * ページ設定のResultDataです。
 */
public class PageResultData implements ALData {

  /** ページ ID */
  private ALStringField page_id;

  /** ページ名 */
  private ALStringField page_title;

  /** ページの説明 */
  private ALStringField page_description;

  /** 保持するポートレットの数 */
  private ALNumberField portlet_num;

  /**
   *
   */
  @Override
  public void initField() {
    page_id = new ALStringField();
    page_title = new ALStringField();
    page_description = new ALStringField();
    portlet_num = new ALNumberField();
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

  /**
   * @return
   */
  public ALNumberField getPortletNum() {
    return portlet_num;
  }

  public void setPageId(String field) {
    page_id.setValue(field);
  }

  /**
   * @param field
   */
  public void setPageDescription(String field) {
    page_description.setValue(field);
  }

  /**
   * @param field
   */
  public void setPageTitle(String field) {
    page_title.setValue(field);
  }

  /**
   * @param field
   */
  public void setPortletNum(int field) {
    portlet_num.setValue(field);
  }

  public boolean isMypage() {
    return page_title.getValue().equals("마이 페이지");
  }
}
