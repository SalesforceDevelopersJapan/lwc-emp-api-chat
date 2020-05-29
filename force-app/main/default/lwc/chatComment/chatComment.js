import { LightningElement, api } from "lwc";

export default class ChatComment extends LightningElement {
  @api
  comment;

  @api
  userId;

  get isProfileImage() {
    return this.comment.ProfileImageType__c === "url";
  }

  get isMyComment() {
    return this.userId === this.comment.ChatUserId__c;
  }

  get commentClassName() {
    return this.isMyComment
      ? "comment-wrapper mycomment"
      : "comment-wrapper othercomment";
  }

  get isComment() {
    return this.comment.MessageType__c === "comment";
  }

  get messageTime() {
    const dt = new Date(this.comment.CreatedDate);
    const min = dt.getMinutes() >= 10 ? dt.getMinutes() : "0" + dt.getMinutes();
    return `${dt.getHours()}:${min}`;
  }

  get systemMessage() {
    return this.comment.MessageType__c === "join"
      ? `${this.comment.ChatUserName__c} joined!`
      : `${this.comment.ChatUserName__c} left`;
  }

  get colorProfileClass() {
    return `color-icon ${this.comment.ProfileImageValue__c}`;
  }
}
