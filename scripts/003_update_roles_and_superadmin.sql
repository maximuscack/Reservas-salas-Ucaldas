-- Actualizar la estructura de roles: superadmin, admin, student
-- Primero actualizar la columna role para permitir los nuevos valores
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE TEXT;

-- Actualizar la función de creación de usuario para usar 'student' por defecto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    'student' -- Cambiar role por defecto a student
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Actualizar las políticas RLS para incluir superadmin
-- Políticas para salas (superadmin y admin pueden modificar)
DROP POLICY IF EXISTS "rooms_insert_admin" ON public.sports_rooms;
DROP POLICY IF EXISTS "rooms_update_admin" ON public.sports_rooms;
DROP POLICY IF EXISTS "rooms_delete_admin" ON public.sports_rooms;

CREATE POLICY "rooms_insert_admin_or_super"
  ON public.sports_rooms FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "rooms_update_admin_or_super"
  ON public.sports_rooms FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "rooms_delete_admin_or_super"
  ON public.sports_rooms FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- Políticas para materiales
DROP POLICY IF EXISTS "materials_insert_admin" ON public.sports_materials;
DROP POLICY IF EXISTS "materials_update_admin" ON public.sports_materials;
DROP POLICY IF EXISTS "materials_delete_admin" ON public.sports_materials;

CREATE POLICY "materials_insert_admin_or_super"
  ON public.sports_materials FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "materials_update_admin_or_super"
  ON public.sports_materials FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "materials_delete_admin_or_super"
  ON public.sports_materials FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- Políticas para horarios bloqueados
DROP POLICY IF EXISTS "blocked_schedules_insert_admin" ON public.blocked_schedules;
DROP POLICY IF EXISTS "blocked_schedules_delete_admin" ON public.blocked_schedules;

CREATE POLICY "blocked_schedules_insert_admin_or_super"
  ON public.blocked_schedules FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "blocked_schedules_delete_admin_or_super"
  ON public.blocked_schedules FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- Políticas para reservas de salas (superadmin y admin ven todas)
DROP POLICY IF EXISTS "room_reservations_select_own" ON public.room_reservations;
DROP POLICY IF EXISTS "room_reservations_update_own" ON public.room_reservations;

CREATE POLICY "room_reservations_select_own"
  ON public.room_reservations FOR SELECT
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "room_reservations_update_own"
  ON public.room_reservations FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- Políticas para reservas de materiales (superadmin y admin ven todas)
DROP POLICY IF EXISTS "material_reservations_select_own" ON public.material_reservations;
DROP POLICY IF EXISTS "material_reservations_update_own" ON public.material_reservations;

CREATE POLICY "material_reservations_select_own"
  ON public.material_reservations FOR SELECT
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "material_reservations_update_own"
  ON public.material_reservations FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- Políticas para reminders (superadmin y admin pueden ver)
DROP POLICY IF EXISTS "reminders_select_admin" ON public.reservation_reminders;

CREATE POLICY "reminders_select_admin_or_super"
  ON public.reservation_reminders FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- CREAR SUPERADMINISTRADOR
-- Reemplaza 'admin@example.com' con el email del usuario que creaste
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE email = 'admin@example.com';
