import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

<div ref={mapContainerRef} style={{ height: 650, borderRadius: 14, overflow: "hidden" }} />

const DELIVERY_CHARGE = 25;

const ZONE_1_POLYGON = [
  [-75.8156016,44.2553902],[-75.9227183,44.162859],[-76.0133556,44.0543933],
  [-76.091686,43.9852403],[-76.2578013,43.8962697],[-76.2962535,43.7416938],
  [-76.3264463,43.5358371],[-76.4253,43.5159275],[-76.4994404,43.5059701],
  [-76.574962,43.4820962],[-76.6862682,43.3705929],[-76.6642955,43.2746821],
  [-76.6048185,43.0905258],[-76.5828459,42.9721277],[-76.6011241,42.8975738],
  [-76.3017467,42.8613459],[-76.2578014,42.6798876],[-76.1644176,42.4816952],
  [-76.0375832,42.3163186],[-75.9675454,42.2177413],[-75.9641822,42.1468443],
  [-76.0781653,42.1061033],[-76.0753264,42.0431288],[-75.9936379,42.039506],
  [-75.9194802,42.0313461],[-75.7464455,42.0109418],[-75.6489418,42.029306],
  [-75.6022499,42.0599011],[-75.5486916,42.1027096],[-75.4786538,42.1862048],
  [-75.4196022,42.2441792],[-75.3014992,42.288895],[-75.1943825,42.3315487],
  [-75.0666664,42.3833036],[-74.9897621,42.4471772],[-74.8510137,42.5228687],
  [-74.7081914,42.5754771],[-74.5708623,42.6209678],[-74.4925847,42.6492563],
  [-74.4719854,42.7037765],[-74.5131841,42.7340448],[-74.5392766,42.8378537],
  [-74.3593755,42.871076],[-74.2124334,42.8952265],[-74.1245427,42.9394778],
  [-74.1767278,43.0650183],[-74.3195501,43.0860839],[-74.4541326,43.0890927],
  [-74.5626226,43.0690314],[-74.6422734,43.0790629],[-74.7425237,43.1211772],
  [-74.7796025,43.1492374],[-74.8304143,43.1812904],[-74.885346,43.1953083],
  [-74.937531,43.2163291],[-74.9787297,43.2333406],[-74.9457708,43.2953424],
  [-74.9183049,43.3522884],[-74.947144,43.3932165],[-75.0254216,43.3732551],
  [-75.131165,43.3642702],[-75.1723638,43.4111763],[-75.1229253,43.4600396],
  [-75.0858464,43.5307717],[-75.0872197,43.5596384],[-75.1558843,43.5964483],
  [-75.2753606,43.6103705],[-75.3247991,43.6670204],[-75.3618779,43.8108892],
  [-75.2808538,43.9682513],[-75.2822271,44.0768748],[-75.2794805,44.0837805],
  [-75.2684941,44.1488515],[-75.2877202,44.2059759],[-75.338532,44.2709123],
  [-75.3536382,44.3053191],[-75.4195562,44.3495269],[-75.4580083,44.3691641],
  [-75.5431524,44.3347947],[-75.631043,44.2925418],[-75.6846013,44.2482911],
  [-75.7477727,44.2374691],[-75.8123174,44.2433722],[-75.824677,44.2197563],
  [-75.8156016,44.2553902]
];

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const ZIP_PREFIX = {
  "120": [42.9387, -74.1906],
  "121": [42.7000, -73.7000],
  "122": [42.6781, -73.8856],
  "123": [42.8000, -73.9000],
  "124": [42.0000, -74.1000],
  "125": [41.7000, -73.8000],
  "126": [41.7000, -73.9000],
  "127": [41.6000, -74.6000],
  "128": [43.3000, -73.6000],
  "129": [44.7000, -73.5000],
  "130": [43.1000, -76.2000],
  "131": [43.3000, -76.5000],
  "132": [43.0481, -76.1474],
  "133": [43.3000, -75.6000],
  "134": [43.2128, -75.4557],
  "135": [43.1009, -75.2327],
  "136": [43.9748, -75.9108],
  "137": [42.1000, -75.9000],
  "138": [42.2000, -75.9000],
  "139": [42.0987, -75.9179],
  "140": [42.9000, -78.8000],
  "141": [43.0000, -78.7000],
  "142": [42.9000, -78.8000],
  "143": [43.1000, -79.0000],
  "144": [43.0000, -77.6000],
  "145": [43.1000, -77.5000],
  "146": [43.1500, -77.6000],
  "147": [42.2000, -79.4000],
  "148": [42.4000, -76.5000],
  "149": [42.1000, -76.8000]
};

