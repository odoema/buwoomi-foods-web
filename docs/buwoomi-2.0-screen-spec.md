# BUWOOMI 2.0 — Screen Specification

Date: 2026-09-20
Status: Initial screen contract

## Home
Goal: answer “what can I do right now?”

Structure:
1. location
2. greeting
3. intent/search input
4. food-intent shortcuts
5. order again
6. scheduled/group activity
7. relevant food/businesses

## Discover
Goal: find something specific or explore.

Structure:
1. search
2. filters
3. category/intention navigation
4. result cards
5. business/food distinction
6. loading, empty and error states

## Business detail
Show:
- business name
- service status
- fulfilment options
- operating hours
- ratings where available
- menu categories
- menu items

## Food detail
Show:
- image
- name
- description
- price
- options/extras
- availability
- quantity
- add to cart
- favourite

## Cart
Show:
- items
- quantities
- options/extras
- subtotal
- fulfilment
- fees
- total
- schedule option
- checkout

## Checkout
Steps:
1. fulfilment
2. address/pickup point
3. timing
4. payment
5. final review
6. place order

Never expose raw card data to Buwoomi when using a hosted/tokenized gateway.

## Active order
Show:
- order number
- payment state
- fulfilment state
- preparation status
- estimated timing
- pickup/delivery information
- support

## Orders
Show:
- active
- scheduled
- past
- reorder

## Groups
Show:
- active groups
- create/join
- deadline
- participants
- items
- payment state
- fulfilment

## Account
Show:
- profile
- addresses
- payment methods
- favourites
- notifications
- support
- business workspace entry when authorised

## Business dashboard
Show:
- today's orders
- pending actions
- sales snapshot
- menu availability
- fulfilment status

## Design principle

Do not merely reskin existing screens. Every screen should answer a user intent and move the user toward discovery, planning, commerce or management.
