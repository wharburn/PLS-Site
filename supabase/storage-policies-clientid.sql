-- Supabase Storage bucket + policies for PLS-Site
-- Bucket: documents (PRIVATE)
-- Object path format: <client_id>/<category>/<filename>
-- Access rule: logged-in user can access objects for their client_id, where client_id is mapped via clients.email = auth.jwt()->>'email'

-- Create bucket (private)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = excluded.public;

alter table storage.objects enable row level security;

-- Clean up
drop policy if exists "documents: client can read" on storage.objects;
drop policy if exists "documents: client can upload" on storage.objects;
drop policy if exists "documents: client can update" on storage.objects;
drop policy if exists "documents: client can delete" on storage.objects;

-- Helper: first folder segment should be the client_id
-- (storage.foldername(name))[1] extracts the first folder.

create policy "documents: client can read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.clients where email = auth.jwt() ->> 'email'
    )
  );

create policy "documents: client can upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.clients where email = auth.jwt() ->> 'email'
    )
  );

create policy "documents: client can update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.clients where email = auth.jwt() ->> 'email'
    )
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.clients where email = auth.jwt() ->> 'email'
    )
  );

create policy "documents: client can delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.clients where email = auth.jwt() ->> 'email'
    )
  );
