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
    if(!this.maxHeight) {
      return `max-height: 100%`;
    }
    const maxHeight = this.maxHeight < 120 ? 320 : this.maxHeight;
    return `max-height: ${maxHeight}px`;
  }
}
