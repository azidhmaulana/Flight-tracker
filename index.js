const { FlightRadar24API } = require("flightradarapi");
const mqtt = require("mqtt");
require("dotenv").config();

const frApi = new FlightRadar24API();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

async function getFilteredFlights(lat, lon, maxDistance) {
  try {
    let bounds = frApi.getBoundsByPoint(lat, lon, maxDistance * 1000);
    let flights = await frApi.getFlights(null, bounds);

    let filteredFlights = flights.filter((flight) => {
      let distance = calculateDistance(
        lat,
        lon,
        flight.latitude,
        flight.longitude
      );
      return distance <= maxDistance;
    });

    return filteredFlights;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
}

let messageCounter = 0;

async function fetchAndSendFlights(client, topic, lat, lon, maxDistance) {
  try {
    let filteredFlights = await getFilteredFlights(lat, lon, maxDistance);
    messageCounter++;
    const timestamp = new Date().toISOString();
    console.log(
      `#${messageCounter} - ${timestamp} - Mengirim data penerbangan : Succes`
    );

    const message = JSON.stringify(filteredFlights);
    client.publish(topic, message, { qos: 0 }, (error) => {
      if (error) {
        console.error(
          `#${messageCounter} - ${timestamp} - Mengirim data penerbangan : Error - Message = ${error}`
        );
      }
    });
  } catch (error) {
    console.error(
      `#${messageCounter} - ${timestamp} - Mengirim data penerbangan : Error in fetchAndSendFlights - Message = ${error}`
    );
  }
}

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const topic = process.env.TOPIC;
let lat = parseFloat(process.env.LAT);
let lon = parseFloat(process.env.LON);
const maxDistance = parseInt(process.env.MAX_DISTANCE);

const client = mqtt.connect(mqttBrokerUrl, {
  username: username,
  password: password,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe("gps/position");

  setInterval(() => {
    fetchAndSendFlights(client, topic, lat, lon, maxDistance);
  }, 5000);

  fetchAndSendFlights(client, topic, lat, lon, maxDistance);
});

client.on("message", (topic, message) => {
  mqttData = message.toString();
  const trimmedData = mqttData.slice(1, -1);

  const [latitude, longitude, tcpData] = trimmedData.split("#");

  lat = latitude;
  lon = longitude;
});

client.on("error", (error) => {
  console.error("MQTT client error:", error);
});

client.on("offline", () => {
  console.warn("MQTT client is offline");
});

client.on("reconnect", () => {
  console.log("MQTT client is reconnecting");
});

client.on("close", () => {
  console.log("MQTT connection closed");
});
