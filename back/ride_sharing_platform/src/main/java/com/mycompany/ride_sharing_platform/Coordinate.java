package com.mycompany.ride_sharing_platform;

public class Coordinate {
    private double latitude;
    private double longitude;

    // Constructor
    public Coordinate(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters y Setters
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    // Método para mostrar las coordenadas de forma más legible
    @Override
    public String toString() {
        return latitude + ", " + longitude;
    }
}


