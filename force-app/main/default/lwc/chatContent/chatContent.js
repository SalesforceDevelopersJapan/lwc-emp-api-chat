import { LightningElement, api } from "lwc";

export default class ChatContent extends LightningElement {
  @api
  contents = [];

  @api
  userId;

  @api
  maxHeight;

  @api
  scrollToBottom() {
    const chat = this.template.querySelector('.chat-wrapper');
    chat.scrollTop = chat.scrollHeight;
  }

  get applyMaxHeight() {
    const maxHeight = !this.maxHeight || this.maxHeight < 120 ? 320 : this.maxHeight;
    return `max-height: ${maxHeight}px`;
  }
}
