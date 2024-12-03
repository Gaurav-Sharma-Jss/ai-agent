export class ChatInput extends HTMLElement {
  private input: HTMLInputElement | null = null;
  private sendButton: HTMLButtonElement | null = null;
  private micButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 12px;
            border-top: 1px solid var(--border-color, #E5E7EB);
          }
          .input-container {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          input {
            flex: 1;
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid var(--border-color, #E5E7EB);
            outline: none;
            font-size: 14px;
          }
          button {
            padding: 8px;
            border-radius: 50%;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--icon-color, #6B7280);
            transition: color 0.2s;
          }
          button:hover {
            color: var(--primary-color, #3B82F6);
          }
          .mic-active {
            color: var(--error-color, #EF4444);
          }
        </style>
        <div class="input-container">
          <button id="mic">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>
          <input type="text" placeholder="Type your message..." />
          <button id="send">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      `;

      this.input = this.shadowRoot.querySelector('input');
      this.sendButton = this.shadowRoot.querySelector('#send');
      this.micButton = this.shadowRoot.querySelector('#mic');
    }
  }

  private setupListeners() {
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.dispatchMessage();
      }
    });

    this.sendButton?.addEventListener('click', () => {
      this.dispatchMessage();
    });

    this.micButton?.addEventListener('click', () => {
      this.toggleSpeechRecognition();
    });
  }

  private dispatchMessage() {
    if (this.input?.value.trim()) {
      this.dispatchEvent(new CustomEvent('message', {
        detail: { text: this.input.value.trim() }
      }));
      this.input.value = '';
    }
  }

  private toggleSpeechRecognition() {
    const event = this.micButton?.classList.contains('mic-active') ? 'stopSpeech' : 'startSpeech';
    this.micButton?.classList.toggle('mic-active');
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('chat-input', ChatInput);