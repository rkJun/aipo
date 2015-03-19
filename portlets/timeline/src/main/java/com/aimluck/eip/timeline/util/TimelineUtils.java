//TimelineUtils.jav
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

package com.aimluck.eip.timeline.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.cayenne.DataRow;
import org.apache.cayenne.exp.Expression;
import org.apache.cayenne.exp.ExpressionFactory;
import org.apache.jetspeed.services.logging.JetspeedLogFactoryService;
import org.apache.jetspeed.services.logging.JetspeedLogger;
import org.apache.jetspeed.services.resources.JetspeedResources;
import org.apache.turbine.services.TurbineServices;
import org.apache.turbine.util.RunData;
import org.apache.velocity.context.Context;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.aimluck.commons.utils.ALDeleteFileUtil;
import com.aimluck.eip.cayenne.om.portlet.EipTBlogFile;
import com.aimluck.eip.cayenne.om.portlet.EipTTimeline;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineFile;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineLike;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineUrl;
import com.aimluck.eip.cayenne.om.security.TurbineUser;
import com.aimluck.eip.common.ALDBErrorException;
import com.aimluck.eip.common.ALEipConstants;
import com.aimluck.eip.common.ALFileNotRemovedException;
import com.aimluck.eip.common.ALPageNotFoundException;
import com.aimluck.eip.fileupload.beans.FileuploadBean;
import com.aimluck.eip.fileupload.beans.FileuploadLiteBean;
import com.aimluck.eip.fileupload.util.FileuploadUtils;
import com.aimluck.eip.orm.Database;
import com.aimluck.eip.orm.query.ResultList;
import com.aimluck.eip.orm.query.SQLTemplate;
import com.aimluck.eip.orm.query.SelectQuery;
import com.aimluck.eip.services.eventlog.ALEventlogConstants;
import com.aimluck.eip.services.eventlog.ALEventlogFactoryService;
import com.aimluck.eip.services.social.ALActivityService;
import com.aimluck.eip.services.social.model.ALActivityPutRequest;
import com.aimluck.eip.services.storage.ALStorageService;
import com.aimluck.eip.services.timeline.ALTimelineFactoryService;
import com.aimluck.eip.services.timeline.ALTimelineHandler;
import com.aimluck.eip.timeline.TimelineUrlBeans;
import com.aimluck.eip.timeline.TimelineUserResultData;
import com.aimluck.eip.util.ALCommonUtils;
import com.aimluck.eip.util.ALEipUtils;
import com.aimluck.eip.util.ALURLConnectionUtils;

/**
 * タイムラインのユーティリティクラス <BR>
 *
 */
public class TimelineUtils {

  /** logger */
  private static final JetspeedLogger logger = JetspeedLogFactoryService
    .getLogger(TimelineUtils.class.getName());

  /** 所有者の識別子 */
  public static final String OWNER_ID = "ownerid";

  /** タイムラインの添付ファイルを保管するディレクトリの指定 */
  public static final String FOLDER_FILEDIR_TIMELIME = JetspeedResources
    .getString("aipo.filedir", "");

  /** タイムラインの添付ファイルを保管するディレクトリのカテゴリキーの指定 */
  public static final String CATEGORY_KEY = JetspeedResources.getString(
    "aipo.timeline.categorykey",
    "");

  /** デフォルトエンコーディングを表わすシステムプロパティのキー */
  public static final String FILE_ENCODING = JetspeedResources.getString(
    "content.defaultencoding",
    "UTF-8");

  /** 全てのユーザーが閲覧／返信可 */
  public static final int ACCESS_PUBLIC_ALL = 0;

  /** 全てのユーザーが閲覧可。ただし返信できるのは所属メンバーのみ。 */
  public static final int ACCESS_PUBLIC_MEMBER = 1;

  /** 所属メンバーのみ閲覧／閲覧可 */
  public static final int ACCESS_SEACRET_MEMBER = 2;

  /** 自分のみ閲覧／返信可 */
  public static final int ACCESS_SEACRET_SELF = 3;

  /** カテゴリの公開／非公開の値（公開） */
  public static final String PUBLIC_FLG_VALUE_PUBLIC = "T";

  /** カテゴリの公開／非公開の値（非公開） */
  public static final String PUBLIC_FLG_VALUE_NONPUBLIC = "F";

  /** カテゴリの状態値（自分のみのカテゴリ） */
  public static final String STAT_VALUE_OWNER = "O";

  /** カテゴリの状態値（共有カテゴリ） */
  public static final String STAT_VALUE_SHARE = "S";

  /** カテゴリの状態値（公開カテゴリ） */
  public static final String STAT_VALUE_ALL = "A";

  public static final String TIMELIME_PORTLET_NAME = "Timeline";

  /** 検索キーワード変数の識別子 */
  public static final String TARGET_KEYWORD = "keyword";

  /**
   * トピックに対する返信数を返します
   *
   * @param timeline_id
   * @return
   */
  @Deprecated
  public static Integer countReply(Integer timeline_id) {
    SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);

    Expression exp1 =
      ExpressionFactory.matchExp(EipTTimeline.PARENT_ID_PROPERTY, timeline_id);
    Expression exp2 =
      ExpressionFactory.matchExp(EipTTimeline.TIMELINE_TYPE_PROPERTY, "T");
    query.setQualifier(exp1.andExp(exp2));

