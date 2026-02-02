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

      this.productSelect = this.querySelector('[data-addon-product-select]');
      this.variantInput = this.querySelector('[data-addon-variant-input]');
      this.priceDisplay = this.querySelector('[data-addon-price]');
      this.variantContainers = this.querySelectorAll('[data-addon-variants]');
      this.formId = this.dataset.formId;

      this.bindEvents();
      this.setupFormIntegration();
    }

    bindEvents() {
      // Product dropdown change
      this.productSelect?.addEventListener('change', this.onProductChange.bind(this));

      // Variant swatch selection
      this.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', this.onVariantChange.bind(this));
      });
    }

    /**
     * Setup integration with the main product form
     */
    setupFormIntegration() {
      // Find the product form
      const productInfo = this.closest('product-info');
      const form = productInfo?.querySelector(`form[action*="/cart/add"]`) ||
                   document.getElementById(this.formId)?.closest('form');

      if (form && !form.hasAttribute('data-addon-integrated')) {
        form.setAttribute('data-addon-integrated', 'true');
        form.addEventListener('submit', this.handleFormSubmit.bind(this));
      }
    }

    /**
     * Handle product dropdown change
     * Shows/hides appropriate variant swatches
     */
    onProductChange(event) {
      const selectedProductId = event.target.value;
      const selectedOption = event.target.selectedOptions[0];
      const firstVariantId = selectedOption.dataset.firstVariantId;

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
      this.variantInput.value = firstVariantId;

      // Update price display
      this.updatePriceDisplay(selectedOption.dataset.firstVariantPrice);

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
      this.variantInput.value = variantId;

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

    /**
     * Get addon data for cart submission
     */
    getCartData() {
      const variantId = this.selectedVariantId;
      if (!variantId) return null;

      return {
        id: parseInt(variantId, 10),
        quantity: 1
      };
    }

    /**
     * Intercept form submission to add addon product
     */
    async handleFormSubmit(event) {
      const form = event.target;
      const addonData = this.getCartData();

      // If no addon selected, let form submit normally
      if (!addonData) return;

      // Prevent default form submission
      event.preventDefault();
      event.stopPropagation();

      // Get main product variant ID
      const mainVariantInput = form.querySelector('input[name="id"], select[name="id"]');
      const mainVariantId = mainVariantInput?.value;

      if (!mainVariantId) {
        console.error('Product Addon: No main variant ID found');
        return;
      }

      // Build items array for cart
      const quantity = parseInt(form.querySelector('input[name="quantity"]')?.value || 1, 10);
      const items = [
        {
          id: parseInt(mainVariantId, 10),
          quantity: quantity
        },
        addonData
      ];

      // Get submit button for loading state
      const submitButton = form.querySelector('[type="submit"], button[name="add"]');
      submitButton?.setAttribute('aria-busy', 'true');
      submitButton?.setAttribute('aria-disabled', 'true');

      // Clear any previous errors
      const errorEl = form.querySelector('.product-form__error-message');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }

      try {
        // Collect sections to update
        let sectionsToBundle = [];
        document.documentElement.dispatchEvent(
          new CustomEvent('cart:bundled-sections', {
            bubbles: true,
            detail: { sections: sectionsToBundle }
          })
        );

        // Add to cart via AJAX
        const response = await fetch(theme.routes.cart_add_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: items,
            sections: sectionsToBundle,
            sections_url: window.location.pathname
          })
        });

        const result = await response.json();

        if (result.status) {
          // Error occurred
          console.error('Product Addon: Cart error:', result.description);
          if (errorEl) {
            errorEl.textContent = result.description;
            errorEl.hidden = false;
          }

          document.dispatchEvent(new CustomEvent('ajaxProduct:error', {
            detail: { errorMessage: result.description }
          }));
          return;
        }

        // Success - update cart state
        const cartResponse = await fetch(theme.routes.cart_url, {
          headers: { 'Accept': 'application/json' }
        });
        const cartJson = await cartResponse.json();
        cartJson.sections = result.sections;

        // Publish cart update event
        if (theme.pubsub) {
          theme.pubsub.publish(theme.pubsub.PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-addon',
            cart: cartJson
          });
        }

        // Dispatch added event
        document.dispatchEvent(new CustomEvent('ajaxProduct:added', {
          detail: { product: result }
        }));

        // Open cart drawer or redirect based on settings
        if (document.body.classList.contains('template-cart') || theme.settings?.cartType === 'page') {
          window.location.href = theme.routes.cart_url;
        } else {
          const cartDrawer = document.querySelector('cart-drawer');
          cartDrawer?.show(submitButton);
        }

      } catch (error) {
        console.error('Product Addon: Failed to add to cart:', error);
        if (errorEl) {
          errorEl.textContent = 'Failed to add to cart. Please try again.';
          errorEl.hidden = false;
        }
      } finally {
        submitButton?.removeAttribute('aria-busy');
        submitButton?.removeAttribute('aria-disabled');
      }
    }
  });
}
