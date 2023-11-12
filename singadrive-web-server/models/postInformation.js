class PostInformation {
    constructor(postID, categoryID, username, displayName, tags, postDate) {
        this.postID = postID;
        this.categoryID = categoryID;
        this.username = username;
        this.displayName = displayName;
        this.tags = tags;
        this.postDate = postDate;

        this.title = '';
        this.content = '';
    }

    populatePost(title, content) {
        this.title = title;
        this.content = content;
    }

    toDictionaryObject() {
        return {
            "postID": this.postID,
            "categoryID": this.categoryID,
            "username": this.username,
            "displayName": this.displayName,
            "tags": this.tags,
            "postDate": this.postDate,
            "title": this.title,
            "content": this.content
        };
    }
}
  
module.exports = PostInformation;
  