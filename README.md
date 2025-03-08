# Flight Tracker with MQTT and FlightRadar24API

<p align="center">
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Overview

This project is a Node.js application that fetches flight data from FlightRadar24 based on a given location and publishes the filtered data to an MQTT broker. The application continuously updates flight data at regular intervals and listens for location updates via MQTT messages.

## Features

- Fetches real-time flight data using <mark>flightradarapi.<mark>

- Filters flights based on a specified maximum distance from a given latitude and longitude.

- Publishes filtered flight data to an MQTT broker.

- Listens for updated GPS coordinates via MQTT and adjusts the tracking location dynamically.

- Logs success and error messages for better monitoring.

## Libraries Used

- [FlightRadarAPI, Fetches real-time flight data](https://github.com/JeanExtreme002/FlightRadarAPI?tab=readme-ov-file).

- [mqtt, Handles MQTT communication for sending and receiving messages](https://www.npmjs.com/package/mqtt).

- [dotenv, Loads environment variables from a <mark>.env<mark> file](https://www.npmjs.com/package/dotenv).

## Installation

**Prerequisites**

Ensure you have Node.js installed on your system.

**Setup**

1. Clone the repository:

    ```
    git clone <repository_url>
    cd <repository_name>
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create a .env file in the root directory and configure the following environment variables:

    ```
    MQTT_BROKER_URL=<your_mqtt_broker_url>
    MQTT_USERNAME=<your_mqtt_username>
    MQTT_PASSWORD=<your_mqtt_password>
    TOPIC=<your_mqtt_topic>
    LAT=<initial_latitude>
    LON=<initial_longitude>
    MAX_DISTANCE=<maximum_distance_km>
    ```

## Usage

1. **Start the application:**

    ```
    node index.js
    ```

2. The application will:

    - Fetch flight data based on the configured location.
    
    - Filter flights within the specified <mark>MAX_DISTANCE.<mark>
    
    - Publish flight data to the MQTT topic.
    
    - Listen for GPS location updates and adjust tracking dynamically.

## Code Explanation

**Flight Data Retrieval & Filtering**

- The function <mark>getFilteredFlights(lat, lon, maxDistance)<mark> fetches flights within a bounding box and filters them based on distance.

- <mark>calculateDistance(lat1, lon1, lat2, lon2)<mark> is used to determine whether a flight is within the <mark>maxDistance.<mark>

**MQTT Integration**

- Establishes connection to the MQTT broker using credentials.

- Publishes filtered flight data at regular intervals.

- Listens for GPS updates on the <mark>gps/position<mark> topic and updates lat and lon dynamically.

**Logging & Error Handling**

- Success and failure messages are logged with timestamps.

- Handles MQTT connection errors, disconnections, and reconnections gracefully.

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Author

[azidhmaulana]

