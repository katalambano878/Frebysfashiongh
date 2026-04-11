alter table public.orders
  add column if not exists payment_reminder_sent boolean not null default false,
  add column if not exists payment_reminder_sent_at timestamptz;

create index if not exists orders_payment_reminder_idx
  on public.orders (payment_reminder_sent, created_at);
