package com.mycompany.ride_sharing_platform;

public class RouteService {

    //public static Coordinate updatePosition(Double originLat,Double originLon,Double destinationLat,Double destinationLog) {
    public static String updatePosition(String coords) {
        String[] coordsParts = coords.split(":");

        // Convertir las coordenadas a Double
        Double originLat = Double.valueOf(coordsParts[0]);
        Double originLon = Double.valueOf(coordsParts[1]);
        Double destinationLat = Double.valueOf(coordsParts[2]);
        Double destinationLon = Double.valueOf(coordsParts[3]);
        // Calculamos la distancia entre el origen y el destino
        Coordinate origin = new Coordinate(originLat, originLon); 
        Coordinate destination = new Coordinate(destinationLat, destinationLon);
        double distance = calculateDistance(origin, destination);

        // Si la distancia es suficientemente pequeña, devolvemos la posición actual (no actualizamos)
        if (distance < 0.0001) {
            return origin.toString(); // Ya estamos en el destino
        }

        // Calculamos un paso pequeño para acercar la posición al destino Nueva posici�n: 4.6097004154588745, -74.08169982742477
        double step = 0.1; // Paso pequeño para acercar la posición

        // Calculamos la nueva latitud y longitud
        double newLatitude = origin.getLatitude() + step * (destination.getLatitude() - origin.getLatitude()) / distance;
        double newLongitude = origin.getLongitude() + step * (destination.getLongitude() - origin.getLongitude()) / distance;

        // Devolvemos la nueva posición actualizada
        Coordinate newCoords = new Coordinate(newLatitude, newLongitude);
        //return new Coordinate(newLatitude, newLongitude);
        return newCoords.toString();
    }

    public static double calculateDistance(Coordinate point1, Coordinate point2) {
        final double R = 6371; // Radio de la Tierra en km
        double lat1 = Math.toRadians(point1.getLatitude());
        double lon1 = Math.toRadians(point1.getLongitude());
        double lat2 = Math.toRadians(point2.getLatitude());
        double lon2 = Math.toRadians(point2.getLongitude());

        double dlat = lat2 - lat1;
        double dlon = lon2 - lon1;

        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dlon / 2) * Math.sin(dlon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