export default function DeliveryZoneCheckerApp() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || !mapboxgl.accessToken) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-75.2, 43.1],
      zoom: 6
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("zone1", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ZONE_1_POLYGON]
          }
        }
      });

      mapRef.current.addLayer({
        id: "zone1-fill",
        type: "fill",
        source: "zone1",
        paint: {
          "fill-color": "#2563eb",
          "fill-opacity": 0.25
        }
      });

      mapRef.current.addLayer({
        id: "zone1-outline",
        type: "line",
        source: "zone1",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2
        }
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  function setPointResult(lat, lng, label) {
    const inside = pointInPolygon([lng, lat], ZONE_1_POLYGON);
    setResult(inside ? `Zone 1 — $${DELIVERY_CHARGE}` : "Ask for Quote");

    if (mapRef.current) {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 8 });
    }
  }

  function checkZip() {
    const clean = zip.replace(/\D/g, "").slice(0, 5);
    if (clean.length !== 5) {
      setResult("Enter valid ZIP");
      return;
    }
    const coords = ZIP_PREFIX[clean.slice(0, 3)];
    if (!coords) {
      setResult("Ask for Quote");
      return;
    }
    setPointResult(coords[0], coords[1], clean);
  }

  async function checkAddress() {
    if (!address.trim()) {
      setResult("Enter address");
      return;
    }

    const url =
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}` +
      `&country=US&region=NY&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.features || !data.features.length) {
      setResult("Address not found");
      return;
    }

    const [lng, lat] = data.features[0].geometry.coordinates;
    setPointResult(lat, lng, address);
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "#0f172a", color: "white", borderRadius: 20, padding: 20, marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Tolpa&apos;s Auto Parts</h1>
          <div style={{ marginTop: 6 }}>Delivery Tool</div>
          <div style={{ marginTop: 6, fontSize: 13 }}>Zone 1 = $25 | Outside = Ask for Quote</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Lookup</h2>

            <div style={{ marginBottom: 18 }}>
              <div style={{ marginBottom: 8, fontWeight: 700 }}>ZIP Code</div>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter ZIP"
                maxLength={5}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
              />
              <button onClick={checkZip} style={{ width: "100%", marginTop: 10, padding: 12, borderRadius: 12, border: 0, background: "#0f172a", color: "white", fontWeight: 700 }}>
                Check ZIP
              </button>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 700 }}>Street Address</div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
              />
              <button onClick={checkAddress} style={{ width: "100%", marginTop: 10, padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontWeight: 700 }}>
                Check Address
              </button>
            </div>

            <div style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 16,
              background: result.startsWith("Zone 1") ? "#2563eb" : "#f1f5f9",
              color: result.startsWith("Zone 1") ? "white" : "#0f172a",
              minHeight: 70
            }}>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Delivery Result</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{result || "Enter ZIP or address"}</div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: 12, border: "1px solid #e2e8f0" }}>
            {!mapboxgl.accessToken ? (
              <div style={{ padding: 20 }}>Map token missing in Vercel environment variables.</div>
            ) : (
              <div ref={mapContainerRef} style={{ height: 650, borderRadius: 14, overflow: "hidden" }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
