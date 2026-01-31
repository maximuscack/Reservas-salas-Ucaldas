-- Script 005: Eliminar y recrear TODAS las políticas RLS de profiles desde cero
-- Este script asegura que no haya políticas conflictivas

BEGIN;

-- PASO 1: Eliminar TODAS las políticas existentes de profiles
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- PASO 2: Crear políticas simples y claras

-- Política 1: Cualquier usuario autenticado puede leer su propio perfil
CREATE POLICY profiles_select_own 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Política 2: Admins y superadmins pueden leer TODOS los perfiles
CREATE POLICY profiles_select_admin 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  role IN ('superadmin', 'admin')
);

-- Política 3: Admins y superadmins pueden insertar perfiles
CREATE POLICY profiles_insert_by_admin 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('superadmin', 'admin')
  )
);

-- Política 4: Usuarios pueden actualizar su propio perfil (sin cambiar rol)
CREATE POLICY profiles_update_own 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Política 5: Admins y superadmins pueden actualizar cualquier perfil
CREATE POLICY profiles_update_by_admin 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('superadmin', 'admin')
  )
);

-- Política 6: Solo admins y superadmins pueden eliminar perfiles
CREATE POLICY profiles_delete_by_admin 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('superadmin', 'admin')
  )
);

COMMIT;

-- Verificar las políticas creadas
SELECT 
  policyname, 
  cmd as command,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'public'
ORDER BY policyname;

-- Verificar que el superadmin existe y puede ser consultado
SELECT id, email, role, full_name 
FROM public.profiles 
WHERE email = 'superadmin@deportes.edu';
