package com.silkroute_erp.weather.client;

import com.silkroute_erp.weather.exception.NoCityFoundException;
import com.silkroute_erp.weather.model.GeoResult;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;

public class WeatherClient {

    private final RestTemplate rest = new RestTemplate();

    public GeoResult fetchCoordinates(String city) {
        String url = "https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1&language=pl&format=json";

        String response = rest.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);

        JSONArray results = json.optJSONArray("results");
        if (results == null || results.isEmpty()) {
            throw new NoCityFoundException(city);
        }

        JSONObject first = results.getJSONObject(0);

        return new GeoResult(
                first.getDouble("latidude"),
                first.getDouble("longnitude"),
                first.getString("name")
        );
    }
}
