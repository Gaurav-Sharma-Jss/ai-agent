export class ChatBubble extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['message', 'sender', 'timestamp'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const message = this.getAttribute('message') || '';
    const sender = this.getAttribute('sender') || 'user';
    const timestamp = this.getAttribute('timestamp') || new Date().toISOString();

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 8px 0;
          }
          .bubble {
            max-width: 80%;
            padding: 12px;
            border-radius: 12px;
            margin: ${sender === 'user' ? '0 0 0 auto' : '0 auto 0 0'};
            background-color: ${sender === 'user' ? 'var(--primary-color, #3B82F6)' : 'var(--bubble-bg, #F3F4F6)'};
            color: ${sender === 'user' ? '#FFFFFF' : 'var(--text-color, #1F2937)'};
          }
          .timestamp {
            font-size: 0.75rem;
            color: var(--timestamp-color, #6B7280);
            margin-top: 4px;
            text-align: ${sender === 'user' ? 'right' : 'left'};
          }
        </style>
        <div class="bubble">
          ${message}
          <div class="timestamp">
            ${new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
      `;
    }
  }
}

customElements.define('chat-bubble', ChatBubble);