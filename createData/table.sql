CREATE TABLE "trips" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "continent" TEXT NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "budget" NUMERIC(10,2) CHECK ("budget" >= 0),
    "travelType" TEXT CHECK ("travelType" IN ('Solo', 'Familiar', 'Negocios', 'Aventura', 'Romántico', 'Otro')),
    "accommodation" TEXT CHECK ("accommodation" IN ('Hotel', 'Hostal', 'Airbnb', 'Camping', 'Otro')),
    "images" JSON, -- URLs o base64 de fotos del destino
    "thingsToDo" JSON, -- Actividades recomendadas en el destino
    "coords" JSON, -- {"lat": <valor>, "lon": <valor>}
    "climate" TEXT CHECK ("climate" IN ('Tropical', 'Seco', 'Templado', 'Continental', 'Polar', 'Mediterráneo', 'Árido', 'Húmedo Subtropical', 'Oceánico', 'Subártico', 'Tundra', 'Montaña')), -- Información climática del destino
    "rating" NUMERIC(2,1) CHECK ("rating" BETWEEN 0 AND 5), -- Calificación del viaje
    "notes" TEXT, -- Notas personales del usuario
    "createdAt" TIMESTAMP DEFAULT now(),
    "travelTips" JSON, -- Consejos sobre comida, costumbres, recomendaciones
    "season" TEXT CHECK ("season" IN ('Invierno', 'Primavera', 'Verano', 'Otoño', 'Cualquiera')) -- Mejor época para viajar
);
