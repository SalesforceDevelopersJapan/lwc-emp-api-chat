import { LightningElement, wire, track, api } from "lwc";
import { subscribe, unsubscribe, isEmpEnabled } from "lightning/empApi";
import getUserData from "@salesforce/apex/LwcPlatformEventChatController.getUserData";
import publish from "@salesforce/apex/LwcPlatformEventChatController.publish";

export default class EmpApiSample extends LightningElement {
  channelName = "/event/LWC_Chat__e";
  subscription = {};
  isChatting = false;
  shouldShowProfileOptions = false;
  userId = "";
  userName = "";
  profileType = "";
  profileValue = "";
  profileImageUrl;
  error = null;

  @api
  componentMaxHeight;

  @track
  comment;

  @track
  contents = [];

  @wire(getUserData)
  wiredUserData({ error, data }) {
    if (data) {
      this.userId = this.generateChatUserId(data.Id);
      this.userName = data.Name;
      this.profileType = "url";
      this.profileValue = data.SmallPhotoUrl;
      this.profileImageUrl = data.SmallPhotoUrl;
      this.error = null;
    } else if (error) {
      this.error = error;
    }
  }

  connectedCallback = async () => {
    const isEmpAvailable = await isEmpEnabled();
    if (!isEmpAvailable) {
      this.error = "unavailable";
    }
  };

  get isUrlProfile() {
    return this.profileType === "url";
  }

  get colorProfileClass() {
    return `color-icon ${this.profileValue}`;
  }

  handleProfileSelect() {
    this.shouldShowProfileOptions = !this.shouldShowProfileOptions;
  }

  handleProfileIconChange(e) {
    const v = e.currentTarget.dataset.iconOption;
    this.profileType = v === "url" ? "url" : "color";
    this.profileValue = v === "url" ? this.profileImageUrl : v;
    this.shouldShowProfileOptions = false;
  }

  handleUserName(e) {
    this.userName = e.target.value;
  }

  handleJoin = async () => {
    this.shouldShowProfileOptions = false;
    this.userName = this.userName.trim();
    if (!this.userName) {
      return;
    }

    const subscription = await subscribe(
      this.channelName,
      -1,
      this.onReceiveMessage
    ).catch();
    this.subscription = subscription;
    this.isChatting = true;
    await publish(this.buildEvent("join")).catch(this.handleError);
    const commentInput = this.template.querySelector(".comment-input");
    if (commentInput) {
      commentInput.focus();
    }
  };

  // Callback invoked whenever a new event message is received
  onReceiveMessage = async (message) => {
    await this.contents.push({
      ...message.data.payload,
      id: message.data.event.replayId
    });

    const chat = this.template.querySelector("c-chat-content");
    if (chat) {
      chat.scrollToBottom();
    }
  };

  handleLeave = async () => {
    this.isChatting = false;
    this.comment = "";
    this.contents = [];
    // Invoke unsubscribe method of empApi
    unsubscribe(this.subscription, () => {});
    await publish(this.buildEvent("leave")).catch(this.handleError);
  };

  handleCommentChange(e) {
    this.comment = e.target.value;
  }

  handleCommentPublish = async (e) => {
    e.preventDefault(false);
    this.comment = this.comment.trim();
    if (!this.comment) {
      return false;
    }
    const comment = this.comment;
    this.comment = "";
    await publish({ ...this.buildEvent("comment"), message: comment }).catch(
      this.handleError
    );
    return false;
  };

  handleError = (e) => {
    this.error = e;
  };

  buildEvent(messageType) {
    const data = {
      userId: this.userId,
      userName: this.userName,
      messageType: messageType,
      profileType: this.profileType,
      profileValue: this.profileValue
    };

    switch (messageType) {
      case "comment":
      case "join":
      case "leave":
        break;
      default:
        throw new TypeError();
    }
    return data;
  }

  generateChatUserId(userId) {
    return userId + Math.floor(Math.random() * 10000) + Date.now();
  }
}
