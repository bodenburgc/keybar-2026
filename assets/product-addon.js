/**
 * Product Add-on Picker Web Component
 *
 * Handles add-on product selection with conditional variant swatches.
 * Integrates with main product form to add both products to cart.
 */

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

      // Main card elements (new checkbox card UI)
      this.mainCard = this.querySelector('[data-addon-main-card]');
      this.collapsedTitle = this.querySelector('[data-addon-collapsed-title]');
      this.collapsedValue = this.querySelector('[data-addon-collapsed-value]');
      this.priceBadge = this.querySelector('[data-addon-badge]');

      // Progressive disclosure elements
      this.detailsPanel = this.querySelector('[data-addon-details]');
      this.doneBtn = this.querySelector('[data-addon-done]');

      // Price elements
      this.basePrice = parseInt(this.dataset.basePrice, 10) || 0;
      this.currentAddonPrice = parseInt(this.dataset.defaultAddonPrice, 10) || 0;
      this.currencySymbol = this.dataset.currencySymbol || '$';
      this.sectionId = this.dataset.sectionId;

      // Find the main price display element
      this.mainPriceContainer = document.querySelector(`[id^="Price-${this.sectionId}"]`);
      this.originalPriceHTML = this.mainPriceContainer?.innerHTML;

      this.bindEvents();
      this.setupFormIntegration();
      this.updateMainPriceDisplay();
    }

    bindEvents() {
      // Product card selection
      this.productRadios.forEach(radio => {
        radio.addEventListener('change', this.onProductChange.bind(this));
      });

      // Variant swatch selection (for variant options, not product selection)
      this.querySelectorAll('[data-addon-variants] input[type="radio"]').forEach(input => {
        input.addEventListener('change', this.onVariantChange.bind(this));
      });

      // Make entire main card clickable to toggle details
      if (this.mainCard) {
        this.mainCard.addEventListener('click', this.toggleDetails.bind(this));
        // Handle keyboard activation (Enter/Space)
        this.mainCard.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleDetails();
          }
        });
      }
      if (this.doneBtn) {
        this.doneBtn.addEventListener('click', this.collapseDetails.bind(this));
      }
    }

    /**
     * Toggle the expanded/collapsed state
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
     * Expand the details panel
     */
    expandDetails() {
      this.classList.add('is-expanded');
      this.detailsPanel?.removeAttribute('hidden');
      this.mainCard?.setAttribute('aria-expanded', 'true');
    }

    /**
     * Collapse the details panel
     */
    collapseDetails() {
      this.classList.remove('is-expanded');
      this.detailsPanel?.setAttribute('hidden', '');
      this.mainCard?.setAttribute('aria-expanded', 'false');
      this.updateCollapsedDisplay();
    }

    /**
     * Update the main card to show current selection
     */
    updateCollapsedDisplay() {
      // Get selected product info
      const selectedProductRadio = this.querySelector('[data-addon-product-radio]:checked');
      if (!selectedProductRadio) return;

      const productTitle = selectedProductRadio.dataset.productTitle || '';

      // Get selected variant/color
      const selectedProductId = selectedProductRadio.value;
      const variantContainer = this.querySelector(`[data-addon-variants="${selectedProductId}"]`);
      const selectedVariantRadio = variantContainer?.querySelector('input[type="radio"]:checked');
      const variantValue = selectedVariantRadio?.value || '';

      // Update title
      if (this.collapsedTitle && productTitle) {
        this.collapsedTitle.textContent = productTitle;
      }

      // Update variant value display
      if (this.collapsedValue) {
        this.collapsedValue.textContent = variantValue || 'Plain';
      }
    }

    /**
     * Setup integration with the main product form
     * Patches the form's bundles property to work correctly with our addon input
     */
    setupFormIntegration() {
      const formId = this.dataset.formId;
      if (!formId) return;

      const form = document.getElementById(formId);
      if (!form) {
        // Form may not exist yet, wait for DOM
        requestAnimationFrame(() => this.setupFormIntegration());
        return;
      }

      // Store reference to form
      this.form = form;

      // Mark input as addon bundle for identification in prepareFormData
      // Keep name as "bundles" so the querySelectorAll in theme.js finds it
      // Also ensure the input is checked (default clip should always be included)
      if (this.variantInput) {
        this.variantInput.setAttribute('data-is-addon-bundle', 'true');
        this.variantInput.checked = true;
      }
    }

    /**
     * Handle product card selection change
     * Shows/hides appropriate variant swatches
     */
    onProductChange(event) {
      const selectedProductId = event.target.value;
      const selectedRadio = event.target;
      const firstVariantId = selectedRadio.dataset.firstVariantId;

      // Update card visual states
      this.productCards.forEach(card => {
        const radio = card.querySelector('[data-addon-product-radio]');
        card.classList.toggle('is-selected', radio?.value === selectedProductId);
      });

      // Hide all variant containers, show selected one
      this.variantContainers.forEach(container => {
        const isSelected = container.dataset.addonVariants === selectedProductId;
        container.classList.toggle('hidden', !isSelected);

        // If showing this container, select the first variant
        if (isSelected) {
          const firstRadio = container.querySelector('input[type="radio"]:not(:disabled)');
          if (firstRadio) {
            firstRadio.checked = true;
            this.updateSelectedVariant(firstRadio);
          }
        }
      });

      // Update hidden input with first variant of selected product
      if (this.variantInput) {
        this.variantInput.value = firstVariantId;
      }

      // Update price display
      this.updatePriceDisplay(selectedRadio.dataset.firstVariantPrice);

      // Update main card display
      this.updateCollapsedDisplay();

      // Dispatch event for other components
      this.dispatchEvent(new CustomEvent('addon:product-changed', {
        bubbles: true,
        detail: {
          productId: selectedProductId,
          variantId: firstVariantId
        }
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

      // Update hidden input
      if (this.variantInput) {
        this.variantInput.value = variantId;
      }

      // Update price display
      this.updatePriceDisplay(variantPrice);

      // Update selected option label
      const fieldset = input.closest('fieldset');
      const selectedLabel = fieldset?.querySelector('[data-selected-option]');
      if (selectedLabel) {
        selectedLabel.textContent = optionValue;
      }

      // Update main card display (thumbnail, title, variant)
      this.updateCollapsedDisplay();

      // Dispatch event
      this.dispatchEvent(new CustomEvent('addon:variant-changed', {
        bubbles: true,
        detail: {
          variantId: variantId,
          price: variantPrice
        }
      }));
    }

    /**
     * Update the add-on price display (in the add-on section)
     */
    updatePriceDisplay(price) {
      const priceNum = parseInt(price, 10);
      this.currentAddonPrice = priceNum;

      // Update hidden price summary
      if (this.priceDisplay) {
        if (priceNum === 0) {
          this.priceDisplay.textContent = theme?.strings?.addonIncluded || 'Included';
        } else {
          this.priceDisplay.textContent = '+' + this.formatMoney(priceNum);
        }
      }

      // Update the price badge in the header
      if (this.priceBadge) {
        if (priceNum === 0) {
          this.priceBadge.textContent = '$0';
        } else {
          this.priceBadge.textContent = '+' + this.formatMoney(priceNum);
        }
      }

      // Update the main product price display
      this.updateMainPriceDisplay();
    }

    /**
     * Update the main product price to show total with add-on
     */
    updateMainPriceDisplay() {
      if (!this.mainPriceContainer) return;

      const totalPrice = this.basePrice + this.currentAddonPrice;
      const priceElement = this.mainPriceContainer.querySelector('.price__regular');

      if (!priceElement) return;

      if (this.currentAddonPrice > 0) {
        // Show total with breakdown hint
        const baseFormatted = this.formatMoney(this.basePrice);
        const totalFormatted = this.formatMoney(totalPrice);
        const addonFormatted = this.formatMoney(this.currentAddonPrice);

        priceElement.innerHTML = `
          <span class="product-addon__total-price">${totalFormatted}</span>
          <span class="product-addon__price-breakdown">(${baseFormatted} + ${addonFormatted} clip)</span>
        `;
      } else {
        // Show just base price
        priceElement.innerHTML = this.formatMoney(this.basePrice);
      }
    }

    /**
     * Format price in store currency
     */
    formatMoney(cents) {
      if (typeof theme !== 'undefined' && theme.utils?.formatMoney) {
        return theme.utils.formatMoney(cents);
      }
      // Fallback formatting (USD)
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
