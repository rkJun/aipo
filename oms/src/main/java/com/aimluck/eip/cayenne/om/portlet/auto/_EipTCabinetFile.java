package com.aimluck.eip.cayenne.om.portlet.auto;

/** Class _EipTCabinetFile was generated by Cayenne.
  * It is probably a good idea to avoid changing this class manually, 
  * since it may be overwritten next time code is regenerated. 
  * If you need to make any customizations, please use subclass. 
  */
public class _EipTCabinetFile extends org.apache.cayenne.CayenneDataObject {

    public static final String CREATE_DATE_PROPERTY = "createDate";
    public static final String CREATE_USER_ID_PROPERTY = "createUserId";
    public static final String FILE_NAME_PROPERTY = "fileName";
    public static final String FILE_PATH_PROPERTY = "filePath";
    public static final String FILE_SIZE_PROPERTY = "fileSize";
    public static final String FILE_TITLE_PROPERTY = "fileTitle";
    public static final String FOLDER_ID_PROPERTY = "folderId";
    public static final String NOTE_PROPERTY = "note";
    public static final String UPDATE_DATE_PROPERTY = "updateDate";
    public static final String UPDATE_USER_ID_PROPERTY = "updateUserId";
    public static final String EIP_TCABINET_FOLDER_PROPERTY = "eipTCabinetFolder";

    public static final String FILE_ID_PK_COLUMN = "FILE_ID";

    public void setCreateDate(java.util.Date createDate) {
        writeProperty("createDate", createDate);
    }
    public java.util.Date getCreateDate() {
        return (java.util.Date)readProperty("createDate");
    }
    
    
    public void setCreateUserId(Integer createUserId) {
        writeProperty("createUserId", createUserId);
    }
    public Integer getCreateUserId() {
        return (Integer)readProperty("createUserId");
    }
    
    
    public void setFileName(String fileName) {
        writeProperty("fileName", fileName);
    }
    public String getFileName() {
        return (String)readProperty("fileName");
    }
    
    
    public void setFilePath(String filePath) {
        writeProperty("filePath", filePath);
    }
    public String getFilePath() {
        return (String)readProperty("filePath");
    }
    
    
    public void setFileSize(Long fileSize) {
        writeProperty("fileSize", fileSize);
    }
    public Long getFileSize() {
        return (Long)readProperty("fileSize");
    }
    
    
    public void setFileTitle(String fileTitle) {
        writeProperty("fileTitle", fileTitle);
    }
    public String getFileTitle() {
        return (String)readProperty("fileTitle");
    }
    
    
    public void setFolderId(Integer folderId) {
        writeProperty("folderId", folderId);
    }
    public Integer getFolderId() {
        return (Integer)readProperty("folderId");
    }
    
    
    public void setNote(String note) {
        writeProperty("note", note);
    }
    public String getNote() {
        return (String)readProperty("note");
    }
    
    
    public void setUpdateDate(java.util.Date updateDate) {
        writeProperty("updateDate", updateDate);
    }
    public java.util.Date getUpdateDate() {
        return (java.util.Date)readProperty("updateDate");
    }
    
    
    public void setUpdateUserId(Integer updateUserId) {
        writeProperty("updateUserId", updateUserId);
    }
    public Integer getUpdateUserId() {
        return (Integer)readProperty("updateUserId");
    }
    
    
    public void setEipTCabinetFolder(com.aimluck.eip.cayenne.om.portlet.EipTCabinetFolder eipTCabinetFolder) {
        setToOneTarget("eipTCabinetFolder", eipTCabinetFolder, true);
    }

    public com.aimluck.eip.cayenne.om.portlet.EipTCabinetFolder getEipTCabinetFolder() {
        return (com.aimluck.eip.cayenne.om.portlet.EipTCabinetFolder)readProperty("eipTCabinetFolder");
    } 
    
    
}
