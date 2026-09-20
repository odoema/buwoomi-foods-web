-- Fix the customer-order update trigger after admin authorization was
-- moved from public.is_admin() to private.is_admin().
--
-- The trigger is SECURITY DEFINER and trigger-only. It must use the same
-- private authorization helper as the canonical RLS policies.

create or replace function public.guard_customer_order_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if (select private.is_admin()) then
    return new;
  end if;

  if (select auth.uid()) is null or (select auth.uid()) <> old.user_id then
    raise exception 'You can only update your own order.';
  end if;

  if new.id is distinct from old.id
     or new.order_no is distinct from old.order_no
     or new.user_id is distinct from old.user_id
     or new.status is distinct from old.status
     or new.subtotal_ugx is distinct from old.subtotal_ugx
     or new.delivery_fee_ugx is distinct from old.delivery_fee_ugx
     or new.total_ugx is distinct from old.total_ugx
     or new.payment_method is distinct from old.payment_method
     or new.delivery_address_id is distinct from old.delivery_address_id
     or new.rider_name is distinct from old.rider_name
     or new.rider_phone is distinct from old.rider_phone
     or new.placed_at is distinct from old.placed_at
     or new.delivered_at is distinct from old.delivered_at
     or new.delivery_requested_at is distinct from old.delivery_requested_at then
    raise exception 'Customers may only update an order rating.';
  end if;

  return new;
end;
$function$;

revoke execute on function public.guard_customer_order_update() from public, anon, authenticated;
