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

package com.aimluck.eip.timeline;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.jar.Attributes;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;

import org.apache.cayenne.exp.Expression;
import org.apache.cayenne.exp.ExpressionFactory;
import org.apache.jetspeed.services.logging.JetspeedLogFactoryService;
import org.apache.jetspeed.services.logging.JetspeedLogger;
import org.apache.turbine.util.RunData;
import org.apache.velocity.context.Context;

import com.aimluck.commons.field.ALStringField;
import com.aimluck.commons.utils.ALStringUtil;
import com.aimluck.eip.cayenne.om.portlet.EipTTimeline;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineFile;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineMap;
import com.aimluck.eip.cayenne.om.portlet.EipTTimelineUrl;
import com.aimluck.eip.common.ALAbstractSelectData;
import com.aimluck.eip.common.ALBaseUser;
import com.aimluck.eip.common.ALDBErrorException;
import com.aimluck.eip.common.ALData;
import com.aimluck.eip.common.ALEipConstants;
import com.aimluck.eip.common.ALEipGroup;
import com.aimluck.eip.common.ALEipManager;
import com.aimluck.eip.common.ALEipPost;
import com.aimluck.eip.common.ALEipUser;
import com.aimluck.eip.common.ALPageNotFoundException;
import com.aimluck.eip.common.ALPermissionException;
import com.aimluck.eip.fileupload.beans.FileuploadBean;
import com.aimluck.eip.fileupload.util.FileuploadUtils;
import com.aimluck.eip.modules.actions.common.ALAction;
import com.aimluck.eip.orm.Database;
import com.aimluck.eip.orm.query.Operations;
import com.aimluck.eip.orm.query.ResultList;
import com.aimluck.eip.orm.query.SelectQuery;
import com.aimluck.eip.services.accessctl.ALAccessControlConstants;
import com.aimluck.eip.timeline.util.TimelineUtils;
import com.aimluck.eip.util.ALEipUtils;

/**
 * タイムライントピックの検索データを管理するクラスです。 <BR>
 *
 */
