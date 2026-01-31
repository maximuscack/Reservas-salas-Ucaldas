-- Script 006: Diagnosticar y corregir problema de autenticación
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Verificar que el usuario existe y tiene la contraseña correcta
SELECT 
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password
FROM auth.users
WHERE email = 'superadmin@deportes.edu';

-- PASO 2: Verificar que el perfil existe
SELECT 
  id,
  email,
  role,
  full_name
FROM public.profiles
WHERE email = 'superadmin@deportes.edu';

-- PASO 3: Verificar que el trigger está activo
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- PASO 4: Eliminar completamente el usuario y recrearlo desde cero
BEGIN;

-- Eliminar usuario existente
DELETE FROM public.profiles WHERE email = 'superadmin@deportes.edu';
DELETE FROM auth.users WHERE email = 'superadmin@deportes.edu';

-- Crear nuevo usuario directamente con las identities
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,  -- UUID fijo para debugging
  'authenticated',
  'authenticated',
  'superadmin@deportes.edu',
  crypt('SuperAdmin2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Super Administrador"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Crear perfil manualmente (sin esperar el trigger)
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'superadmin@deportes.edu',
  'Super Administrador',
  'superadmin',
  NOW(),
  NOW()
);

COMMIT;

-- PASO 5: Verificar que todo se creó correctamente
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'superadmin@deportes.edu';
