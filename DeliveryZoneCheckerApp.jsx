import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const DELIVERY_CHARGE = 25;

const ZONE_1_POLYGON = [
  [-75.8156016,44.2553902],[-75.9227183,44.162859],[-76.0133556,44.0543933],
  [-76.1094859,43.9239717],[-76.1259654,43.7754175],[-76.1808971,43.5281164],
  [-76.2358287,43.470339],[-76.4253429,43.4723322],[-76.5928844,43.4603718],
  [-76.6862682,43.3705929],[-76.6642955,43.2746821],[-76.5846446,43.0402652],
  [-76.6011241,42.8975738],[-76.3017467,42.8613459],[-76.2578014,42.6798876],
  [-76.1644176,42.4816952],[-76.0375832,42.3163186],[-75.9675454,42.2177413],
  [-75.9620522,42.1546525],[-76.0781653,42.1061033],[-76.0753264,42.0431288],
  [-75.9936379,42.039506],[-75.9194802,42.0313461],[-75.7464455,42.0109418],
  [-75.6489418,42.029306],[-75.6022499,42.0599011],[-75.5486916,42.1027096],
  [-75.4786538,42.1862048],[-75.4196022,42.2441792],[-75.3014992,42.288895],
  [-75.1943825,42.3315487],[-75.0666664,42.3833036],[-74.9897621,42.4471772],
  [-74.8510137,42.5228687],[-74.7081914,42.5754771],[-74.5708623,42.6209678],
  [-74.4925847,42.6492563],[-74.4719854,42.7037765],[-74.5131841,42.7340448],
  [-74.5392766,42.8378537],[-74.3593755,42.871076],[-74.2124334,42.8952265],
  [-74.1245427,42.9394778],[-74.1767278,43.0650183],[-74.3195501,43.0860839],
  [-74.4541326,43.0890927],[-74.5626226,43.0690314],[-74.6422734,43.0790629],
  [-74.7425237,43.1211772],[-74.7796025,43.1492374],[-74.8304143,43.1812904],
  [-74.885346,43.1953083],[-74.937531,43.2163291],[-74.9787297,43.2333406],
  [-74.9457708,43.2953424],[-74.9183049,43.3522884],[-74.947144,43.3932165],
  [-75.0254216,43.3732551],[-75.131165,43.3642702],[-75.1723638,43.4111763],
  [-75.1229253,43.4600396],[-75.0858464,43.5307717],[-75.0872197,43.5596384],
  [-75.1558843,43.5964483],[-75.2753606,43.6103705],[-75.3247991,43.6670204],
  [-75.3618779,43.8108892],[-75.2808538,43.9682513],[-75.2822271,44.0768748],
  [-75.2794805,44.0837805],[-75.2684941,44.1488515],[-75.2877202,44.2059759],
  [-75.338532,44.2709123],[-75.3536382,44.3053191],[-75.4195562,44.3495269],
  [-75.4580083,44.3691641],[-75.5431524,44.3347947],[-75.631043,44.2925418],
  [-75.6846013,44.2482911],[-75.7477727,44.2374691],[-75.8123174,44.2433722],
  [-75.824677,44.2197563],[-75.8156016,44.2553902]
];

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect =
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function App() {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-75.2, 43.1],
      zoom: 6,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("zone", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ZONE_1_POLYGON],
          },
        },
      });

      mapRef.current.addLayer({
        id: "zone-fill",
        type: "fill",
        source: "zone",
        paint: {
          "fill-color": "#2563eb",
          "fill-opacity": 0.3,
        },
      });
    });
  }, []);

  async function checkAddress() {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const [lng, lat] = data.features[0].center;

    const inside = pointInPolygon([lng, lat], ZONE_1_POLYGON);

    setResult(
      inside
        ? `Zone 1 — $${DELIVERY_CHARGE}`
        : "Outside Area — Ask for Quote"
    );

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
    mapRef.current.flyTo({ center: [lng, lat], zoom: 9 });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Tolpa's Delivery Tool</h1>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
      />
      <button onClick={checkAddress}>Check</button>

      <div style={{ marginTop: 10 }}>{result}</div>

      <div
        ref={mapContainer}
        style={{ height: 500, marginTop: 20 }}
      />
    </div>
  );
}
