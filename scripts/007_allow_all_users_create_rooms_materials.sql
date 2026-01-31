-- ============================================================================
-- Script para permitir que TODOS los usuarios autenticados puedan 
-- crear, editar y eliminar salas deportivas y materiales
-- ============================================================================

-- ============================================================================
-- TABLA: sports_rooms
-- ============================================================================

-- Eliminar políticas antiguas restrictivas (solo admin)
DROP POLICY IF EXISTS rooms_insert_admin ON sports_rooms;
DROP POLICY IF EXISTS rooms_update_admin ON sports_rooms;
DROP POLICY IF EXISTS rooms_delete_admin ON sports_rooms;

-- Crear nuevas políticas que permiten a TODOS los usuarios autenticados
CREATE POLICY rooms_insert_all ON sports_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY rooms_update_all ON sports_rooms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY rooms_delete_all ON sports_rooms
  FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================================
-- TABLA: sports_materials
-- ============================================================================

-- Eliminar políticas antiguas restrictivas (solo admin)
DROP POLICY IF EXISTS materials_insert_admin ON sports_materials;
DROP POLICY IF EXISTS materials_update_admin ON sports_materials;
DROP POLICY IF EXISTS materials_delete_admin ON sports_materials;

-- Crear nuevas políticas que permiten a TODOS los usuarios autenticados
CREATE POLICY materials_insert_all ON sports_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY materials_update_all ON sports_materials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY materials_delete_all ON sports_materials
  FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Verificar las nuevas políticas
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename IN ('sports_rooms', 'sports_materials')
ORDER BY tablename, policyname;
