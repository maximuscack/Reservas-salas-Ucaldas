-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' o 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de salas deportivas
CREATE TABLE IF NOT EXISTS public.sports_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  location TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de materiales deportivos
CREATE TABLE IF NOT EXISTS public.sports_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_total INTEGER NOT NULL,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de horarios bloqueados (para marcar salas como no disponibles)
CREATE TABLE IF NOT EXISTS public.blocked_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.sports_rooms(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservas de salas
CREATE TABLE IF NOT EXISTS public.room_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.sports_rooms(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservas de materiales
CREATE TABLE IF NOT EXISTS public.material_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.sports_materials(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reminders (para notificaciones por correo)
CREATE TABLE IF NOT EXISTS public.reservation_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES public.room_reservations(id) ON DELETE CASCADE,
  material_reservation_id UUID REFERENCES public.material_reservations(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas RLS para salas (lectura pública, solo admins pueden modificar)
CREATE POLICY "rooms_select_all"
  ON public.sports_rooms FOR SELECT
  USING (TRUE);

CREATE POLICY "rooms_insert_admin"
  ON public.sports_rooms FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "rooms_update_admin"
  ON public.sports_rooms FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "rooms_delete_admin"
  ON public.sports_rooms FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para materiales (lectura pública, solo admins pueden modificar)
CREATE POLICY "materials_select_all"
  ON public.sports_materials FOR SELECT
  USING (TRUE);

CREATE POLICY "materials_insert_admin"
  ON public.sports_materials FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "materials_update_admin"
  ON public.sports_materials FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "materials_delete_admin"
  ON public.sports_materials FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para horarios bloqueados (solo admins)
CREATE POLICY "blocked_schedules_select_all"
  ON public.blocked_schedules FOR SELECT
  USING (TRUE);

CREATE POLICY "blocked_schedules_insert_admin"
  ON public.blocked_schedules FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "blocked_schedules_delete_admin"
  ON public.blocked_schedules FOR DELETE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para reservas de salas (usuarios ven sus propias, admins ven todas)
CREATE POLICY "room_reservations_select_own"
  ON public.room_reservations FOR SELECT
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "room_reservations_insert_own"
  ON public.room_reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "room_reservations_update_own"
  ON public.room_reservations FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para reservas de materiales (usuarios ven sus propias, admins ven todas)
CREATE POLICY "material_reservations_select_own"
  ON public.material_reservations FOR SELECT
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "material_reservations_insert_own"
  ON public.material_reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "material_reservations_update_own"
  ON public.material_reservations FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para reminders (solo admins)
CREATE POLICY "reminders_select_admin"
  ON public.reservation_reminders FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Crear función para auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Crear trigger para auto-crear perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