public class TimelineSelectData extends
    ALAbstractSelectData<EipTTimeline, EipTTimeline> implements ALData {

  /** <code>TARGET_GROUP_NAME</code> グループによる表示切り替え用変数の識別子 */
  private final String TARGET_GROUP_NAME = "target_group_name";

  /** logger */
  private static final JetspeedLogger logger = JetspeedLogFactoryService
    .getLogger(TimelineSelectData.class.getName());

  /** トピックの総数 */
  private int topicSum;

  /** トピックの高さ（通常画面） */
  private int contentHeight;

  /** トピックの高さ（最大化画面） */
  private int contentHeightMax;

  /** スクロールの位置 */
  private int scrollTop;

  /** ログインユーザ ID */
  private int uid;

  private ALBaseUser baseuser;

  private ALEipUser user;

  /** 返信フォーム表示の有無（トピック詳細表示） */
  private final boolean showReplyForm = false;

  /** 他ユーザーの作成したトピックの編集権限 */
  private boolean hasAclUpdateTopicOthers;

  /** 他ユーザーの作成したトピックの削除権限 */
  private boolean hasAclDeleteTopicOthers;

  private ALStringField target_keyword;

  private List<Object> list;

  private final List<Integer> users = new ArrayList<Integer>();

  /** <code>userList</code> 表示切り替え用のユーザリスト */
  private List<ALEipUser> userList = null;

  /** <code>userid</code> ユーザーID */
  private String userid;

  private final List<Integer> useridList = new ArrayList<Integer>();

  /** <code>target_group_name</code> 表示対象の部署名 */
  protected String target_group_name;

  /** <code>myGroupList</code> グループリスト（My グループと部署） */
  private List<ALEipGroup> myGroupList = null;

  private boolean isAdmin = false;

  private boolean isFileUploadable;

  /** AppNameからportletIdを取得するハッシュ */
  private HashMap<String, String> portletIdFromAppId;

  /**
   *
   * @param action
   * @param rundata
   * @param context
   */
  @Override
  public void init(ALAction action, RunData rundata, Context context)
      throws ALPageNotFoundException, ALDBErrorException {
    super.init(action, rundata, context);

    portletIdFromAppId = ALEipUtils.getPortletFromAppIdMap(rundata);

    ALEipUtils.setTemp(rundata, context, LIST_SORT_STR, "update_date");
    ALEipUtils.setTemp(
      rundata,
      context,
      LIST_SORT_TYPE_STR,
      ALEipConstants.LIST_SORT_TYPE_DESC);

    uid = ALEipUtils.getUserId(rundata);
    baseuser = (ALBaseUser) rundata.getUser();
    user = ALEipUtils.getALEipUser(uid);
    isAdmin = ALEipUtils.isAdmin(uid);

    // My グループの一覧を取得する．
    List<ALEipGroup> myGroups = ALEipUtils.getMyGroups(rundata);
    myGroupList = new ArrayList<ALEipGroup>();
    int length = myGroups.size();
    for (int i = 0; i < length; i++) {
      myGroupList.add(myGroups.get(i));
    }

    isFileUploadable = ALEipUtils.isFileUploadable(rundata);
  }

  /**
   * My グループの一覧を取得する．
   *
   * @return
   */
  public List<ALEipGroup> getMyGroupList() {
    return myGroupList;
  }

  /**
   * 一覧データを取得します。 <BR>
   *
   * @param rundata
   * @param context
   * @return
   */
  @Override
  public ResultList<EipTTimeline> selectList(RunData rundata, Context context) {
    try {

      // 指定グループや指定ユーザをセッションに設定する．
      setupLists(rundata, context);

      String keywordParam = rundata.getParameters().getString("keyword");

      ResultList<EipTTimeline> list = new ResultList<EipTTimeline>();
      if ((useridList != null && useridList.size() > 0)) {
        // 表示するカラムのみデータベースから取得する．
        list =
          TimelineUtils.getTimelineList(
            uid,
            Arrays.asList(0),
            null,
            current_page,
            getRowsNum(),
            0,
            useridList,
            keywordParam);
      }

      return list;
    } catch (Exception ex) {
      logger.error("timeline", ex);
      return null;

    }
  }

  public ResultList<EipTTimeline> selectListNew(RunData rundata, Context context) {
    try {

      int minId =
        Integer.valueOf(ALEipUtils.getParameter(
          rundata,
          context,
          "lastTimelineId"));

      // 表示するカラムのみデータベースから取得する．
      ResultList<EipTTimeline> list =
        TimelineUtils.getTimelineList(
          uid,
          Arrays.asList(0),
          null,
          0,
          0,
          minId,
          useridList,
          null);

      return list;
    } catch (Exception ex) {
      logger.error("timeline", ex);
      return null;

    }
  }

  /**
   * 検索条件を設定した SelectQuery を返します。 <BR>
   *
   * @param rundata
   * @param context
   * @return
   */
  protected SelectQuery<EipTTimeline> getSelectQuery(RunData rundata,
      Context context) {

    SelectQuery<EipTTimeline> query = Database.query(EipTTimeline.class);
    query.where(Operations.eq(EipTTimeline.PARENT_ID_PROPERTY, Integer
      .valueOf(0)));

    return query;
  }

  /**
   * ResultData に値を格納して返します。（一覧データ） <BR>
   *
   * @param obj
   * @return
   */
  @Override
  protected Object getResultData(EipTTimeline record) {
    try {
      TimelineResultData rd = new TimelineResultData();
      rd.initField();
      rd.setTimelineId(record.getTimelineId().longValue());
      rd.setNote(record.getNote());
      rd.setOwnerId(record.getOwnerId().longValue());
      rd.setCreateDate(record.getCreateDate());
      rd.setUpdateDate(record.getUpdateDate());
      rd.setTimelineType(record.getTimelineType());
      rd.setAppId(record.getAppId());
      rd.setParams(record.getParams());
      rd.setLike(record.isLike());
      rd.setLikeCount(record.getLikeCount());
      String AppId = record.getAppId();
      // ToDoUtils.java・BlogUtils.javaに修正を加えてあるので、以下の６行はその内不要になる。
      if ("todo".equals(AppId)) {
        AppId = "ToDo";
      }
      if ("blog".equals(AppId)) {
        AppId = "Blog";
      }
      rd.setPortletId(portletIdFromAppId.get(AppId));

      if (!users.contains(record.getOwnerId())) {
        users.add(record.getOwnerId());
      }

      return rd;
    } catch (Exception ex) {
      logger.error("timeline", ex);
      return null;
    }
  }

  /**
   * ResultData に値を格納して返します。（詳細データ） <BR>
   *
   * @param obj
   * @return
   */
  @Override
  protected Object getResultDataDetail(EipTTimeline record)
      throws ALPageNotFoundException, ALDBErrorException {

    TimelineResultData rd = (TimelineResultData) getResultData(record);

    Integer id = record.getTimelineId();
    TimelineLikeSelectData ls = new TimelineLikeSelectData();
    List<TimelineLikeResultData> likeList =
      ls.getLikeList(record.getTimelineId());
    rd.setLikeList(likeList);
    rd.setLikeCount(likeList.size());
    for (TimelineLikeResultData lrd : likeList) {
      int value = (int) lrd.getUserId().getValue();
      if (value == uid) {
        rd.setLike(true);
        break;
      }
    }

    // 更新情報
    Map<Integer, List<TimelineResultData>> activitiesMap =
      getActivities(Arrays.asList(id));

    // コメント
    Map<Integer, List<TimelineResultData>> commentsMap =
      getComments(Arrays.asList(id));

    // URL
    Map<Integer, List<TimelineUrlResultData>> urlsMap =
      getUrls(Arrays.asList(id));

    // ファイル
    Map<Integer, List<FileuploadBean>> filesMap = getFiles(Arrays.asList(id));

    rd.setCoTopicList(commentsMap.get(id));
    rd.setCoActivityList(activitiesMap.get(id));
    rd.setUrlList(urlsMap.get(id));
    rd.setAttachmentFileList(filesMap.get(id));
    rd.setReplyCount(rd.getCoTopicList().size());
    rd.setParentId(record.getParentId().longValue());
    rd.setTimelineType(record.getTimelineType());

    loadAggregateUsers();

    return rd;
  }

  @Override
  public EipTTimeline selectDetail(RunData rundata, Context context)
      throws ALDBErrorException, ALPageNotFoundException {
    try {
      EipTTimeline timeline =
        TimelineUtils.getEipTTimelineParentEntry(rundata, context);
      return timeline;
    } catch (ALPageNotFoundException pageNotFound) {
      throw pageNotFound;
    }
  }

  protected Map<Integer, List<TimelineResultData>> getComments(
      List<Integer> parentIds) {
    List<EipTTimeline> list =
      TimelineUtils.getTimelineList(uid, parentIds, "T", -1, -1, 0, null, null);
    Map<Integer, List<TimelineResultData>> result =
      new HashMap<Integer, List<TimelineResultData>>(parentIds.size());
    for (EipTTimeline model : list) {
      Integer id = model.getParentId();
      List<TimelineResultData> rdList = result.get(id);
      if (rdList == null) {
        rdList = new ArrayList<TimelineResultData>();
      }
      rdList.add((TimelineResultData) getResultData(model));
      result.put(id, rdList);
    }

    return result;
  }

  protected Map<Integer, List<TimelineResultData>> getActivities(
      List<Integer> parentIds) {
    List<EipTTimeline> list =
      TimelineUtils.getTimelineList(
        uid,
        parentIds,
        "A",
        -1,
        -1,
        0,
        useridList,
        null);

    Map<Integer, List<TimelineResultData>> result =
      new HashMap<Integer, List<TimelineResultData>>(parentIds.size());
    for (EipTTimeline model : list) {
      Integer id = model.getParentId();
      List<TimelineResultData> rdList = result.get(id);
      if (rdList == null) {
        rdList = new ArrayList<TimelineResultData>();
      }
      rdList.add((TimelineResultData) getResultData(model));
      result.put(id, rdList);
    }

    return result;
  }

  protected Map<Integer, List<TimelineUrlResultData>> getUrls(
      List<Integer> parentIds) {
    if (parentIds == null || parentIds.size() == 0) {
      return new HashMap<Integer, List<TimelineUrlResultData>>();
    }
    SelectQuery<EipTTimelineUrl> query = Database.query(EipTTimelineUrl.class);
    query.where(Operations.in(EipTTimelineUrl.TIMELINE_ID_PROPERTY, parentIds));

    List<EipTTimelineUrl> list = query.fetchList();
    Map<Integer, List<TimelineUrlResultData>> result =
      new HashMap<Integer, List<TimelineUrlResultData>>(parentIds.size());
    for (EipTTimelineUrl model : list) {
      Integer id = model.getTimelineId();
      List<TimelineUrlResultData> rdList = result.get(id);
      if (rdList == null) {
        rdList = new ArrayList<TimelineUrlResultData>();
      }

      TimelineUrlResultData rd = new TimelineUrlResultData();
      rd.initField();
      rd.setTimelineUrlId(model.getTimelineUrlId().longValue());
      rd.setTimelineId(model.getTimelineId().longValue());
      rd.setThumbnail(model.getThumbnail());
      rd.setTitle(model.getTitle());
      rd.setUrl(model.getUrl());
      rd.setBody(model.getBody());
      boolean flag = false;
      if (model.getThumbnail() != null) {
        flag = true;
      }
      rd.setThumbnailFlag(flag);

      String url = model.getUrl();
      if (TimelineUtils.isYoutubeUrl(url)) {
        rd.setYoutubeId(TimelineUtils.getYoutubeId(url));
        rd.setYoutubeFlag(true);
      }
      rdList.add(rd);

      result.put(id, rdList);
    }

    return result;
  }

  protected Map<Integer, List<FileuploadBean>> getFiles(List<Integer> parentIds) {
    if (parentIds == null || parentIds.size() == 0) {
      return new HashMap<Integer, List<FileuploadBean>>();
    }
    SelectQuery<EipTTimelineFile> query =
      Database.query(EipTTimelineFile.class);
    query
      .where(Operations.in(EipTTimelineFile.TIMELINE_ID_PROPERTY, parentIds));

    query.orderAscending(EipTTimelineFile.UPDATE_DATE_PROPERTY);
    query.orderAscending(EipTTimelineFile.FILE_PATH_PROPERTY);

    List<EipTTimelineFile> list = query.fetchList();
    Map<Integer, List<FileuploadBean>> result =
      new HashMap<Integer, List<FileuploadBean>>(parentIds.size());
    for (EipTTimelineFile model : list) {
      Integer id = model.getTimelineId();
      List<FileuploadBean> rdList = result.get(id);
      if (rdList == null) {
        rdList = new ArrayList<FileuploadBean>();
      }

      String realname = model.getFileName();
      DataHandler hData = new DataHandler(new FileDataSource(realname));

      FileuploadBean filebean = new FileuploadBean();
      filebean.setFileId(model.getFileId().intValue());
      filebean.setFileName(realname);
      if (hData != null) {
        filebean.setContentType(hData.getContentType());
      }
      filebean.setIsImage(FileuploadUtils.isImage(realname));
      rdList.add(filebean);
      result.put(id, rdList);
    }

    return result;
  }

  @Override
  public boolean doViewList(ALAction action, RunData rundata, Context context) {
    try {
      init(action, rundata, context);
      doCheckAclPermission(
        rundata,
        context,
        ALAccessControlConstants.VALUE_ACL_LIST);
      action.setMode(ALEipConstants.MODE_LIST);

      // 投稿
      ResultList<EipTTimeline> resultList = selectList(rundata, context);
      if (resultList == null) {
        return false;
      }
      List<Integer> parentIds = new ArrayList<Integer>(resultList.size());
      for (EipTTimeline model : resultList) {
        parentIds.add(model.getTimelineId());
      }

      // 更新情報
      Map<Integer, List<TimelineResultData>> activitiesMap =
        getActivities(parentIds);

      // コメント
      List<Integer> commentIds = new ArrayList<Integer>();
      commentIds.addAll(parentIds);
      Iterator<List<TimelineResultData>> activitiesIter =
        activitiesMap.values().iterator();
      while (activitiesIter.hasNext()) {
        List<TimelineResultData> next = activitiesIter.next();
        for (TimelineResultData rd : next) {
          commentIds.add(Integer.valueOf((int) rd.getTimelineId().getValue()));
        }
      }

      Map<Integer, List<TimelineResultData>> commentsMap =
        getComments(commentIds);

      // URL
      Map<Integer, List<TimelineUrlResultData>> urlsMap = getUrls(parentIds);

      // ファイル
      Map<Integer, List<FileuploadBean>> filesMap = getFiles(parentIds);

      // ユーザー

      if (resultList.getTotalCount() > 0) {
        setPageParam(resultList.getTotalCount());
      }
      list = new ArrayList<Object>();
      for (EipTTimeline model : resultList) {
        Object object = getResultData(model);
        TimelineResultData rd = (TimelineResultData) object;

        rd.setCoTopicList(commentsMap.get(model.getTimelineId()));
        rd.setCoActivityList(activitiesMap.get(model.getTimelineId()));
        rd.setUrlList(urlsMap.get(model.getTimelineId()));
        rd.setAttachmentFileList(filesMap.get(model.getTimelineId()));
        rd.setReplyCount(rd.getCoTopicList().size());

        List<TimelineResultData> coac = rd.getCoActivityList();

        // 権限のあるアクティビティのみ表示する
        for (Iterator<TimelineResultData> iter = coac.iterator(); iter
          .hasNext();) {
          TimelineResultData coac_item = iter.next();
          coac_item.setCoTopicList(commentsMap.get(Integer
            .valueOf((int) coac_item.getTimelineId().getValue())));
          coac_item.setReplyCount(coac_item.getCoTopicList().size());

          SelectQuery<EipTTimelineMap> query_map =
            Database.query(EipTTimelineMap.class);
          Expression exp1 =
            ExpressionFactory.matchExp(
              EipTTimelineMap.EIP_TTIMELINE_PROPERTY,
              coac_item.getTimelineId().getValue());
          query_map.setQualifier(exp1);
          List<EipTTimelineMap> data_map = query_map.fetchList();

          List<String> userlist = new ArrayList<String>();
          for (int j = 0; j < data_map.size(); j++) {
            userlist.add(data_map.get(j).getLoginName());
          }

          if (!(user.getUserId().toString().equals(
            coac_item.getOwnerId().toString())
            || userlist.contains(user.getName().toString()) || userlist
              .contains("-1"))) {
            iter.remove();
          }
        }

        if (!(rd.getCoActivityList().size() == 0
          && rd.getCoTopicList().size() == 0 && rd.getNote().equals(""))) {
          list.add(rd);
        }
      }

      loadAggregateUsers();

      action.setResultData(this);
      action.putData(rundata, context);
      ALEipUtils.removeTemp(rundata, context, ALEipConstants.ENTITY_ID);
      return (list != null);
    } catch (ALPermissionException e) {
      ALEipUtils.redirectPermissionError(rundata);
      return false;
    } catch (ALPageNotFoundException e) {
      ALEipUtils.redirectPageNotFound(rundata);
      return false;
    } catch (ALDBErrorException e) {
      ALEipUtils.redirectDBError(rundata);
      return false;
    }

  }

  public boolean doViewListNew(ALAction action, RunData rundata, Context context) {
    try {
      init(action, rundata, context);
      doCheckAclPermission(
        rundata,
        context,
        ALAccessControlConstants.VALUE_ACL_LIST);
      action.setMode(ALEipConstants.MODE_LIST);

      // 投稿
      ResultList<EipTTimeline> resultList = selectListNew(rundata, context);
      if (resultList == null) {
        return false;
      }
      List<Integer> parentIds = new ArrayList<Integer>(resultList.size());
      for (EipTTimeline model : resultList) {
        parentIds.add(model.getTimelineId());
      }

      // 更新情報
      Map<Integer, List<TimelineResultData>> activitiesMap =
        getActivities(parentIds);

      // コメント
      List<Integer> commentIds = new ArrayList<Integer>();
      commentIds.addAll(parentIds);
      Iterator<List<TimelineResultData>> activitiesIter =
        activitiesMap.values().iterator();
      while (activitiesIter.hasNext()) {
        List<TimelineResultData> next = activitiesIter.next();
        for (TimelineResultData rd : next) {
          commentIds.add(Integer.valueOf((int) rd.getTimelineId().getValue()));
        }
      }

      Map<Integer, List<TimelineResultData>> commentsMap =
        getComments(commentIds);

      // URL
      Map<Integer, List<TimelineUrlResultData>> urlsMap = getUrls(parentIds);

      // ファイル
      Map<Integer, List<FileuploadBean>> filesMap = getFiles(parentIds);

      // ユーザー

      if (resultList.getTotalCount() > 0) {
        setPageParam(resultList.getTotalCount());
      }
      list = new ArrayList<Object>();
      for (EipTTimeline model : resultList) {
        Object object = getResultData(model);
        TimelineResultData rd = (TimelineResultData) object;

        rd.setCoTopicList(commentsMap.get(model.getTimelineId()));
        rd.setCoActivityList(activitiesMap.get(model.getTimelineId()));
        rd.setUrlList(urlsMap.get(model.getTimelineId()));
        rd.setAttachmentFileList(filesMap.get(model.getTimelineId()));
        rd.setReplyCount(rd.getCoTopicList().size());

        List<TimelineResultData> coac = rd.getCoActivityList();

        // 権限のあるアクティビティのみ表示する
        for (Iterator<TimelineResultData> iter = coac.iterator(); iter
          .hasNext();) {
          TimelineResultData coac_item = iter.next();
          coac_item.setCoTopicList(commentsMap.get(Integer
            .valueOf((int) coac_item.getTimelineId().getValue())));
          coac_item.setReplyCount(coac_item.getCoTopicList().size());

          SelectQuery<EipTTimelineMap> query_map =
            Database.query(EipTTimelineMap.class);
          Expression exp1 =
            ExpressionFactory.matchExp(
              EipTTimelineMap.EIP_TTIMELINE_PROPERTY,
              coac_item.getTimelineId().getValue());
          query_map.setQualifier(exp1);
          List<EipTTimelineMap> data_map = query_map.fetchList();

          List<String> userlist = new ArrayList<String>();
          for (int j = 0; j < data_map.size(); j++) {
            userlist.add(data_map.get(j).getLoginName());
          }

          if (!(user.getUserId().toString().equals(
            coac_item.getOwnerId().toString())
            || userlist.contains(user.getName().toString()) || userlist
              .contains("-1"))) {
            iter.remove();
          }
        }

        if (!(rd.getCoActivityList().size() == 0
          && rd.getCoTopicList().size() == 0 && rd.getNote().equals(""))) {
          list.add(rd);
        }
      }

      loadAggregateUsers();

      action.setResultData(this);
      action.putData(rundata, context);
      ALEipUtils.removeTemp(rundata, context, ALEipConstants.ENTITY_ID);
      return (list != null);
    } catch (ALPermissionException e) {
      ALEipUtils.redirectPermissionError(rundata);
      return false;
    } catch (ALPageNotFoundException e) {
      ALEipUtils.redirectPageNotFound(rundata);
      return false;
    } catch (ALDBErrorException e) {
      ALEipUtils.redirectDBError(rundata);
      return false;
    }

  }

  /**
   * トピックの総数を返す． <BR>
   *
   * @return
   */
  public int getTopicSum() {
    return topicSum;
  }

  /**
   * トピックの総数を返す． <BR>
   *
   * @return
   */
  public int getContentHeight() {
    return contentHeight;
  }

  /**
   * トピックの総数を返す． <BR>
   *
   * @return
   */
  public int getContentHeightMax() {
    return contentHeightMax;
  }

  /**
   * @return
   *
   */
  @Override
  protected Attributes getColumnMap() {
    Attributes map = new Attributes();
    map.putValue("update_date", EipTTimeline.UPDATE_DATE_PROPERTY);
    map.putValue("owner_name", EipTTimeline.OWNER_ID_PROPERTY);

    return map;
  }

  /**
   *
   * @param id
   * @return
   */
  public boolean isMatch(int id1, long id2) {
    return id1 == (int) id2;
  }

  public List<ALEipUser> getUsers(String groupname) {
    return ALEipUtils.getUsers(groupname);
  }

  public int getUserId() {
    return uid;
  }

  public boolean showReplyForm() {
    return showReplyForm;
  }

  /**
   * 他ユーザのトピックを編集する権限があるかどうかを返します。
   *
   * @return
   */
  public boolean hasAclUpdateTopicOthers() {
    return hasAclUpdateTopicOthers;
  }

  /**
   * 他ユーザのトピックを削除する権限があるかどうかを返します。
   *
   * @return
   */
  public boolean hasAclDeleteTopicOthers() {
    return hasAclDeleteTopicOthers;
  }

  /**
   * 部署の一覧を取得する．
   *
   * @return
   */
  public Map<Integer, ALEipPost> getPostMap() {
    return ALEipManager.getInstance().getPostMap();
  }

  public String getCurrentSearchWithSanitize() {
    return ALStringUtil.sanitizing(getCurrentSearch());
  }

  /**
   * @return target_keyword
   */
  public ALStringField getTargetKeyword() {
    return target_keyword;
  }

  /**
   * @return scrollTop
   */
  public int getScrollTop() {
    return scrollTop;
  }

  /**
   * @param scrollTop
   *          セットする scrollTop
   */
  public void setScrollTop(int scrollTop) {
    this.scrollTop = scrollTop;
  }

  public boolean hasMyPhoto() {
    if (baseuser == null) {
      return false;
    }
    return baseuser.getPhoto() != null;
  }

  public ALEipUser getMyUser() {
    return user;
  }

  /**
   *
   * @param id
   * @return
   */
  public boolean isAdmin() {
    return isAdmin;
  }

  @Override
  public List<Object> getList() {
    return list;
  }

  protected void loadAggregateUsers() {
    ALEipManager.getInstance().getUsers(users);
  }

  /**
   * 指定グループや指定ユーザをセッションに設定する．
   *
   * @param rundata
   * @param context
   * @throws ALDBErrorException
   */
  protected void setupLists(RunData rundata, Context context) {

    target_group_name = getTargetGroupName(rundata, context);
    current_filter = target_group_name;
    if ((!target_group_name.equals("")) && (!target_group_name.equals("all"))) {
      boolean existPost = false;
      for (int i = 0; i < myGroupList.size(); i++) {
        String pid = myGroupList.get(i).getName().toString();
        if (pid.equals(target_group_name)) {
          existPost = true;
          break;
        }
      }
      Map<Integer, ALEipPost> map = ALEipManager.getInstance().getPostMap();
      for (Map.Entry<Integer, ALEipPost> item : map.entrySet()) {
        String pid = item.getValue().getGroupName().toString();
        if (pid.equals(target_group_name)) {
          existPost = true;
          break;
        }
      }
      if (existPost) {
        userList = ALEipUtils.getUsers(target_group_name);
      } else {
        target_group_name = "all";
        userList = ALEipUtils.getUsers("LoginUser");
      }
    } else {
      userList = ALEipUtils.getUsers("LoginUser");
    }
    for (int i = 0; i < userList.size(); i++) {
      useridList.add((int) (userList.get(i).getUserId().getValue()));
    }
  }

  /**
   * 表示切り替えで指定したグループ ID を取得する．
   *
   * @param rundata
   * @param context
   * @return
   */
  protected String getTargetGroupName(RunData rundata, Context context) {
    return getTargetGroupName(rundata, context, TARGET_GROUP_NAME);
  }

  /**
   * 表示切り替えで指定したグループ ID を取得する．
   *
   * @param rundata
   * @param target_key
   * @param context
   * @return
   */
  protected String getTargetGroupName(RunData rundata, Context context,
      String target_key) {
    String target_group_name = null;
    String idParam = null;
    if (ALEipUtils.isMatch(rundata, context)) {
      // 自ポートレットへのリクエストの場合に，グループ名を取得する．
      idParam = rundata.getParameters().getString(target_key);
    }
    target_group_name = ALEipUtils.getTemp(rundata, context, target_key);

    if (idParam == null && target_group_name == null) {
      ALEipUtils.setTemp(rundata, context, target_key, "all");
      target_group_name = "all";
    } else if (idParam != null) {
      ALEipUtils.setTemp(rundata, context, target_key, idParam);
      target_group_name = idParam;
    }
    return target_group_name;
  }

  /**
   * 表示切り替え時に指定するグループ名
   *
   * @return
   */
  public String getTargetGroupName() {
    return target_group_name;
  }

  public boolean isFileUploadable() {
    return isFileUploadable;
  }

  /**
   * @param ContentHeightMax
   *          セットする ContentHeightMax
   */
  public void setContentHeightMax(int height) {
    contentHeight = height;
    contentHeightMax = height;
  }
}
