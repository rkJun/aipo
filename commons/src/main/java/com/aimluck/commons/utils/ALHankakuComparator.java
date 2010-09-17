/*
 * Aipo is a groupware program developed by Aimluck,Inc.
 * Copyright (C) 2004-2010 Aimluck,Inc.
 * http://aipostyle.com/
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

package com.aimluck.commons.utils;

/**
 * 半角文字の比較用クラスです。 <br />
 * 
 */
public class ALHankakuComparator<T> extends ALAbstractComparator<T> {

  /**
   * コンストラクタ
   * 
   */
  public ALHankakuComparator() {
  }

  /**
   * char配列を取得します。
   * 
   */
  @Override
  protected char[] getCharArray(Object obj) {
    if (obj instanceof char[][]) {
      return ((char[][]) obj)[ALKanaMapTable.INDEX_HANKAKU];
    } else {
      return (char[]) obj;
    }
  }

}
