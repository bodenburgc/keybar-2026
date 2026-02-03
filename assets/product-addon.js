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

      // Progressive disclosure elements
      this.collapsedHeader = this.querySelector('[data-addon-collapsed]');
      this.detailsPanel = this.querySelector('[data-addon-details]');
      this.toggleBtn = this.querySelector('[data-addon-toggle]');
      this.doneBtn = this.querySelector('[data-addon-done]');
      this.collapsedValue = this.querySelector('[data-addon-collapsed-value]');

      this.bindEvents();
      this.setupFormIntegration();
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

      // Progressive disclosure toggle
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', this.toggleDetails.bind(this));
      }
      if (this.doneBtn) {
        this.doneBtn.addEventListener('click', this.collapseDetails.bind(this));
      }
    }

    /**
     * Toggle the expanded/collapsed state
     */
    toggleDetails() {
      const isExpanded = this.toggleBtn.getAttribute('aria-expanded') === 'true';
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
      this.toggleBtn?.setAttribute('aria-expanded', 'true');
    }

    /**
     * Collapse the details panel
     */
    collapseDetails() {
      this.classList.remove('is-expanded');
      this.detailsPanel?.setAttribute('hidden', '');
      this.toggleBtn?.setAttribute('aria-expanded', 'false');
      this.updateCollapsedDisplay();
    }

    /**
     * Update the collapsed header to show current selection
     */
    updateCollapsedDisplay() {
      if (!this.collapsedValue) return;

      // Get selected product name
      const selectedProductRadio = this.querySelector('[data-addon-product-radio]:checked');
      const selectedCard = selectedProductRadio?.closest('.product-addon__card');
      const productTitle = selectedCard?.querySelector('.product-addon__card-title')?.textContent?.trim() || '';

      // Get selected variant/color
      const selectedProductId = selectedProductRadio?.value;
      const variantContainer = this.querySelector(`[data-addon-variants="${selectedProductId}"]`);
      const selectedVariantRadio = variantContainer?.querySelector('input[type="radio"]:checked');
      const variantValue = selectedVariantRadio?.value || '';

      // Update display
      if (productTitle && variantValue) {
        this.collapsedValue.textContent = `${productTitle} — ${variantValue}`;
      } else if (productTitle) {
        this.collapsedValue.textContent = productTitle;
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

      // Rename our input to avoid the native form property shadowing issue
      // The form auto-creates form.bundles when there's an input named "bundles"
      if (this.variantInput) {
        this.variantInput.setAttribute('name', 'addon_bundle');
        this.variantInput.setAttribute('data-is-addon-bundle', 'true');
      }

      // Override the form's bundles getter to include our addon input
      this.patchFormBundles(form);
    }

    /**
     * Patch the form's bundles property to return an array including our addon
     */
    patchFormBundles(form) {
      const self = this;
      const originalDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(form), 'bundles');

      // Define a new bundles property on this specific form instance
      Object.defineProperty(form, 'bundles', {
        get: function() {
          // Get the original bundles from the prototype getter if it exists
          let bundles = [];
          if (originalDescriptor && originalDescriptor.get) {
            try {
              const original = originalDescriptor.get.call(this);
              if (Array.isArray(original)) {
                bundles = [...original];
              }
            } catch (e) {
              // Ignore errors from original getter
            }
          }

          // Add our addon input if it's checked and has a value
          if (self.variantInput && self.variantInput.checked && self.variantInput.value) {
            // Create a proxy object that looks like the input for the bundles mechanism
            bundles.push({
              value: self.variantInput.value,
              checked: true,
              disabled: false
            });
          }

          return bundles;
        },
        configurable: true
      });
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
     * Update the price display
     */
    updatePriceDisplay(price) {
      if (!this.priceDisplay) return;

      const priceNum = parseInt(price, 10);
      if (priceNum === 0) {
        this.priceDisplay.textContent = theme?.strings?.addonIncluded || 'Included';
      } else {
        this.priceDisplay.textContent = '+' + this.formatMoney(priceNum);
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
