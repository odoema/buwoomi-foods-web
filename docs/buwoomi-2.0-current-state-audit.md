# BUWOOMI 2.0 — Current-State Audit

Date: 2026-09-20
Repository: odoema/buwoomi-foods-web
Baseline: main

## Executive finding

Buwoomi already has a functioning customer-ordering foundation, Supabase integration, authentication, address handling, checkout, order history, favourites, notifications and an admin surface. The strategic redesign should therefore be evolutionary: preserve the working transaction foundation while changing the product model from a single food-ordering experience into a multi-domain food-commerce platform.

The largest structural gap is not visual. The current application is still fundamentally organised around a single catalogue and restaurant-style ordering flow. The immediate catalogue direction is deliberately local-first: matooke, posho, cassava, groundnuts, beans, nakati, dodo, cabbage, entula and other familiar Ugandan foods should define the early customer experience, with fast-food/international items remaining secondary. The live catalogue now contains a local-first set of food items and categories, but the database still has no first-class business/merchant entity, fulfilment abstraction, payment transaction model, group-order model, scheduled-order model, or meal-plan model.

## Current state vs Buwoomi 2.0

| Current Buwoomi | Buwoomi 2.0 direction |
|---|---|
| Single catalogue / menu | Multi-business food commerce |
| Restaurant/menu browsing | Intent-first food discovery |
| Menu categories | Food, cuisine, occasion, budget and intent |
| Individual cart | Individual + group commerce |
| Immediate ordering | Immediate + scheduled + repeat |
| Delivery-oriented checkout | Flexible fulfilment |
| Payment method on order | Payment lifecycle + reconciliation |
| Basic order lifecycle | Explicit order + fulfilment lifecycle |
| Menu item favourites | Food/business discovery and preference signals |
| Basic notifications | Transactional + planning + group notifications |
| Basic vendor/admin tools | Business operating platform |
| Transaction records | Behavioural event + commerce intelligence |
| Direct frontend Supabase access | API boundary introduced incrementally |
| Vanilla SPA | Existing web retained during transition + future Flutter client |

## What already exists

Customer:
- SPA navigation and transitions
- Home, menu, product details, cart, checkout, orders, profile and authentication
- Search and categories
- Cart persistence
- Address management
- Favourites
- Notifications
- Order confirmation/tracking
- Rating flow
- Google OAuth and email/password authentication
- Payment-method selection UI
- Delivery-time selection UI

Backend:
- profiles
- addresses
- categories
- menu_items
- extras
- orders
- order_items
- favourites
- saved_payment_methods
- notifications
- app_settings

RLS is enabled on these public tables.

## Current backend limitation

The schema is still single-catalogue oriented:
- menu_items has no business_id
- there is no businesses table
- orders have no explicit fulfilment type
- there is no payment transaction table
- there are no group-order tables
- there are no scheduled/recurring-order tables
- there is no event/analytics model
- there is no merchant operating model

These are architectural gaps to address incrementally, not reasons to discard the existing database.

## Current implementation risks

1. app.js is a large application module containing data, state, rendering, navigation and interaction logic.
2. CSS has accumulated separate fix stylesheets, increasing regression risk.
3. Checkout behaviour is split across the main application and additional fix scripts; this should eventually become one explicit checkout module.
4. The frontend contains a mock catalogue fallback alongside live Supabase data.
5. Payment selection exists, but payment processing is not yet a production payment architecture.
6. Scheduling is partly UI/local-storage driven and is not yet a robust backend order concept.
7. The existing order model mixes order state, delivery data, payment method and rating data.
8. Deep-linkable route/state architecture is weak for a multi-domain product.
9. No service worker was found, so the manifest alone is not a complete PWA strategy.
10. Automated regression coverage is not yet sufficient for a broad redesign.

## Strategic consequence

The redesign should not begin by rewriting the visual shell.

The first structural change is to introduce:
Business -> Catalogue -> Discovery -> Cart -> Order -> Payment -> Fulfilment

Then add:
Group -> Scheduled/Repeat -> Intelligence

## Evidence note

Current competitive evidence reinforces this direction. Glovo's current Uganda partner offering already includes marketplace discovery, order management, pickup, merchant/self-delivery options, sales data, promotions and menu optimisation. citeturn0search0turn0search2 FoodBoda currently advertises scheduling, group/cart sharing, real-time updates and an AI assistant. citeturn0search7 These should therefore be treated as baseline or hypotheses, not assumed differentiators.

The 2026 Uganda internet shutdown demonstrated operational dependence on connectivity for online food-delivery businesses, reinforcing the value of resilient, flexible commerce and fulfilment design. citeturn0search1turn0search12

## Audit decision

Preserve: authentication, profiles, addresses, catalogue primitives, cart, order placement, order history, notifications, RLS and existing Supabase data.

Refactor: navigation, application state, checkout, payment architecture, CSS organisation, order lifecycle and API boundaries.

Add: businesses, fulfilment abstraction, payment transactions, groups, scheduling/repeat orders, analytics events, merchant capabilities and intent-first discovery.

Do not add yet: microservices, full rider fleet, advanced AI, loyalty economy, complex inventory forecasting or a large multi-country launch.
