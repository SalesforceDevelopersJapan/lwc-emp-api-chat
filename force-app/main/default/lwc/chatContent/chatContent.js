import { LightningElement, api } from "lwc";

export default class ChatContent extends LightningElement {
  @api
  contents = [];

  @api
  userId;

  @api
  scrollToBottom() {
    const chat = this.template.querySelector('.chat-wrapper');
    chat.scrollTop = chat.scrollHeight;
  }
}
