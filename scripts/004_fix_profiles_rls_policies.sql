-- Script 004: Corregir políticas RLS para profiles
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2025-01-27
-- Propósito: Permitir que usuarios autenticados lean su propio perfil durante login

BEGIN;

-- Eliminar políticas existentes de profiles
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_all_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_update_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

-- IMPORTANTE: Permitir que cada usuario lea su propio perfil
CREATE POLICY profiles_select_own 
ON public.profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- Permitir que admins y superadmins vean todos los perfiles
CREATE POLICY profiles_select_all_admin 
ON public.profiles FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('superadmin', 'admin')
  )
);

-- Permitir que admins y superadmins inserten nuevos perfiles
CREATE POLICY profiles_insert_admin 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('superadmin', 'admin')
  )
);

-- Permitir que usuarios actualicen su propio perfil (excepto el rol)
CREATE POLICY profiles_update_own 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Permitir que admins y superadmins actualicen cualquier perfil
CREATE POLICY profiles_update_admin 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('superadmin', 'admin')
  )
);

COMMIT;

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
