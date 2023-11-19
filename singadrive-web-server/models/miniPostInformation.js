// NOTE: For use, to display a list of posts at a category page...
class MiniPostInformation {
    constructor(postID, displayName, tags, postDate, lastActivity) {
        this.postID = postID;
        this.displayName = displayName;
        this.tags = tags;
        this.postDate = postDate;
        this.lastActivity = lastActivity;

        this.title = '';
        this.miniContent = '';
    }

    populatePost(title, miniContent) {
        this.title = title;
        this.miniContent = miniContent;
    }

    toDictionaryObject() {
        return {
            "postID": this.postID,
            "displayName": this.displayName,
            "tags": this.tags,
            "postDate": this.postDate,
            "title": this.title,
            "miniContent": this.miniContent,
            "lastActivity": this.lastActivity
        };
    }
}
  
module.exports = MiniPostInformation;
  