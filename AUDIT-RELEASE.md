# BUWOOMI Foods — Production Audit Release

This release consolidates the main customer and Super Admin functionality so the frontend does not need repeated deployments for routine restaurant operations.

## Activated
- Super Admin menu item add/edit/delete and availability/popular controls
- Menu image uploads through Supabase Storage (`menu-images`)
- Extras add/edit/delete
- Category add/edit/delete/reordering by sort order
- Super Admin order management with Active/Past tabs and status updates
- Automatic customer notifications when an admin changes order status
- Restaurant settings: delivery fee, minimum order, delivery ETA, service area and support email
- Customer profile editing (name/phone)
- Password reset email flow
- Google/Apple OAuth hooks (providers must be enabled in Supabase Auth before use)
- Menu search
- Customer active/past order filtering
- Reorder from order history
- Order rating/comment persistence
- Server-side atomic order placement with server-calculated prices, extras and delivery fee
- RLS/admin policies for catalog, orders, profiles, notifications and settings
- Default-address/default-payment uniqueness constraints
- Delivered timestamp synchronization

## Intentionally not activated without provider credentials
- Live MTN/Airtel/card payment charging: the UI can record a selected payment method, but actual money movement requires the chosen payment provider's merchant credentials and callback/webhook configuration.
- Live map/rider GPS tracking: requires a maps/rider backend and location source.
- Push notifications: database notifications are active; browser/mobile push requires a push provider and permission flow.

## Deployment strategy
The application is currently manually deployed to Netlify. Netlify documents Git continuous deployment as the repeatable workflow for projects that will be updated repeatedly. Once the project is connected to Git, future releases can be pushed without repeatedly uploading ZIP files.
