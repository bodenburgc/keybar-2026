// TODO(BODE): backport to BODE-shopify
if (!customElements.get('mobile-dock')) {
  customElements.define(
    'mobile-dock',
    class MobileDock extends HTMLElement {
      constructor() {
        super();

        if (Shopify.designMode) {
          this.init();
        }
        else {
          new theme.initWhenVisible(theme.utils.throttle(this.init.bind(this)));
        }
      }

      get section() {
        return this._section = this._section || this.closest('.mobile-dock-section');
      }

      init() {
        if (this.initialized) return;
        this.initialized = true;
        this.setAttribute('loaded', '');

        this.detectForHeader();
        this.detectForFooter();
        setTimeout(this.setHeight.bind(this));

        this._onMatchSmall = this.setHeight.bind(this);
        document.addEventListener('matchSmall', this._onMatchSmall);

        if (Shopify.designMode) {
          this.section.addEventListener('shopify:section:select', () => {
            this.section.classList.add('shopify-active');
          });
          this.section.addEventListener('shopify:section:deselect', () => {
            this.section.classList.remove('shopify-active');
          });
        }
      }

      disconnectedCallback() {
        if (this._onMatchSmall) {
          document.removeEventListener('matchSmall', this._onMatchSmall);
        }
        if (this._headerObserver) {
          this._headerObserver.disconnect();
        }
        if (this._footerObserver) {
          this._footerObserver.disconnect();
        }
      }

      detectForHeader() {
        const header = document.querySelector('.header-section');
        if (header === null) {
          this.section.classList.add('active');
          return;
        }

        if (!header.classList.contains('header-sticky')) {
          this._headerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              this.section.classList.remove('active');
            }
            else {
              this.section.classList.add('active');
            }
          });
          this._headerObserver.observe(header);
        }
      }

      detectForFooter() {
        const footer = document.querySelector('.footer-copyright');
        if (footer === null) return;

        this._footerObserver = new IntersectionObserver((entries) => {
          if (!theme.config.mqlSmall) return;
          this.classList.toggle('active', entries[0].isIntersecting);
        });
        this._footerObserver.observe(footer);
      }

      setHeight() {
        document.documentElement.style.setProperty('--mobile-dock-height', `${this.getBoundingClientRect().height.toFixed(1)}px`);
      }
    }, { extends: 'nav' }
  );
}
