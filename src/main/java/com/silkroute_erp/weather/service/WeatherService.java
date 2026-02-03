package com.silkroute_erp.weather.service;

import com.silkroute_erp.weather.client.WeatherClient;
import com.silkroute_erp.weather.model.GeoResult;
import com.silkroute_erp.weather.model.TemperatureLevel;
import com.silkroute_erp.weather.model.WeatherDay;
import com.silkroute_erp.weather.model.WeatherForecast;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {
    private final WeatherClient weatherClient;

    public WeatherService(WeatherClient weatherClient) {
        this.weatherClient = weatherClient;
    }

    public WeatherForecast getForecastForCity(String city) {
        GeoResult geo = weatherClient.fetchCoordinates(city);
        WeatherForecast forecast = weatherClient.fetchForecast(
                geo.latitude(),
                geo.longnitude()
        );
        List<WeatherDay> classified = forecast.days().stream()
                .map(day -> new WeatherDay(
                        day.date(),
                        day.minTemp(),
                        day.maxTemp(),
                        classify(day.maxTemp())
                ))
                .toList();
        return new WeatherForecast(classified);
    }

    private TemperatureLevel classify(double maxTemp) {
        if (maxTemp < 10) {
            return TemperatureLevel.TOO_COLD;
        }
        if (maxTemp < 18) {
            return TemperatureLevel.RISKY;
        }
        return TemperatureLevel.SAFE;
    }
}