    return query.getCount();
  }

  /**
   * トピックオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @param isSuperUser
   *          カテゴリテーブルをJOINするかどうか
   * @return
   */
  public static List<EipTTimeline> getEipTTimelineListToDeleteAllUserTopic(
      RunData rundata, Context context, boolean isSuperUser, int topicid)
      throws ALPageNotFoundException, ALDBErrorException {
    try {
      SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);

      Expression exp02 =
        ExpressionFactory.matchDbExp(
          EipTTimeline.TIMELINE_ID_PK_COLUMN,
          topicid);
      Expression exp03 =
        ExpressionFactory.matchExp(EipTTimeline.PARENT_ID_PROPERTY, topicid);

      query.andQualifier((exp02).orExp(exp03));

      List<EipTTimeline> topics = query.fetchList();
      if (topics == null || topics.size() == 0) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[Timeline] Not found ID...");
        throw new ALPageNotFoundException();
      }

      return topics;
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      throw new ALDBErrorException();

    }
  }

  /**
   * トピックオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @param isSuperUser
   *          カテゴリテーブルをJOINするかどうか
   * @return
   */
  public static List<EipTTimeline> getEipTTimelineListToDeleteTopic(
      RunData rundata, Context context, boolean isSuperUser, int topicid)
      throws ALPageNotFoundException, ALDBErrorException {
    try {
      int userid = ALEipUtils.getUserId(rundata);

      SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);

      Expression exp01 =
        ExpressionFactory.matchDbExp(EipTTimeline.OWNER_ID_COLUMN, Integer
          .valueOf(userid));
      Expression exp02 =
        ExpressionFactory.matchDbExp(
          EipTTimeline.TIMELINE_ID_PK_COLUMN,
          topicid);
      Expression exp03 =
        ExpressionFactory.matchExp(EipTTimeline.PARENT_ID_PROPERTY, topicid);

      // scheduleの時
      String del_member_value = null;
      if (rundata.getParameters().containsKey("del_member_flag")) {
        del_member_value = rundata.getParameters().getString("del_member_flag");
      }

      if (del_member_value != null) {
        if (del_member_value.equals("0") || del_member_value.equals("1")) {
          query.andQualifier((exp02).orExp(exp03));
        }
      } else if (isSuperUser) {
        query.andQualifier((exp02).orExp(exp03));
      } else {
        query.andQualifier((exp01.andExp(exp02)).orExp(exp03));
      }

      List<EipTTimeline> topics = query.fetchList();
      if (topics == null || topics.size() == 0) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[Timeline] Not found ID...");
        throw new ALPageNotFoundException();
      }

      boolean isdelete = false;
      int size = topics.size();
      for (int i = 0; i < size; i++) {
        EipTTimeline topic = topics.get(i);
        if (del_member_value != null) {
          if (del_member_value.equals("0") || del_member_value.equals("1")) {
            isdelete = true;
            break;
          }
        } else if (topic.getOwnerId().intValue() == userid || isSuperUser) {
          isdelete = true;
          break;
        }
      }
      if (!isdelete) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[Timeline] Not found ID...");
        throw new ALPageNotFoundException();
      }

      return topics;
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      throw new ALDBErrorException();

    }
  }

  /**
   * いいねオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @param isSuperUser
   *          カテゴリテーブルをJOINするかどうか
   * @return
   */
  public static List<EipTTimelineLike> getEipTTimelineLikeListToDeleteTopic(
      RunData rundata, Context context, boolean isSuperUser)
      throws ALPageNotFoundException, ALDBErrorException {
    String topicid =
      ALEipUtils.getTemp(rundata, context, ALEipConstants.ENTITY_ID);
    try {
      if (topicid == null || Integer.valueOf(topicid) == null) {
        // トピック ID が空の場合
        logger.debug("[Timeline] Empty ID...");
        throw new ALPageNotFoundException();
      }

      int userid = ALEipUtils.getUserId(rundata);

      SelectQuery<EipTTimelineLike> query =
        Database.query(EipTTimelineLike.class);

      Expression exp01 =
        ExpressionFactory.matchDbExp(EipTTimelineLike.OWNER_ID_COLUMN, Integer
          .valueOf(userid));
      Expression exp02 =
        ExpressionFactory.matchDbExp(
          EipTTimelineLike.TIMELINE_ID_COLUMN,
          Integer.valueOf(topicid));

      if (isSuperUser) {
        query.andQualifier(exp02);
      } else {
        query.andQualifier(exp01.andExp(exp02));
      }

      List<EipTTimelineLike> topics = query.fetchList();
      if (topics == null || topics.size() == 0) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[Timeline] Not found ID...");
        throw new ALPageNotFoundException();
      }

      boolean isdelete = false;
      int size = topics.size();
      for (int i = 0; i < size; i++) {
        EipTTimelineLike topic = topics.get(i);
        if (topic.getOwnerId().intValue() == userid || isSuperUser) {
          isdelete = true;
          break;
        }
      }
      if (!isdelete) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[Timeline] Not found ID...");
        throw new ALPageNotFoundException();
      }

      return topics;
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      throw new ALDBErrorException();

    }
  }

  /**
   * 顔写真の有無の情報をもつユーザオブジェクトの一覧を取得する．
   *
   * @param org_id
   * @param groupname
   * @return
   */
  public static List<TimelineUserResultData> getTimelineUserResultDataList(
      String groupname) {
    List<TimelineUserResultData> list = new ArrayList<TimelineUserResultData>();

    // SQLの作成
    StringBuffer statement = new StringBuffer();
    statement.append("SELECT DISTINCT ");
    statement
      .append("  B.USER_ID, B.LOGIN_NAME, B.FIRST_NAME, B.LAST_NAME, B.HAS_PHOTO, B.PHOTO_MODIFIED, D.POSITION ");
    statement.append("FROM turbine_user_group_role as A ");
    statement.append("LEFT JOIN turbine_user as B ");
    statement.append("  on A.USER_ID = B.USER_ID ");
    statement.append("LEFT JOIN turbine_group as C ");
    statement.append("  on A.GROUP_ID = C.GROUP_ID ");
    statement.append("LEFT JOIN eip_m_user_position as D ");
    statement.append("  on A.USER_ID = D.USER_ID ");
    statement.append("WHERE B.USER_ID > 3 AND B.DISABLED = 'F'");
    statement.append(" AND C.GROUP_NAME = #bind($groupname) ");
    statement.append("ORDER BY D.POSITION");
    String query = statement.toString();

    try {
      // List ulist = BasePeer.executeQuery(query, org_id);

      List<DataRow> ulist =
        Database
          .sql(TurbineUser.class, query)
          .param("groupname", groupname)
          .fetchListAsDataRow();

      int recNum = ulist.size();

      DataRow dataRow;
      TimelineUserResultData user;

      // ユーザデータを作成し、返却リストへ格納
      for (int j = 0; j < recNum; j++) {
        dataRow = ulist.get(j);
        user = new TimelineUserResultData();
        user.initField();
        user.setUserId((Integer) Database.getFromDataRow(
          dataRow,
          TurbineUser.USER_ID_PK_COLUMN));
        user.setName((String) Database.getFromDataRow(
          dataRow,
          TurbineUser.LOGIN_NAME_COLUMN));
        user.setAliasName((String) Database.getFromDataRow(
          dataRow,
          TurbineUser.FIRST_NAME_COLUMN), (String) Database.getFromDataRow(
          dataRow,
          TurbineUser.LAST_NAME_COLUMN));
        user.setHasPhoto("T".equals(Database.getFromDataRow(
          dataRow,
          TurbineUser.HAS_PHOTO_COLUMN)));

        Object photoModified =
          Database.getFromDataRow(dataRow, TurbineUser.PHOTO_MODIFIED_COLUMN);
        Date date = new Date();
        try {
          date = (Date) photoModified;
        } catch (Throwable ignore) {

        }
        user.setPhotoModified(date.getTime());
        list.add(user);
      }
    } catch (Exception ex) {
      logger.error("[timelineUtils]", ex);
    }
    return list;
  }

  public static void createNewCommentActivity(EipTTimeline timeline,
      String loginName, String targetLoginName) {
    if (loginName.equals(targetLoginName)) {
      return;
    }
    List<String> recipients = new ArrayList<String>();
    recipients.add(targetLoginName);
    String title = new StringBuilder("あなたの投稿にコメントしました。").toString();
    String portletParams =
      new StringBuilder("?template=TimelineDetailScreen")
        .append("&entityid=")
        .append(timeline.getTimelineId())
        .toString();
    ALActivityService.create(new ALActivityPutRequest()
      .withAppId("timeline")
      .withLoginName(loginName)
      .withPortletParams(portletParams)
      .withRecipients(recipients)
      .withTitle(title)
      .withPriority(1f)
      .withExternalId(String.valueOf(timeline.getTimelineId())));
  }

  public static void createNewLikeActivity(EipTTimeline timeline,
      String loginName, String targetLoginName) {
    if (loginName.equals(targetLoginName)) {
      return;
    }
    List<String> recipients = new ArrayList<String>();
    recipients.add(targetLoginName);
    String title = new StringBuilder("あなたの投稿に「いいね！」が押されました。").toString();
    String portletParams =
      new StringBuilder("?template=TimelineDetailScreen")
        .append("&entityid=")
        .append(timeline.getTimelineId())
        .toString();
    ALActivityService.create(new ALActivityPutRequest()
      .withAppId("timeline")
      .withLoginName(loginName)
      .withPortletParams(portletParams)
      .withRecipients(recipients)
      .withTitle(title)
      .withPriority(1f)
      .withExternalId(String.valueOf(timeline.getTimelineId())));
  }

  /**
   * トピックオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @param isJoin
   *          カテゴリテーブルをJOINするかどうか
   * @return
   */
  public static EipTTimeline getEipTTimelineParentEntry(RunData rundata,
      Context context) throws ALPageNotFoundException, ALDBErrorException {
    String entryid =
      ALEipUtils.getTemp(rundata, context, ALEipConstants.ENTITY_ID);
    try {
      if (entryid == null || Integer.valueOf(entryid) == null) {
        // トピック ID が空の場合
        logger.debug("[TimelineUtil] Empty ID...");
        throw new ALPageNotFoundException();
      }

      SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);
      Expression exp =
        ExpressionFactory.matchDbExp(
          EipTTimeline.TIMELINE_ID_PK_COLUMN,
          Integer.valueOf(entryid));
      query.setQualifier(exp);
      List<EipTTimeline> entrys = query.fetchList();
      if (entrys == null || entrys.size() == 0) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[TimelineUtils] Not found ID...");
        throw new ALPageNotFoundException();
      }

      EipTTimeline entry = entrys.get(0);
      return entry;
    } catch (ALPageNotFoundException ex) {
      // 指定した トピック ID のレコードが見つからない場合
      logger.debug("[TimelineUtils] Not found ID...");
      throw new ALDBErrorException();
    } catch (Exception ex) {
      logger.error("[EntryUtils]", ex);
      throw new ALDBErrorException();

    }
  }

  /**
   * ユーザ毎の保存先（相対パス）を取得します。
   *
   * @param uid
   * @return
   */
  public static String getRelativePath(String fileName) {
    return new StringBuffer().append("/").append(fileName).toString();
  }

  /**
   * 添付ファイルを取得します。
   *
   * @param uid
   * @return
   */
  public static List<FileuploadLiteBean> getFileuploadList(RunData rundata) {
    String[] fileids =
      rundata
        .getParameters()
        .getStrings(FileuploadUtils.KEY_FILEUPLOAD_ID_LIST);
    if (fileids == null) {
      return null;
    }

    List<String> hadfileids = new ArrayList<String>();
    List<String> newfileids = new ArrayList<String>();

    for (int j = 0; j < fileids.length; j++) {
      if (fileids[j].trim().startsWith("s")) {
        hadfileids.add(fileids[j].trim().substring(1));
      } else {
        newfileids.add(fileids[j].trim());
      }
    }

    List<FileuploadLiteBean> fileNameList = new ArrayList<FileuploadLiteBean>();
    FileuploadLiteBean filebean = null;
    int fileid = 0;

    // 新規にアップロードされたファイルの処理
    if (newfileids.size() > 0) {
      String folderName =
        rundata.getParameters().getString(
          FileuploadUtils.KEY_FILEUPLOAD_FODLER_NAME);
      if (folderName == null || folderName.equals("")) {
        return null;
      }

      int length = newfileids.size();
      for (int i = 0; i < length; i++) {
        if (newfileids.get(i) == null || newfileids.get(i).equals("")) {
          continue;
        }

        try {
          fileid = Integer.parseInt(newfileids.get(i));
        } catch (Exception e) {
          continue;
        }

        if (fileid == 0) {
          filebean = new FileuploadLiteBean();
          filebean.initField();
          filebean.setFolderName("photo");
          filebean.setFileName("以前の写真ファイル");
          fileNameList.add(filebean);
        } else {
          BufferedReader reader = null;
          try {
            reader =
              new BufferedReader(new InputStreamReader(ALStorageService
                .getTmpFile(ALEipUtils.getUserId(rundata), folderName, fileid
                  + FileuploadUtils.EXT_FILENAME), FILE_ENCODING));
            String line = reader.readLine();
            if (line == null || line.length() <= 0) {
              continue;
            }

            filebean = new FileuploadLiteBean();
            filebean.initField();
            filebean.setFolderName(fileids[i]);
            filebean.setFileId(fileid);
            filebean.setFileName(line);
            fileNameList.add(filebean);
          } catch (Exception e) {
            logger.error("timeline", e);
          } finally {
            try {
              reader.close();
            } catch (Exception e) {
              logger.error("timeline", e);
            }
          }
        }

      }
    }

    if (hadfileids.size() > 0) {
      // すでにあるファイルの処理
      ArrayList<Integer> hadfileidsValue = new ArrayList<Integer>();
      for (int k = 0; k < hadfileids.size(); k++) {
        try {
          fileid = Integer.parseInt(hadfileids.get(k));
          hadfileidsValue.add(fileid);
        } catch (Exception e) {
          continue;
        }
      }

      try {
        SelectQuery<EipTTimelineFile> reqquery =
          Database.query(EipTTimelineFile.class);
        Expression reqexp1 =
          ExpressionFactory.inDbExp(
            EipTBlogFile.FILE_ID_PK_COLUMN,
            hadfileidsValue);
        reqquery.setQualifier(reqexp1);
        List<EipTTimelineFile> requests = reqquery.fetchList();
        int requestssize = requests.size();
        for (int i = 0; i < requestssize; i++) {
          EipTTimelineFile file = requests.get(i);
          filebean = new FileuploadBean();
          filebean.initField();
          filebean.setFileId(file.getFileId());
          filebean.setFileName(file.getFileName());
          filebean.setFlagNewFile(false);
          fileNameList.add(filebean);
        }
      } catch (Exception ex) {
        logger.error("[BlogUtils] Exception.", ex);
      }
    }
    return fileNameList;
  }

  /**
   * ファイルオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @return
   */
  public static EipTTimelineFile getEipTTimelineFile(RunData rundata)
      throws ALPageNotFoundException, ALDBErrorException {
    try {
      int attachmentIndex =
        rundata.getParameters().getInt("attachmentIndex", -1);
      if (attachmentIndex < 0) {
        // ID が空の場合
        logger.debug("[TimelineUtils] Empty ID...");
        throw new ALPageNotFoundException();

      }

      SelectQuery<EipTTimelineFile> query =
        Database.query(EipTTimelineFile.class);
      Expression exp =
        ExpressionFactory.matchDbExp(
          EipTTimelineFile.FILE_ID_PK_COLUMN,
          Integer.valueOf(attachmentIndex));
      query.andQualifier(exp);

      List<EipTTimelineFile> files = query.fetchList();
      if (files == null || files.size() == 0) {
        // 指定した ID のレコードが見つからない場合
        logger.debug("[TimelineUtils] Not found ID...");
        throw new ALPageNotFoundException();
      }
      return files.get(0);
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      throw new ALDBErrorException();
    }
  }

  /**
   * ファイルオブジェクトモデルを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @return
   */
  public static EipTTimelineUrl getEipTTimelineUrl(RunData rundata)
      throws ALPageNotFoundException, ALDBErrorException {
    try {
      int attachmentIndex =
        rundata.getParameters().getInt("attachmentIndex", -1);
      if (attachmentIndex < 0) {
        // ID が空の場合
        logger.debug("[TimelineUtils] Empty ID...");
        throw new ALPageNotFoundException();

      }

      SelectQuery<EipTTimelineUrl> query =
        Database.query(EipTTimelineUrl.class);
      Expression exp =
        ExpressionFactory.matchDbExp(EipTTimelineUrl.URL_ID_PK_COLUMN, Integer
          .valueOf(attachmentIndex));
      query.andQualifier(exp);

      List<EipTTimelineUrl> urls = query.fetchList();
      if (urls == null || urls.size() == 0) {
        // 指定した ID のレコードが見つからない場合
        logger.debug("[TimelineUtils] Not found ID...");
        throw new ALPageNotFoundException();
      }
      return urls.get(0);
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      throw new ALDBErrorException();
    }
  }

  /**
   * ユーザ毎のルート保存先（絶対パス）を取得します。
   *
   * @param uid
   * @return
   */
  public static String getSaveDirPath(String orgId, int uid) {
    return ALStorageService.getDocumentPath(
      FOLDER_FILEDIR_TIMELIME,
      CATEGORY_KEY + ALStorageService.separator() + uid);
  }

  /**
   * ファイル検索のクエリを返します
   *
   * @param requestid
   *          ファイルを検索するリクエストのid
   * @return query
   */
  @Deprecated
  public static SelectQuery<EipTTimelineFile> getSelectQueryForFiles(
      int requestid) {
    SelectQuery<EipTTimelineFile> query =
      Database.query(EipTTimelineFile.class);
    Expression exp =
      ExpressionFactory.matchDbExp(EipTTimeline.TIMELINE_ID_PK_COLUMN, Integer
        .valueOf(requestid));
    query.setQualifier(exp);
    return query;
  }

  public static void deleteFiles(int timelineId, String orgId, int uid,
      List<String> fpaths) throws ALFileNotRemovedException {
    ALDeleteFileUtil.deleteFiles(
      timelineId,
      EipTTimelineFile.EIP_TTIMELINE_PROPERTY,
      getSaveDirPath(orgId, uid),
      fpaths,
      EipTTimelineFile.class);
  }

  public static void deleteLikes(int timelineId) {
    SelectQuery<EipTTimelineLike> query =
      Database.query(EipTTimelineLike.class);
    query.andQualifier(ExpressionFactory.matchDbExp(
      EipTTimelineLike.EIP_TTIMELINE_PROPERTY,
      timelineId));
    List<EipTTimelineLike> likes = query.fetchList();
    Database.deleteAll(likes);
    Database.commit();
  }

  public static Document getDocument(String string) {
    return getDocument(string, "JISAutoDetect");
  }

  public static Document getDocument(String string, String defaultCharset) {
    DOMParser parser = new DOMParser();
    try {
      URL url = new URL(string);
      HttpURLConnection con = ALURLConnectionUtils.openUrlConnection(url);
      con.setConnectTimeout(10000);
      con.setUseCaches(false);
      con.addRequestProperty("_", UUID.randomUUID().toString());
      con.addRequestProperty("User-Agent", ALURLConnectionUtils.USER_AGENT);
      con.addRequestProperty(
        "Accept-Encoding",
        ALURLConnectionUtils.ACCEPT_ENCODING);

      // HTTPヘッダのcontentTypeのcharsetを読み込む
      String contentType = con.getContentType();
      if (contentType == null) {
        return null;
      }
      String charsetSearch =
        contentType.replaceFirst("(?i).*charset=(.*)", "$1");
      String contentTypeCharset = con.getContentEncoding();
      BufferedReader reader = null;
      if (!contentType.equals(charsetSearch)) {
        contentTypeCharset = charsetSearch;
      }
      if (contentTypeCharset == null) {
        reader =
          new BufferedReader(new InputStreamReader(
            con.getInputStream(),
            defaultCharset));
      } else {
        reader =
          new BufferedReader(new InputStreamReader(
            con.getInputStream(),
            contentTypeCharset));
      }

      InputSource source = new InputSource(reader);
      parser.setFeature("http://xml.org/sax/features/namespaces", false);
      parser.parse(source);

      // documentからmetaタグのcharsetを読み込む
      Document document = parser.getDocument();
      if (document == null) {
        logger.error("[TimelineUtils] parser.getDocument() is Null");
      }
      String metaTagCharset = getMetaTagCharset(document);
      if (metaTagCharset != null && !metaTagCharset.equals(contentTypeCharset)) {
        // デフォルトのcharsetと異なっていた場合、新しいcharsetで再読み込み
        HttpURLConnection reconnection =
          ALURLConnectionUtils.openUrlConnection(url);
        reconnection.setConnectTimeout(10000);
        reconnection.setUseCaches(false);
        reconnection.addRequestProperty("_", UUID.randomUUID().toString());
        reconnection.addRequestProperty(
          "User-Agent",
          ALURLConnectionUtils.USER_AGENT);
        reconnection.addRequestProperty(
          "Accept-Encoding",
          ALURLConnectionUtils.ACCEPT_ENCODING);

        reader =
          new BufferedReader(new InputStreamReader(reconnection
            .getInputStream(), metaTagCharset));
        source = new InputSource(reader);
        parser.setFeature("http://xml.org/sax/features/namespaces", false);
        parser.parse(source);
        document = parser.getDocument();
        if (document == null) {
          logger.error("[TimelineUtils] parser.getDocument() is Null");
        }
      }

      reader.close();
      return document;
    } catch (DOMException e) {
      if (!"UTF-8".equals(defaultCharset)) {
        return getDocument(string, "UTF-8");
      }
      logger.error("[TimelineUtils]", e);
      return null;
    } catch (Exception ex) {
      logger.error("[TimelineUtils]", ex);
      return null;
    }
  }

  /**
   * 読み込んだdocumentからmetaタグ内のcharset属性を読み取るメソッド
   *
   * @param document
   * @return
   */
  public static String getMetaTagCharset(Document document) {
    String charset = null;
    NodeList metaList = document.getElementsByTagName("meta");
    for (int i = 0; i < metaList.getLength(); i++) {
      Element element = (Element) metaList.item(i);
      String src = element.getAttribute("content");
      if (src != null && src.contains("charset=")) {
        charset = src.replaceFirst("(?i).*charset=(.*)", "$1");
        break;
      }
      src = element.getAttribute("charset");
      if (src != null && !src.equals("")) {
        charset = src;
        break;
      }
    }
    return charset;
  }

  public static boolean isYoutubeUrl(String url) {
    return url.startsWith("http://www.youtube.com")
      || url.startsWith("https://www.youtube.com");
  }

  public static String getYoutubeId(String url) {
    int startpoint = url.indexOf("v=");
    int endpoint = url.indexOf("&", startpoint);
    if (endpoint == -1) {
      endpoint = url.length();
    }
    return url.substring(startpoint + 2, endpoint);
  }

  /**
   *
   * @param url_str
   * @return
   * @throws Exception
   */
  public static TimelineUrlBeans perseFromUrl(String url_str) throws Exception {
    Document document = getDocument(url_str);
    if (document != null) {
      TimelineUrlBeans tub = new TimelineUrlBeans();
      String pagePath = url_str.substring(0, url_str.lastIndexOf('/') + 1);
      String basePath =
        url_str.substring(
          0,
          url_str.indexOf('/', url_str.indexOf("//") + 2) + 1);
      if (pagePath.endsWith("//")) {
        pagePath =
          basePath =
            (new StringBuilder()).append(url_str).append("/").toString();
      }

      if (isYoutubeUrl(pagePath)) {
        tub.setYoutubeId(getYoutubeId(url_str));
        tub.setYoutubeFlag(true);
      }

      List<String> images = new ArrayList<String>();
      NodeList nodeListProperty = document.getElementsByTagName("meta");
      String ogimage = null;
      for (int i = 0; i < nodeListProperty.getLength(); i++) {
        Element element = (Element) nodeListProperty.item(i);
        String property = element.getAttribute("property");
        if ("og:image".equals(property)) {
          ogimage = element.getAttribute("content");
        }
      }
      if (ogimage != null && FileFilter(ogimage)) {
        images.add(ogimage);
      }
      String protocolString =
        url_str.substring(0, url_str.lastIndexOf(':') + 1);

      NodeList nodeListImage = document.getElementsByTagName("img");
      for (int i = 0; i < nodeListImage.getLength(); i++) {
        Element element = (Element) nodeListImage.item(i);
        String src = element.getAttribute("src");

        if (src.startsWith("//")) {
          src =
            (new StringBuilder()).append(protocolString).append(src).toString();
        } else if (src.startsWith("/")) {
          src =
            (new StringBuilder())
              .append(basePath)
              .append(src.substring(1))
              .toString();
        } else if (!src.startsWith("http")) {
          src = (new StringBuilder()).append(pagePath).append(src).toString();
        }
        src = src.replaceAll("\n", "");
        src = src.replaceAll("\t", "");
        if (src != null && FileFilter(src)) {
          images.add(src);
        }
      }
      tub.setImages(images);

      NodeList nodeListTitle = document.getElementsByTagName("title");
      for (int i = 0; i < nodeListTitle.getLength(); i++) {
        Element element = (Element) nodeListTitle.item(i);

        String title;
        if (element.getFirstChild() != null) {
          title = element.getFirstChild().getNodeValue();
        } else {
          title = url_str;
        }

        if (title != null) {
          tub.setTitle(title);
          break;
        }
      }

      NodeList nodeListBody = document.getElementsByTagName("meta");
      for (int i = 0; i < nodeListBody.getLength(); i++) {
        Element element = (Element) nodeListBody.item(i);
        String name = element.getAttribute("name");
        if (name.equals("description")) {
          String body = element.getAttribute("content");
          if (body != null) {
            tub.setBody(body);
            break;
          }
        }
      }

      tub.setUrl(url_str);

      return tub;
    } else {
      return null;
    }
  }

  public static boolean FileFilter(String fileName) {
    String FILTER_EXTENSION_SVG = ".svg";
    if (fileName.endsWith(FILTER_EXTENSION_SVG)) {
      return false;
    }
    return true;
  }

  public static ResultList<EipTTimeline> getTimelineList(Integer userId,
      List<Integer> parentIds, String type, int page, int limit, int minId,
      List<Integer> userIds) {

    if (parentIds == null || parentIds.size() == 0) {
      return new ResultList<EipTTimeline>(
        new ArrayList<EipTTimeline>(0),
        -1,
        -1,
        0);
    }

    StringBuilder select = new StringBuilder();

    select.append("SELECT");
    select.append(" eip_t_timeline.app_id,");
    select.append(" eip_t_timeline.create_date,");
    select.append(" eip_t_timeline.external_id,");
    select.append(" eip_t_timeline.note,");
    select.append(" eip_t_timeline.owner_id,");
    select.append(" eip_t_timeline.params,");
    select.append(" eip_t_timeline.parent_id,");
    select.append(" eip_t_timeline.timeline_type,");
    select.append(" eip_t_timeline.update_date,");
    select.append(" eip_t_timeline.timeline_id,");

    // ログインユーザーがいいね！をしているかどうか
    select
      .append(" (SELECT COUNT(*) FROM eip_t_timeline_like t0 WHERE (t0.timeline_id = eip_t_timeline.timeline_id) AND (t0.owner_id = #bind($user_id))) AS is_like,");
    // いいね！の総数
    select
      .append(" (SELECT COUNT(*) FROM eip_t_timeline_like t1 WHERE t1.timeline_id = eip_t_timeline.timeline_id) AS l_count");

    StringBuilder count = new StringBuilder();
    count.append("SELECT count(eip_t_timeline.timeline_id) AS c ");

    StringBuilder body = new StringBuilder();
    body.append(" FROM eip_t_timeline WHERE ");
    if (type != null) {
      body.append(" eip_t_timeline.timeline_type = #bind($type) AND ");
    }
    body.append(" eip_t_timeline.parent_id IN (");
    boolean isFirst = true;
    for (Integer num : parentIds) {
      if (!isFirst) {
        body.append(",");

      }
      body.append(num.intValue());
      isFirst = false;
    }
    body.append(")");

    if (minId > 0) {
      body.append(" AND eip_t_timeline.timeline_id > " + minId);
    }

    if ((userIds != null && userIds.size() > 0)) {
      body.append(" AND (");
      body.append("eip_t_timeline.owner_id IN (");

      boolean isFirstusers = true;
      for (Integer num : userIds) {
        if (!isFirstusers) {
          body.append(",");
        }
        body.append(num.intValue());
        isFirstusers = false;
      }
      body.append(")");
      body.append(")");
    }

    StringBuilder last = new StringBuilder();

    if ("T".equals(type)) {
      last.append(" ORDER BY eip_t_timeline.create_date ASC");
    } else {
      last.append(" ORDER BY eip_t_timeline.update_date DESC");
    }

    SQLTemplate<EipTTimeline> countQuery =
      Database
        .sql(EipTTimeline.class, count.toString() + body.toString())
        .param("user_id", Integer.valueOf(userId));
    if (type != null) {
      countQuery.param("type", type);
    }

    int countValue = 0;
    if (page > 0 && limit > 0) {
      List<DataRow> fetchCount = countQuery.fetchListAsDataRow();

      for (DataRow row : fetchCount) {
        countValue = ((Long) row.get("c")).intValue();
      }

      int offset = 0;
      if (limit > 0) {
        int num = ((int) (Math.ceil(countValue / (double) limit)));
        if ((num > 0) && (num < page)) {
          page = num;
        }
        offset = limit * (page - 1);
      } else {
        page = 1;
      }

      last.append(" LIMIT ");
      last.append(limit);
      last.append(" OFFSET ");
      last.append(offset);
    }

    SQLTemplate<EipTTimeline> query =
      Database.sql(
        EipTTimeline.class,
        select.toString() + body.toString() + last.toString()).param(
        "user_id",
        Integer.valueOf(userId));
    if (type != null) {
      query.param("type", type);
    }

    List<DataRow> fetchList = query.fetchListAsDataRow();

    List<EipTTimeline> list = new ArrayList<EipTTimeline>();
    for (DataRow row : fetchList) {
      Long is_like = (Long) row.get("is_like");
      Long l_count = (Long) row.get("l_count");
      EipTTimeline object = Database.objectFromRowData(row, EipTTimeline.class);
      object.setLike(is_like.intValue() > 0);
      object.setLikeCount(l_count.intValue());
      list.add(object);

    }

    if (page > 0 && limit > 0) {
      return new ResultList<EipTTimeline>(list, page, limit, countValue);
    } else {
      return new ResultList<EipTTimeline>(list, -1, -1, list.size());
    }

  }

  public static void deleteTimelineActivity(RunData rundata, Context context,
      String appId, String ExternalId) throws ALFileNotRemovedException {
    SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);
    Expression exp1 =
      ExpressionFactory.matchExp(EipTTimeline.APP_ID_PROPERTY, appId);
    Expression exp2 =
      ExpressionFactory.matchExp(EipTTimeline.EXTERNAL_ID_PROPERTY, ExternalId);
    query.setQualifier(exp1.andExp(exp2));

    EipTTimeline parent = query.fetchSingle();

    try {
      if (parent != null) {
        deleteTimelineFromParent(rundata, context, appId, parent);
      }
    } catch (ALDBErrorException e) {
      e.printStackTrace();
    }

  }

  public static boolean deleteTimelineFromParent(RunData rundata,
      Context context, String appId, EipTTimeline parent)
      throws ALDBErrorException, ALFileNotRemovedException {
    try {
      int uid = ALEipUtils.getUserId(rundata);
      String orgId = Database.getDomainName();

      // オブジェクトモデルを取得
      List<EipTTimeline> list;

      if (appId.equals("Cabinet")) {
        list =
          getEipTTimelineListToDeleteAllUserTopic(rundata, context, ALEipUtils
            .isAdmin(rundata), parent.getTimelineId());
      } else {
        list =
          getEipTTimelineListToDeleteTopic(rundata, context, ALEipUtils
            .isAdmin(rundata), parent.getTimelineId());
      }

      if (list == null) {
        // 指定した トピック ID のレコードが見つからない場合
        logger.debug("[TimelineFormData] Not found List...");
        throw new ALPageNotFoundException();
      }

      List<Integer> topicIdList = new ArrayList<Integer>();
      List<Integer> topicParentIdList = new ArrayList<Integer>();
      List<String> topicTypeList = new ArrayList<String>();
      EipTTimeline topic = null;
      int size = list.size();
      for (int i = 0; i < size; i++) {
        topic = list.get(i);
        topicIdList.add(topic.getTimelineId());
        topicTypeList.add(topic.getTimelineType());
        topicParentIdList.add(topic.getParentId());
      }

      // トピックを削除
      SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);
      Expression exp =
        ExpressionFactory.inDbExp(
          EipTTimeline.TIMELINE_ID_PK_COLUMN,
          topicIdList);
      query.setQualifier(exp);

      List<EipTTimeline> topics = query.fetchList();

      List<String> fpaths = new ArrayList<String>();
      if (topics.size() > 0) {
        int tsize = topics.size();
        for (int i = 0; i < tsize; i++) {
          EipTTimeline item = topics.get(i);
          List<?> files = item.getEipTTimelineFile();
          if (files != null && files.size() > 0) {
            int fsize = files.size();
            for (int j = 0; j < fsize; j++) {
              fpaths.add(((EipTTimelineFile) files.get(j)).getFilePath());
            }
          }
          deleteFiles(item.getTimelineId(), orgId, item
            .getTurbineUser()
            .getUserId(), fpaths);
          TimelineUtils.deleteLikes(topics.get(i).getTimelineId());
        }
      }

      if (topicTypeList.get(0).equals("A")) {
        deleteParent(list, topicParentIdList, orgId, uid);
      }

      Database.deleteAll(topics);
      Database.commit();

      ALTimelineFactoryService tlservice =
        (ALTimelineFactoryService) ((TurbineServices) TurbineServices
          .getInstance()).getService(ALTimelineFactoryService.SERVICE_NAME);
      ALTimelineHandler timelinehandler = tlservice.getTimelineHandler();
      timelinehandler.pushToken(rundata, String.valueOf(uid));

      // イベントログに保存
      ALEventlogFactoryService.getInstance().getEventlogHandler().log(
        parent.getTimelineId(),
        ALEventlogConstants.PORTLET_TYPE_TIMELINE,
        compressString(parent.getNote()));
    } catch (ALFileNotRemovedException e) {
      // ALFileNotRemovedException
      Database.rollback();
      logger.error("[TimelineSelectData]", e);
      throw new ALFileNotRemovedException();
    } catch (RuntimeException e) {
      // RuntimeException
      Database.rollback();
      logger.error("[TimelineSelectData]", e);
      throw new ALDBErrorException();
    } catch (Exception e) {
      Database.rollback();
      logger.error("[TimelineSelectData]", e);
      throw new ALDBErrorException();
    }
    return true;
  }

  public static void deleteParent(List<EipTTimeline> list,
      List<Integer> topicParentIdList, String orgId, int uid) throws Exception {
    int topicparent = 0;
    topicparent = topicParentIdList.get(0);

    SelectQuery<EipTTimeline> dQuery = Database.query(EipTTimeline.class);

    Expression exp1 =
      ExpressionFactory.matchExp(EipTTimeline.PARENT_ID_PROPERTY, topicparent);
    dQuery.andQualifier(exp1);
    dQuery.distinct(true);
    List<EipTTimeline> tList = dQuery.fetchList();

    if (tList.size() == 1) {
      SelectQuery<EipTTimeline> ddQuery = Database.query(EipTTimeline.class);
      Expression exp2 =
        ExpressionFactory.matchDbExp(
          EipTTimeline.TIMELINE_ID_PK_COLUMN,
          topicparent);
      ddQuery.setQualifier(exp2);

      List<EipTTimeline> tParent = ddQuery.fetchList();// tParent=削除対象

      List<String> fpaths = new ArrayList<String>();
      if (tParent.size() > 0) {
        int tsize = tParent.size();
        for (int i = 0; i < tsize; i++) {
          EipTTimeline item = tParent.get(i);
          List<?> files = item.getEipTTimelineFile();
          deleteFiles(item.getTimelineId(), orgId, item
            .getTurbineUser()
            .getUserId(), fpaths);
          TimelineUtils.deleteLikes(tParent.get(i).getTimelineId());
          if (files != null && files.size() > 0) {
            int fsize = files.size();
            for (int j = 0; j < fsize; j++) {
              fpaths.add(((EipTTimelineFile) files.get(j)).getFilePath());
            }
          }
        }
      }

      Database.deleteAll(tParent);
      Database.commit();
    }
  }

  /**
   * 50文字に引数の文字列を丸める。
   *
   * @param src
   *          元の文字列
   * @return 処理後の文字列
   */
  public static String compressString(String src) {
    return ALCommonUtils.compressString(src, 50);
  }
}
