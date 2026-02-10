/**
 * Product Add-on Picker Web Component
 *
 * Compact row-based clip picker with progressive disclosure.
 * Coordinates with product-insert-picker via accordion behavior.
 * Dispatches addon:price-changed for cross-component price sync.
 */

// TODO(BODE): backport to BODE-shopify

if (!customElements.get('product-addon')) {
  customElements.define('product-addon', class ProductAddon extends HTMLElement {
    constructor() {
      super();

      this.productRadios = this.querySelectorAll('[data-addon-product-radio]');
      this.productCards = this.querySelectorAll('.product-addon__card');
      this.variantInput = this.querySelector('[data-addon-variant-input]');
      this.priceDisplay = this.querySelector('[data-addon-price]');
      this.variantContainers = this.querySelectorAll('[data-addon-variants]');
      this.formId = this.dataset.formId;

      // Compact row elements
      this.mainCard = this.querySelector('[data-addon-main-card]');
      this.collapsedTitle = this.querySelector('[data-addon-collapsed-title]');
      this.priceBadge = this.querySelector('[data-addon-badge]');
      this.customizeText = this.querySelector('[data-addon-customize-text]');

      // Progressive disclosure elements
      this.detailsPanel = this.querySelector('[data-addon-details]');

      // Price elements
      this.basePrice = parseInt(this.dataset.basePrice, 10) || 0;
      this.currentAddonPrice = parseInt(this.dataset.defaultAddonPrice, 10) || 0;
      this.currencySymbol = this.dataset.currencySymbol || '$';
      this.sectionId = this.dataset.sectionId;

      // Optional addon state
      this.isOptional = this.dataset.addonOptional === 'true';
      this.isActive = !this.isOptional;

      this.abortController = new AbortController();
      this.bindEvents();
      this.setupFormIntegration();

      if (this.isActive) {
        this.syncTotalPrice();
      }
    }

    bindEvents() {
      const signal = this.abortController.signal;

      // Product card selection
      this.productRadios.forEach(radio => {
        radio.addEventListener('change', this.onProductChange.bind(this), { signal });
      });

      // Variant swatch selection
      this.querySelectorAll('[data-addon-variants] input[type="radio"]').forEach(input => {
        input.addEventListener('change', this.onVariantChange.bind(this), { signal });
      });

      // Main row toggle
      if (this.mainCard) {
        this.mainCard.addEventListener('click', () => this.toggleDetails(), { signal });
        this.mainCard.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleDetails();
          }
        }, { signal });
      }

      // Accordion: collapse when a sibling picker expands
      document.addEventListener('picker:expand', (e) => {
        if (e.detail.id !== this.id) {
          this.collapseDetails();
        }
      }, { signal });

      // Re-apply total price after Shopify replaces price HTML on variant change
      document.addEventListener('variant:change', () => {
        requestAnimationFrame(() => this.syncTotalPrice());
      }, { signal });

      // Re-apply when insert selection changes
      document.addEventListener('insert:changed', () => {
        this.syncTotalPrice();
      }, { signal });
    }

    disconnectedCallback() {
      this.abortController.abort();
    }

    /**
     * Toggle the expanded/collapsed state
     */
    toggleDetails() {
      const isExpanded = this.mainCard?.getAttribute('aria-expanded') === 'true';

      if (this.isOptional && !this.isActive) {
        this.activateAddon();
        this.expandDetails();
        return;
      }

      if (isExpanded) {
        this.collapseDetails();
      } else {
        this.expandDetails();
      }
    }

    /**
     * Expand the details panel — dispatches accordion event
     */
    expandDetails() {
      this.classList.add('is-expanded');
      this.detailsPanel?.removeAttribute('hidden');
      this.mainCard?.setAttribute('aria-expanded', 'true');

      this.dispatchEvent(new CustomEvent('picker:expand', { bubbles: true, detail: { id: this.id } }));
    }

    /**
     * Collapse the details panel
     */
    collapseDetails() {
      this.classList.remove('is-expanded');
      this.detailsPanel?.setAttribute('hidden', '');
      this.mainCard?.setAttribute('aria-expanded', 'false');
      this.updateCollapsedDisplay();

      if (this.isOptional && this.isActive && this.customizeText) {
        this.customizeText.textContent = 'Change';
      }
    }

    /**
     * Update the compact row to show current selection
     */
    updateCollapsedDisplay() {
      if (this.isOptional && !this.isActive) {
        if (this.collapsedTitle) this.collapsedTitle.textContent = 'No Clip';
        if (this.priceBadge) this.priceBadge.textContent = '';
        return;
      }

      const selectedProductRadio = this.querySelector('[data-addon-product-radio]:checked');
      if (!selectedProductRadio) return;

      const productTitle = selectedProductRadio.dataset.productTitle || '';
      const selectedProductId = selectedProductRadio.value;
      const variantContainer = this.querySelector(`[data-addon-variants="${selectedProductId}"]`);
      const selectedVariantRadio = variantContainer?.querySelector('input[type="radio"]:checked');
      const variantValue = selectedVariantRadio?.value || '';

      let rowValue = productTitle;
      if (variantValue && variantValue !== 'Default Title') {
        rowValue += ' \u00B7 ' + variantValue;
      }
      if (this.collapsedTitle) this.collapsedTitle.textContent = rowValue;
    }

    /**
     * Activate the optional addon (user opts in)
     */
    activateAddon() {
      this.isActive = true;
      this.classList.remove('product-addon--inactive');
      this.classList.add('is-active');

      if (this.variantInput) this.variantInput.checked = true;
      if (this.customizeText) this.customizeText.textContent = 'Change';

      this.updateCollapsedDisplay();

      const selectedProductRadio = this.querySelector('[data-addon-product-radio]:checked');
      const selectedProductId = selectedProductRadio?.value;
      const variantContainer = selectedProductId ? this.querySelector(`[data-addon-variants="${selectedProductId}"]`) : null;
      const selectedVariantRadio = variantContainer?.querySelector('input[type="radio"]:checked');
      const price = selectedVariantRadio?.dataset?.variantPrice || selectedProductRadio?.dataset?.firstVariantPrice || this.dataset.defaultAddonPrice;
      this.updatePriceDisplay(price);
    }

    /**
     * Deactivate the optional addon (user opts out)
     */
    deactivateAddon() {
      this.isActive = false;
      this.classList.add('product-addon--inactive');
      this.classList.remove('is-active');
      this.classList.remove('is-expanded');

      if (this.variantInput) this.variantInput.checked = false;
      if (this.customizeText) this.customizeText.textContent = 'Add';

      this.detailsPanel?.setAttribute('hidden', '');
      this.mainCard?.setAttribute('aria-expanded', 'false');

      this.currentAddonPrice = 0;
      this.updateCollapsedDisplay();
      this.syncTotalPrice();
    }

    /**
     * Setup integration with the main product form
     */
    setupFormIntegration() {
      const formId = this.dataset.formId;
      if (!formId) return;

      const form = document.getElementById(formId);
      if (!form) {
        requestAnimationFrame(() => this.setupFormIntegration());
        return;
      }

      this.form = form;

      if (this.variantInput) {
        this.variantInput.setAttribute('data-is-addon-bundle', 'true');
        if (!this.isOptional) this.variantInput.checked = true;
      }
    }

    /**
     * Handle product card selection change
     */
    onProductChange(event) {
      const selectedProductId = event.target.value;
      const selectedRadio = event.target;
      const firstVariantId = selectedRadio.dataset.firstVariantId;

      this.productCards.forEach(card => {
        const radio = card.querySelector('[data-addon-product-radio]');
        card.classList.toggle('is-selected', radio?.value === selectedProductId);
      });

      this.variantContainers.forEach(container => {
        const isSelected = container.dataset.addonVariants === selectedProductId;
        container.classList.toggle('hidden', !isSelected);

        if (isSelected) {
          const firstRadio = container.querySelector('input[type="radio"]:not(:disabled)');
          if (firstRadio) {
            firstRadio.checked = true;
            this.updateSelectedVariant(firstRadio);
          }
        }
      });

      if (this.variantInput) {
        this.variantInput.value = firstVariantId;
      }

      this.updatePriceDisplay(selectedRadio.dataset.firstVariantPrice);
      this.updateCollapsedDisplay();

      this.dispatchEvent(new CustomEvent('addon:product-changed', {
        bubbles: true,
        detail: { productId: selectedProductId, variantId: firstVariantId }
      }));
    }

    /**
     * Handle variant swatch selection
     */
    onVariantChange(event) {
      this.updateSelectedVariant(event.target);
    }

    /**
     * Update the selected variant and related UI
     */
    updateSelectedVariant(input) {
      const variantId = input.dataset.variantId;
      const variantPrice = input.dataset.variantPrice;
      const optionValue = input.value;

      if (this.variantInput) {
        this.variantInput.value = variantId;
      }

      this.updatePriceDisplay(variantPrice);

      const fieldset = input.closest('fieldset');
      const selectedLabel = fieldset?.querySelector('[data-selected-option]');
      if (selectedLabel) {
        selectedLabel.textContent = optionValue;
      }

      // Update the selected clip type card image to reflect the chosen color
      const variantImageUrl = input.dataset.variantImage;
      if (variantImageUrl) {
        const selectedProductRadio = this.querySelector('[data-addon-product-radio]:checked');
        const cardImg = selectedProductRadio?.closest('.product-addon__card')?.querySelector('.product-addon__card-img');
        if (cardImg) {
          cardImg.srcset = '';
          cardImg.src = variantImageUrl;
          cardImg.alt = `${selectedProductRadio.dataset.productTitle || ''} - ${optionValue}`;
        }
      }

      this.updateCollapsedDisplay();

      this.dispatchEvent(new CustomEvent('addon:variant-changed', {
        bubbles: true,
        detail: { variantId, price: variantPrice }
      }));
    }

    /**
     * Update the add-on price display (badge in the row)
     */
    updatePriceDisplay(price) {
      const priceNum = parseInt(price, 10);
      this.currentAddonPrice = priceNum;

      if (this.priceDisplay) {
        if (priceNum === 0) {
          this.priceDisplay.textContent = theme?.strings?.addonIncluded || 'Included';
        } else {
          this.priceDisplay.textContent = '+' + this.formatMoney(priceNum);
        }
      }

      if (this.priceBadge) {
        if (priceNum === 0) {
          this.priceBadge.textContent = 'Incl.';
        } else {
          this.priceBadge.textContent = '+' + this.formatMoney(priceNum);
        }
      }

      this.syncTotalPrice();
    }

    /**
     * Sync the combined total (base + addon + inserts) to the main price display.
     * Reads insert total from the insert picker element if present.
     */
    syncTotalPrice() {
      const priceContainer = document.getElementById(`Price-${this.sectionId}-${this.dataset.productId || ''}`);
      // Fallback: try prefix match if exact ID doesn't work
      const container = priceContainer || document.querySelector(`[id^="Price-${this.sectionId}"]`);
      if (!container) return;

      const priceElement = container.querySelector('.price__regular');
      if (!priceElement) return;

      const addonPrice = this.isActive ? this.currentAddonPrice : 0;

      // Read insert total from the insert picker element
      let insertTotal = 0;
      const insertEl = document.querySelector(`#ProductInsert-${this.sectionId}`);
      if (insertEl) {
        insertEl.querySelectorAll('[data-insert-variant-input]').forEach(input => {
          if (input.checked) {
            const card = insertEl.querySelector(`[data-insert-card][data-product-id="${input.dataset.productId}"]`);
            if (card) {
              insertTotal += parseInt(card.dataset.defaultPrice, 10) || 0;
            }
          }
        });
        // Use live product data from the component if available
        if (insertEl.productData) {
          insertTotal = 0;
          insertEl.querySelectorAll('[data-insert-variant-input]').forEach(input => {
            if (input.checked) {
              const data = insertEl.productData.get(input.dataset.productId);
              if (data) insertTotal += data.price;
            }
          });
        }
      }

      const grandTotal = this.basePrice + addonPrice + insertTotal;

      if (addonPrice > 0 || insertTotal > 0) {
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

    /**
     * Get the currently selected addon variant ID
     */
    get selectedVariantId() {
      return this.variantInput?.value;
    }
  });
}
