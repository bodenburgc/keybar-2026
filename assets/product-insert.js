/**
 * Product Insert Picker Web Component
 *
 * Multi-select insert picker with checkbox cards, inline mini color swatches,
 * and compact variant popovers. Coordinates with product-addon via accordion.
 */

// TODO(BODE): backport to BODE-shopify

if (!customElements.get('product-insert-picker')) {
  customElements.define('product-insert-picker', class ProductInsertPicker extends HTMLElement {
    constructor() {
      super();

      this.cards = this.querySelectorAll('[data-insert-card]');
      this.hiddenInputs = this.querySelectorAll('[data-insert-variant-input]');
      this.mainCard = this.querySelector('[data-insert-main-card]');
      this.detailsPanel = this.querySelector('[data-insert-details]');
      this.summaryEl = this.querySelector('[data-insert-summary]');
      this.priceBadge = this.querySelector('[data-insert-badge]');
      this.customizeText = this.querySelector('[data-insert-customize-text]');

      this.sectionId = this.dataset.sectionId;
      this.basePrice = parseInt(this.dataset.basePrice, 10) || 0;
      this.currencySymbol = this.dataset.currencySymbol || '$';
      this.formId = this.dataset.formId;

      // Store product data for summary
      this.productData = new Map();
      this.cards.forEach(card => {
        this.productData.set(card.dataset.productId, {
          title: card.dataset.productTitle,
          price: parseInt(card.dataset.defaultPrice, 10) || 0
        });
      });

      this.abortController = new AbortController();
      this.bindEvents();
      this.setupFormIntegration();
      this.updateState();
    }

    bindEvents() {
      const signal = this.abortController.signal;

      // Main card toggle
      if (this.mainCard) {
        this.mainCard.addEventListener('click', () => this.toggleDetails(), { signal });
        this.mainCard.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleDetails();
          }
        }, { signal });
      }

      // Checkbox toggles on cards
      this.cards.forEach(card => {
        const checkbox = card.querySelector('[data-insert-checkbox]');
        if (checkbox) {
          checkbox.addEventListener('change', () => this.onInsertToggle(card, checkbox), { signal });
        }

        // Change link for variant popover (non-color variants)
        const changeLink = card.querySelector('[data-insert-change]');
        if (changeLink) {
          changeLink.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openVariantPopover(card.dataset.productId);
          }, { signal });
        }

        // Inline mini swatch clicks (color variants)
        card.querySelectorAll('[data-insert-mini-swatch]').forEach(swatch => {
          swatch.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onMiniSwatchClick(card, swatch);
          }, { signal });
        });
      });

      // Variant selection within popovers
      this.querySelectorAll('[data-insert-popover] input[type="radio"]').forEach(input => {
        input.addEventListener('change', (e) => this.onVariantChange(e), { signal });
      });

      // Popover done buttons
      this.querySelectorAll('[data-insert-popover-done]').forEach(btn => {
        btn.addEventListener('click', () => this.closeVariantPopover(), { signal });
      });

      // Close popover on click outside
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          this.closeVariantPopover();
        }
      }, { signal });

      // Accordion: collapse when a sibling picker expands
      document.addEventListener('picker:expand', (e) => {
        if (e.detail.id !== this.id) {
          this.collapseDetails();
        }
      }, { signal });
    }

    disconnectedCallback() {
      this.abortController.abort();
    }

    setupFormIntegration() {
      if (!this.formId) return;

      this.hiddenInputs.forEach(input => {
        input.setAttribute('data-is-insert-bundle', 'true');
      });
    }

    /**
     * Toggle expanded/collapsed state
     */
    toggleDetails() {
      const isExpanded = this.mainCard?.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        this.collapseDetails();
      } else {
        this.expandDetails();
      }
    }

    /**
     * Expand — dispatches accordion event
     */
    expandDetails() {
      this.classList.add('is-expanded');
      this.detailsPanel?.removeAttribute('hidden');
      this.mainCard?.setAttribute('aria-expanded', 'true');

      // Accordion: tell sibling pickers to collapse
      this.dispatchEvent(new CustomEvent('picker:expand', { bubbles: true, detail: { id: this.id } }));
    }

    collapseDetails() {
      this.classList.remove('is-expanded');
      this.detailsPanel?.setAttribute('hidden', '');
      this.mainCard?.setAttribute('aria-expanded', 'false');
      this.closeVariantPopover();
    }

    /**
     * Handle insert checkbox toggle
     */
    onInsertToggle(card, checkbox) {
      const productId = card.dataset.productId;
      const hiddenInput = this.querySelector(`[data-insert-variant-input][data-product-id="${productId}"]`);

      if (checkbox.checked) {
        card.classList.add('is-selected');
        if (hiddenInput) hiddenInput.checked = true;
      } else {
        card.classList.remove('is-selected');
        if (hiddenInput) hiddenInput.checked = false;
      }

      this.updateState();
    }

    /**
     * Handle inline mini swatch click — selects variant without popover
     */
    onMiniSwatchClick(card, swatch) {
      const productId = card.dataset.productId;
      const variantId = swatch.dataset.variantId;
      const variantPrice = parseInt(swatch.dataset.variantPrice, 10) || 0;

      // Update active swatch visual
      const container = swatch.closest('[data-insert-mini-swatches]');
      container?.querySelectorAll('[data-insert-mini-swatch]').forEach(s => s.classList.remove('is-active'));
      swatch.classList.add('is-active');

      // Update hidden form input
      const hiddenInput = this.querySelector(`[data-insert-variant-input][data-product-id="${productId}"]`);
      if (hiddenInput) {
        hiddenInput.value = variantId;
      }

      // Update price in product data
      const data = this.productData.get(productId);
      if (data) {
        data.price = variantPrice;
      }

      // Update card price display
      const priceEl = card.querySelector('.product-insert__card-price');
      if (priceEl) {
        priceEl.textContent = '+' + this.formatMoney(variantPrice);
      }

      this.updateState();
    }

    /**
     * Handle variant change within popover (non-color variants)
     */
    onVariantChange(event) {
      const input = event.target;
      const productId = input.closest('[data-insert-popover]')?.dataset.forProduct;
      if (!productId) return;

      const variantId = input.dataset.variantId;
      const variantPrice = parseInt(input.dataset.variantPrice, 10) || 0;
      const variantValue = input.value;

      // Update hidden form input
      const hiddenInput = this.querySelector(`[data-insert-variant-input][data-product-id="${productId}"]`);
      if (hiddenInput) {
        hiddenInput.value = variantId;
      }

      // Update price in product data
      const data = this.productData.get(productId);
      if (data) {
        data.price = variantPrice;
      }

      // Update card variant display
      const card = this.querySelector(`[data-insert-card][data-product-id="${productId}"]`);
      const variantValueEl = card?.querySelector('[data-insert-variant-value]');
      if (variantValueEl) {
        variantValueEl.textContent = variantValue;
      }

      // Update card price display
      const priceEl = card?.querySelector('.product-insert__card-price');
      if (priceEl) {
        priceEl.textContent = '+' + this.formatMoney(variantPrice);
      }

      // Update selected option label in popover
      const fieldset = input.closest('fieldset');
      const selectedLabel = fieldset?.querySelector('[data-insert-popover-selected]');
      if (selectedLabel) {
        selectedLabel.textContent = variantValue;
      }

      this.updateState();
    }

    /**
     * Open variant popover for a specific product
     */
    openVariantPopover(productId) {
      this.closeVariantPopover();

      const popover = this.querySelector(`[data-insert-popover][data-for-product="${productId}"]`);
      if (popover) {
        popover.removeAttribute('hidden');
      }
    }

    /**
     * Close all variant popovers
     */
    closeVariantPopover() {
      this.querySelectorAll('[data-insert-popover]').forEach(p => {
        p.setAttribute('hidden', '');
      });
    }

    /**
     * Update all derived state: summary, badge, main price, classes
     */
    updateState() {
      const selected = this.getSelectedInserts();
      const hasSelection = selected.length > 0;

      this.classList.toggle('has-selection', hasSelection);

      this.updateCollapsedSummary(selected);
      this.updatePriceBadge(selected);
      this.updateMainPriceDisplay(selected);

      // Update action text on the row
      if (this.customizeText) {
        this.customizeText.textContent = hasSelection ? 'Edit' : 'Add';
      }

      // Dispatch event for other components
      this.dispatchEvent(new CustomEvent('insert:changed', {
        bubbles: true,
        detail: { selected, totalPrice: this.getInsertTotal(selected) }
      }));
    }

    /**
     * Get array of selected insert info
     */
    getSelectedInserts() {
      const selected = [];
      this.hiddenInputs.forEach(input => {
        if (input.checked) {
          const productId = input.dataset.productId;
          const data = this.productData.get(productId);
          if (data) {
            selected.push({ productId, ...data, variantId: input.value });
          }
        }
      });
      return selected;
    }

    /**
     * Get total price of all selected inserts (in cents)
     */
    getInsertTotal(selected) {
      return selected.reduce((sum, item) => sum + item.price, 0);
    }

    /**
     * Update collapsed summary text
     */
    updateCollapsedSummary(selected) {
      if (!this.summaryEl) return;

      if (selected.length === 0) {
        this.summaryEl.textContent = this.dataset.noInsertsText || 'None';
        return;
      }

      if (selected.length === 1) {
        this.summaryEl.textContent = selected[0].title;
      } else if (selected.length === 2) {
        this.summaryEl.textContent = selected[0].title + ' + ' + selected[1].title;
      } else {
        this.summaryEl.textContent = selected[0].title + ' + ' + (selected.length - 1) + ' more';
      }
    }

    /**
     * Update price badge
     */
    updatePriceBadge(selected) {
      if (!this.priceBadge) return;

      const total = this.getInsertTotal(selected);
      this.priceBadge.textContent = total > 0 ? '+' + this.formatMoney(total) : '';
    }

    /**
     * Update main product price display.
     * If a product-addon element exists it handles the combined total via
     * the insert:changed event, so we skip here to avoid double-writes.
     */
    updateMainPriceDisplay(selected) {
      const addonEl = document.querySelector(`#ProductAddon-${this.sectionId}`);
      if (addonEl) return; // addon's syncTotalPrice handles the combined price

      const priceContainer = document.getElementById(`Price-${this.sectionId}-${this.dataset.productId || ''}`)
        || document.querySelector(`[id^="Price-${this.sectionId}"]`);
      if (!priceContainer) return;

      const priceElement = priceContainer.querySelector('.price__regular');
      if (!priceElement) return;

      const insertTotal = this.getInsertTotal(selected);
      const grandTotal = this.basePrice + insertTotal;

      if (insertTotal > 0) {
        priceElement.innerHTML = `<span class="product-addon__total-price">${this.formatMoney(grandTotal)}</span>`;
      } else {
        priceElement.textContent = this.formatMoney(this.basePrice);
      }
    }

    /**
     * Format price in store currency
     */
    formatMoney(cents) {
      if (typeof theme !== 'undefined' && theme.utils?.formatMoney) {
        return theme.utils.formatMoney(cents);
      }
      return '$' + (cents / 100).toFixed(2).replace(/\.00$/, '');
    }
  });
}
