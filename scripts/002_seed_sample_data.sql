-- Insertar datos de ejemplo

-- Salas deportivas
INSERT INTO public.sports_rooms (name, description, capacity, location, hourly_rate, is_available) VALUES
('Cancha de Tenis 1', 'Cancha cubierta de tenis con iluminación profesional', 2, 'Edificio B - Piso 2', 25.00, TRUE),
('Cancha de Fútbol 5', 'Cancha de fútbol sala con césped sintético', 10, 'Complejo Deportivo Sur', 50.00, TRUE),
('Gimnasio 1', 'Gimnasio equipado con máquinas y pesas', 30, 'Edificio A - Piso 1', 15.00, TRUE),
('Cancha de Voleibol', 'Cancha de voleibol con red de competencia', 12, 'Complejo Deportivo Sur', 20.00, TRUE),
('Sala de Yoga', 'Sala con espejo completo y tapetes', 20, 'Edificio C - Piso 3', 10.00, TRUE),
('Piscina Olímpica', 'Piscina de 50 metros con carriles', 50, 'Complejo Acuático', 30.00, TRUE);

-- Materiales deportivos
INSERT INTO public.sports_materials (name, description, category, quantity_available, quantity_total, is_available) VALUES
('Balón de Fútbol', 'Balón oficial de fútbol tamaño 5', 'Balones', 15, 20, TRUE),
('Raqueta de Tenis', 'Raqueta profesional de tenis', 'Raquetas', 10, 15, TRUE),
('Colchoneta de Yoga', 'Colchoneta ecológica para yoga', 'Accesorios', 25, 30, TRUE),
('Red de Voleibol', 'Red profesional de voleibol', 'Redes', 3, 5, TRUE),
('Mancuernas (5kg)', 'Juego de mancuernas de 5 kilogramos', 'Pesas', 40, 50, TRUE),
('Casco de Ciclismo', 'Casco de protección para ciclismo', 'Protección', 20, 25, TRUE),
('Pista de Atletismo (uso)', 'Acceso a pista de atletismo', 'Espacios', 8, 10, TRUE);
