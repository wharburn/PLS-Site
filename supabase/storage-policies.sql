-- Supabase Storage policies for PLS-Site
-- Bucket: documents (private)
-- Goal: authenticated users can CRUD only objects under their own folder: <auth.uid()>/...
--
-- Run this in Supabase Dashboard → SQL Editor.

-- Ensure the bucket exists (safe if already created)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = excluded.public;

-- Storage uses RLS on storage.objects; ensure it's enabled
alter table storage.objects enable row level security;

-- Clean up any older policies with same names (optional safety)
drop policy if exists "documents: user can read own" on storage.objects;
drop policy if exists "documents: user can upload own" on storage.objects;
drop policy if exists "documents: user can update own" on storage.objects;
drop policy if exists "documents: user can delete own" on storage.objects;

-- READ (list/download via signed URL)
create policy "documents: user can read own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPLOAD
create policy "documents: user can upload own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE (rename/move/metadata)
create policy "documents: user can update own"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE
create policy "documents: user can delete own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
