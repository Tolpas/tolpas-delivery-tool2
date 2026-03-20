import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

const DELIVERY_CHARGE = 25;

const ZONE_1_POLYGON = [
  [-75.8156016, 44.2553902],
  [-75.9227183, 44.162859],
  [-76.0133556, 44.0543933],
  [-76.091686, 43.9852403],
  [-76.2578013, 43.8962697],
  [-76.2962535, 43.7416938],
  [-76.3264463, 43.5358371],
  [-76.4253, 43.5159275],
  [-76.4994404, 43.5059701],
  [-76.574962, 43.4820962],
  [-76.6504671, 43.4461918],
  [-77.036548, 43.2776181],
  [-77.0623603, 43.0682273],
  [-77.0678531, 42.9216124],
  [-77.0900948, 42.8382312],
  [-76.9129637, 42.8630384],
  [-76.8482363, 42.8899162],
  [-76.7772832, 42.891628],
  [-76.6696907, 42.871829],
  [-76.4912184, 42.7403592],
  [-76.418443, 42.6344008],
  [-76.38269, 42.5615796],
  [-76.3785461, 42.4674455],
  [-76.2388729, 42.3193418],
  [-76.277945, 42.1955837],
  [-76.2930153, 42.081309],
  [-76.1879631, 42.012966],
  [-76.1652992, 42.0211448],
  [-76.1467967, 42.0256401],
  [-76.1159309, 42.0291334],
  [-76.0753264, 42.0431288],
  [-75.9936379, 42.039506],
  [-75.9194802, 42.0313461],
  [-75.7464455, 42.0109418],
  [-75.6489418, 42.029306],
  [-75.6118629, 42.0293059],
  [-75.5953835, 42.0272658],
  [-75.5658481, 42.0231745],
  [-75.5171059, 42.0252255],
  [-75.4498146, 42.0323661],
  [-75.3303383, 42.0537833],
  [-75.1504372, 42.0833474],
  [-75.0515602, 42.1353062],
  [-74.9526832, 42.1780637],
  [-74.909335, 42.226227],
  [-74.8455205, 42.2937096],
  [-74.7356572, 42.3079296],
  [-74.6216991, 42.3622572],
  [-74.4980779, 42.3191003],
  [-74.4410952, 42.422593],
  [-74.3772283, 42.4833833],
  [-74.342896, 42.5764883],
  [-74.2714849, 42.6512764],
  [-74.2426457, 42.7491735],
  [-74.1767278, 42.8257684],
  [-74.1245427, 42.9394778],
  [-74.1767278, 43.0650183],
  [-74.3195501, 43.0860839],
  [-74.4541326, 43.0890927],
  [-74.5626226, 43.0690314],
  [-74.6422734, 43.0790629],
  [-74.7425237, 43.1211772],
  [-74.7796025, 43.1492374],
  [-74.8304143, 43.1812904],
  [-74.885346, 43.1953083],
  [-74.937531, 43.2163291],
  [-74.9787297, 43.2333406],
  [-74.9457708, 43.2953424],
  [-74.9183049, 43.3522884],
  [-74.947144, 43.3932165],
  [-75.0254216, 43.3732551],
  [-75.131165, 43.3642702],
  [-75.1723638, 43.4111763],
  [-75.1229253, 43.4600396],
  [-75.0858464, 43.5307717],
  [-75.1345981, 43.5312678],
  [-75.1339116, 43.5566528],
  [-75.1558738, 43.5641188],
  [-75.1558843, 43.5964483],
  [-75.2540677, 43.5556728],
  [-75.2753606, 43.6103705],
  [-75.3247991, 43.6670204],
  [-75.3618779, 43.8108892],
  [-75.2808538, 43.9682513],
  [-75.2822271, 44.0768748],
  [-75.2794805, 44.0837805],
  [-75.2684941, 44.1488515],
  [-75.2877202, 44.2059759],
  [-75.338532, 44.2709123],
  [-75.3536382, 44.3053191],
  [-75.4195562, 44.3495269],
  [-75.4580083, 44.3691641],
  [-75.5431524, 44.3347947],
  [-75.631043, 44.2925418],
  [-75.6846013, 44.2482911],
  [-75.7477727, 44.2374691],
  [-75.8156016, 44.2553902]
];
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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-75.2, 43.1],
      zoom: 6
    });

    mapRef.current.on("load", () => {
      mapRef.current.resize();

      mapRef.current.addSource("zone1", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[...ZONE_1_POLYGON, ZONE_1_POLYGON[0]]]
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function setPointResult(lat, lng) {
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
    setPointResult(coords[0], coords[1]);
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
    setPointResult(lat, lng);
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
              <div
                ref={mapContainerRef}
                style={{
                  height: 650,
                  width: "100%",
                  minHeight: 650,
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#e2e8f0"
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
