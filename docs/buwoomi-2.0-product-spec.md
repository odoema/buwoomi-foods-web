# BUWOOMI 2.0 — Product Specification

Date: 2026-09-20
Status: Working product specification

## Product definition

Buwoomi is a Uganda-focused digital food-commerce platform for discovering, planning, ordering and receiving food, while giving food businesses the tools and intelligence to sell and grow.

Delivery is a fulfilment mechanism, not the definition of the product.

## Product principles

1. Intent before catalogue.
2. Commerce before logistics.
3. Flexible fulfilment.
4. Trust before cleverness.
5. Real usage before feature expansion.
6. Modular monolith before microservices.
7. Server-side authority for money and order state.
8. Instrument important user behaviour.
9. Distinguish facts, hypotheses and vision.
10. Build the smallest useful version of each capability.

## Customer domains

Discover:
- food type
- category
- local food/cuisine
- price/budget
- occasion
- business
- previous orders
- availability
- fulfilment option

Plan:
- order later
- repeat an order
- scheduled meals
- recurring meals
- future group orders

Order:
- cart
- checkout
- address
- fulfilment
- payment
- confirmation
- tracking
- reorder

Groups:
- create group
- invite members
- shared cart/order
- deadline
- member contribution
- consolidation
- payment
- fulfilment

Account:
- profile
- addresses
- payment methods
- favourites
- notifications
- order history
- preferences

## Business domains

Businesses should eventually manage:
- business profile
- operating hours
- service area
- menu
- availability
- incoming orders
- preparation status
- fulfilment method
- sales
- promotions
- repeat-customer signals
- insights

## Fulfilment

Every order should support an explicit fulfilment choice:
- pickup
- merchant delivery
- partner courier
- Buwoomi delivery

The order model must not assume that Buwoomi owns the last mile.

## Payments

Payment must become a separate domain.

Lifecycle:
initiated -> processing -> confirmed / failed -> refunded where applicable

An order should not become paid merely because the browser says payment succeeded.

Payment records should include provider, method, amount, currency, provider reference, status, timestamps and reconciliation metadata.

## Order lifecycle

Order state and payment state are separate.

Example:
draft -> placed -> accepted -> preparing -> ready -> fulfilled -> completed

Cancellation and refund transitions must be explicit.

## Discovery

The first home-screen question should be:
What are you looking for?

Examples:
- Local food
- Chicken
- Beef
- Fish
- Rolex
- Family meals
- Office lunch
- Under UGX 15,000
- Order again

The discovery engine can initially use deterministic filters and ranking. AI/NLP is introduced only where it improves successful discovery.

## MVP

Customer:
- authentication
- profile
- address/location
- intent-first discovery
- search
- categories
- business profiles
- menus
- product details
- cart
- checkout
- payment
- order history
- reorder
- pickup
- delivery

Differentiating experiments:
- group ordering
- scheduled ordering
- local-food discovery

Business:
- business profile
- menu management
- incoming orders
- order status
- basic sales view

## Deferred

- microservices
- proprietary rider fleet as the first growth strategy
- advanced AI assistant
- loyalty points economy
- full inventory management
- sophisticated demand forecasting
- multi-country expansion
- complex subscriptions
- large-scale marketplace advertising

## Success metrics

Primary:
- completed orders
- repeat order rate
- successful checkout rate

Secondary:
- search-to-menu rate
- menu-to-cart rate
- cart-to-checkout rate
- payment success rate
- cancellation rate
- fulfilment completion rate
- reorder rate
- scheduled-order adoption
- group-order adoption
- pickup share
- average order value

Business:
- active businesses
- menu completeness
- order acceptance rate
- preparation-time accuracy
- repeat customer rate
- merchant dashboard usage

## Hypotheses

- Intent-first discovery can reduce friction.
- Group commerce can increase basket size.
- Scheduled/repeat ordering can increase retention.
- Local-food discovery can strengthen relevance.
- Business intelligence can create merchant value beyond order acquisition.

These remain hypotheses until measured.

## Architecture

Target:
Flutter -> NestJS modular monolith -> Supabase/PostgreSQL

Transition:
Existing Web -> API boundary -> Flutter -> progressively reduce direct frontend database access

The current web app remains valuable during the transition.
