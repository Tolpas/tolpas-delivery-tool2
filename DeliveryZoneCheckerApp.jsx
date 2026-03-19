import React, { useState } from "react";

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

const ZIP_DATABASE = {
  "12010": { city: "Amsterdam", lat: 42.9387, lng: -74.1906 },
  "12203": { city: "Albany", lat: 42.6781, lng: -73.8856 },
  "13090": { city: "Liverpool", lat: 43.1065, lng: -76.2091 },
  "13202": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13309": { city: "Boonville", lat: 43.4837, lng: -75.3307 },
  "13316": { city: "Camden", lat: 43.3406, lng: -75.7474 },
  "13440": { city: "Rome", lat: 43.2128, lng: -75.4557 },
  "13501": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13502": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13503": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13504": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13505": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13601": { city: "Watertown", lat: 43.9748, lng: -75.9108 },
  "13901": { city: "Binghamton", lat: 42.0987, lng: -75.9179 }
};

const ZIP_PREFIX_FALLBACKS = {
  "120": { city: "Amsterdam Area", lat: 42.9387, lng: -74.1906 },
  "122": { city: "Albany Area", lat: 42.6781, lng: -73.8856 },
  "130": { city: "Central New York Area", lat: 43.1065, lng: -76.2091 },
  "132": { city: "Syracuse Area", lat: 43.0481, lng: -76.1474 },
  "133": { city: "North Country Area", lat: 43.3406, lng: -75.7474 },
  "134": { city: "Rome / Mohawk Valley Area", lat: 43.2128, lng: -75.4557 },
  "135": { city: "Utica Area", lat: 43.1009, lng: -75.2327 },
  "136": { city: "Watertown Area", lat: 43.9748, lng: -75.9108 },
  "139": { city: "Binghamton Area", lat: 42.0987, lng: -75.9179 }
};

export default function DeliveryZoneCheckerApp() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState("");

  function lookupZip() {
    const cleanZip = String(zip || "").replace(/[^0-9]/g, "").slice(0, 5);

    if (cleanZip.length !== 5) {
      setResult("Enter valid ZIP");
      return;
    }

    let record = ZIP_DATABASE[cleanZip];
    if (!record) record = ZIP_PREFIX_FALLBACKS[cleanZip.slice(0, 3)] || null;

    if (!record) {
      setResult("Ask for Quote");
      return;
    }

    const inside = pointInPolygon([record.lng, record.lat], ZONE_1_POLYGON);
    setResult(inside ? `Zone 1 - $${DELIVERY_CHARGE}` : "Ask for Quote");
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Tolpa's Delivery Tool</h1>
      <div style={{ marginBottom: 12 }}>Zone 1 = $25 | Outside = Ask for Quote</div>

      <input
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter ZIP"
        maxLength={5}
        style={{ padding: 10, fontSize: 16 }}
      />
      <button onClick={lookupZip} style={{ marginLeft: 10, padding: 10 }}>
        Check
      </button>

      <h2 style={{ marginTop: 20 }}>{result}</h2>
    </div>
  );
}
