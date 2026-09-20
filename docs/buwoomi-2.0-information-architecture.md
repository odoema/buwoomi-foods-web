# BUWOOMI 2.0 — Information Architecture

Date: 2026-09-20
Status: Initial implementation IA

## Primary navigation

### Home
Intent, local-food discovery, recommendations, active plans and quick actions.

### Discover
Search and browse the food-commerce catalogue, with local Ugandan food as the initial anchor.

### Groups
Create and manage shared food commerce.

### Orders
Active, scheduled and past commerce.

### Account
Identity, saved commerce data and preferences.

## Contextual screens

- business detail
- menu
- food detail
- cart
- checkout
- payment
- order tracking
- address editor
- notification detail
- group detail
- scheduled-order editor
- reorder confirmation

## Business workspace

The business experience should be a separate authenticated workspace rather than being mixed into customer navigation.

Initial:
- Overview
- Orders
- Menu
- Sales

Later:
- Customers
- Promotions
- Insights
- Inventory

## Navigation rules

1. Primary tabs persist on top-level customer screens.
2. Contextual screens use one predictable back affordance.
3. Checkout and payment have explicit progress and safe back behaviour.
4. Active orders remain reachable without losing current context.
5. Group and scheduled-order flows preserve their parent context.
6. URLs/deep-link state should eventually map to domains rather than opaque screen names.
7. No feature should introduce a competing navigation system or hidden global click interception.

## Transition

Current:
Home / Menu / Orders / Cart / Profile

Target:
Home / Discover / Groups / Orders / Account

Cart becomes a contextual commerce surface with a persistent entry point/badge rather than a primary domain tab.

This is a UX architecture change and should be implemented only after the screen contracts are agreed in code.
