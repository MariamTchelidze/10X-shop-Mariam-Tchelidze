# GitHub Issue Backlog

These are proposed, distinct maintenance issues for the Treasures of Middle-earth shop. They are recorded locally for review; **they have not been filed on GitHub yet** because GitHub CLI (`gh`) is not installed in this environment.

## Draft issues

1. **[Catalog] Preserve search and filter state when returning from a product**  
   Description: Keep the catalog query, category, sort order, and page when a shopper returns from a product detail page.  
   Labels: `enhancement`, `catalog`

2. **[Catalog] Guard against stale search responses**  
   Description: Ensure a slower response for an older query cannot replace results for the latest query; add a focused regression test for rapid typing.  
   Labels: `bug`, `catalog`, `testing`

3. **[Catalog] Add clear empty and retry states for category loading**  
   Description: Give shoppers an actionable recovery path if category options fail to load, including an accessible retry control.  
   Labels: `enhancement`, `catalog`, `accessibility`

4. **[Catalog] Announce result-count changes to assistive technology**  
   Description: Expose catalog result-count updates as a polite live announcement without moving keyboard focus.  
   Labels: `accessibility`, `catalog`

5. **[Product] Add a resilient image fallback for unavailable product images**  
   Description: Show a themed fallback image and preserve the image frame when a remote product image fails.  
   Labels: `enhancement`, `product-page`

6. **[Product] Verify product detail content against malformed API payloads**  
   Description: Add focused tests for missing optional fields and invalid required fields so malformed API data produces a useful error state.  
   Labels: `testing`, `product-page`, `api`

7. **[Cart] Add unit coverage for variant-aware stock limits**  
   Description: Cover add, update, and remove operations for products with multiple size or color variants sharing one stock count.  
   Labels: `testing`, `cart`

8. **[Cart] Reconcile saved cart items when inventory changes between sessions**  
   Description: Keep persisted quantities within current inventory and provide clear feedback when saved quantities are reduced.  
   Labels: `enhancement`, `cart`, `inventory`

9. **[Cart] Add a remove-promo action to the order summary**  
   Description: Let shoppers remove an applied promotion and immediately see the recalculated total.  
   Labels: `enhancement`, `cart`

10. **[Checkout] Validate address fields with field-specific guidance**  
    Description: Provide clear inline validation for required checkout fields and associate each message with its input for assistive technology.  
    Labels: `enhancement`, `checkout`, `accessibility`

11. **[Checkout] Prevent duplicate order submission**  
    Description: Ensure repeated clicks or Enter presses while checkout is processing create only one local order.  
    Labels: `bug`, `checkout`

12. **[Orders] Persist and display order history across browser sessions**  
    Description: Verify order serialization, recovery from invalid stored data, and order detail rendering after refresh.  
    Labels: `enhancement`, `orders`, `testing`

13. **[Profile] Add validation and duplicate checks for saved addresses**  
    Description: Validate address fields and prevent accidental duplicate entries in the user's saved address list.  
    Labels: `enhancement`, `profile`

14. **[Profile] Mask saved card details in every profile view**  
    Description: Ensure saved payment-card displays reveal only the permitted final digits and never persist or display a full card number.  
    Labels: `security`, `profile`

15. **[Theme] Check contrast and native select menus in both themes**  
    Description: Audit form controls, dropdown options, focus indicators, and muted text in Shire and Mordor themes.  
    Labels: `accessibility`, `theme`

16. **[Responsive] Add automated viewport checks at 375px**  
    Description: Add browser coverage for horizontal overflow and clipping on catalog, product, cart, checkout, and profile views.  
    Labels: `testing`, `responsive`

17. **[Navigation] Test keyboard operation of the mobile account drawer**  
    Description: Verify focus entry, focus containment, Escape closing, and focus restoration for the account/settings drawer.  
    Labels: `accessibility`, `navigation`, `testing`

18. **[Performance] Lazy-load below-the-fold product imagery**  
    Description: Confirm non-visible catalog images are deferred and retain explicit dimensions to limit layout shift.  
    Labels: `performance`, `catalog`

19. **[Performance] Establish a repeatable Lighthouse baseline**  
    Description: Record current mobile Lighthouse settings and metrics, then compare future changes using the same production target and conditions.  
    Labels: `performance`, `documentation`

20. **[Quality] Add CI checks for typecheck, lint, and production build**  
    Description: Run the existing quality scripts on pull requests so type and build regressions are caught before merging.  
    Labels: `ci`, `quality`
