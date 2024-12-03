// AI Agent Widget Implementation
(function() {
  const WIDGET_URL = 'https://wondrous-melba-0abe63.netlify.app';
  
  class AIAgentWidget {
    constructor(config) {
      this.config = {
        agentId: '',
        theme: 'light',
        position: 'bottom-right',
        buttonSize: 'medium',
        borderRadius: 'medium',
        showAgentImage: true,
        ...config
      };
      this.isOpen = false;
      this.initialize();
    }

    initialize() {
      // Create widget container
      const container = document.getElementById('ai-agent-widget');
      if (!container) {
        console.error('AI Agent Widget: Container element not found');
        return;
      }

      // Set container styles
      container.style.position = 'fixed';
      container.style.zIndex = '999999';
      
      // Set position
      const positions = {
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' }
      };
      Object.assign(container.style, positions[this.config.position]);

      // Create and configure iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'ai-agent-widget-iframe';
      iframe.allow = 'microphone';
      iframe.src = `${WIDGET_URL}/widget?${new URLSearchParams(this.config).toString()}`;
      iframe.style.cssText = `
        border: none;
        width: 400px;
        height: 600px;
        max-height: 80vh;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: none;
        background: white;
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
        transform: translateY(20px);
      `;

      // Create toggle button
      const button = this.createToggleButton();
      
      // Add elements to container
      container.appendChild(iframe);
      container.appendChild(button);

      // Setup message handlers
      this.setupMessageHandlers();

      // Store references
      this.iframe = iframe;
      this.button = button;
    }

    createToggleButton() {
      const button = document.createElement('button');
      button.id = 'ai-agent-widget-button';
      
      // Set button size
      const sizes = {
        small: '48px',
        medium: '56px',
        large: '64px'
      };
      const size = sizes[this.config.buttonSize];
      
      button.style.cssText = `
        width: ${size};
        height: ${size};
        border-radius: ${
          this.config.borderRadius === 'none' ? '0' :
          this.config.borderRadius === 'small' ? '8px' :
          this.config.borderRadius === 'medium' ? '12px' : '16px'
        };
        border: none;
        background-color: ${this.config.theme === 'dark' ? '#1F2937' : '#3B82F6'};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-center;
        transition: transform 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      `;

      // Add icon
      button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 1 7.92 12.446a9 9 0 1 1 -16.626 -8.874a4.5 4.5 0 0 1 8.313 -3.572"/><path d="M12 21a2.5 2.5 0 0 0 2.5 -2.5"/></svg>`;

      // Add hover effect
      button.onmouseover = () => button.style.transform = 'scale(1.1)';
      button.onmouseout = () => button.style.transform = 'scale(1)';

      // Add click handler
      button.onclick = () => this.toggleWidget();

      return button;
    }

    setupMessageHandlers() {
      window.addEventListener('message', (event) => {
        if (event.origin !== WIDGET_URL) return;
        
        const { type, data } = event.data;
        switch (type) {
          case 'widget:ready':
            this.sendConfig();
            break;
          case 'widget:close':
            this.toggleWidget(false);
            break;
          case 'widget:resize':
            this.resizeWidget(data.height);
            break;
          case 'widget:message':
            this.handleWidgetMessage(data);
            break;
        }
      });
    }

    sendConfig() {
      this.iframe?.contentWindow?.postMessage({
        type: 'widget:config',
        data: this.config
      }, WIDGET_URL);
    }

    handleWidgetMessage(data) {
      // Handle widget messages (e.g., chat messages, events)
      console.log('Widget message:', data);
    }

    toggleWidget(show) {
      if (!this.iframe) return;

      if (typeof show === 'undefined') {
        show = !this.isOpen;
      }

      this.isOpen = show;
      this.iframe.style.display = show ? 'block' : 'none';

      if (show) {
        // Trigger animation after display is set
        requestAnimationFrame(() => {
          this.iframe.style.opacity = '1';
          this.iframe.style.transform = 'translateY(0)';
        });
      } else {
        this.iframe.style.opacity = '0';
        this.iframe.style.transform = 'translateY(20px)';
        // Hide after animation
        setTimeout(() => {
          if (!this.isOpen) {
            this.iframe.style.display = 'none';
          }
        }, 300);
      }

      // Notify iframe about visibility change
      this.iframe.contentWindow?.postMessage({
        type: 'widget:visibility',
        data: { isVisible: show }
      }, WIDGET_URL);
    }

    resizeWidget(height) {
      if (!this.iframe) return;
      const maxHeight = window.innerHeight * 0.8;
      this.iframe.style.height = `${Math.min(height, maxHeight)}px`;
    }
  }

  // Initialize widget if config exists
  if (window.voiceAIConfig) {
    window.aiAgentWidget = new AIAgentWidget(window.voiceAIConfig);
  }
})();