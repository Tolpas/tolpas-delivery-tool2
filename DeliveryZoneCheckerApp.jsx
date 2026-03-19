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
  "12078": { city: "Gloversville", lat: 43.0529, lng: -74.3437 },
  "12095": { city: "Johnstown", lat: 43.0067, lng: -74.3710 },
  "12203": { city: "Albany", lat: 42.6781, lng: -73.8856 },
  "12205": { city: "Albany", lat: 42.7190, lng: -73.8296 },

  "13021": { city: "Auburn", lat: 42.9317, lng: -76.5661 },
  "13027": { city: "Baldwinsville", lat: 43.1587, lng: -76.3327 },
  "13039": { city: "Cicero", lat: 43.1756, lng: -76.1194 },
  "13057": { city: "East Syracuse", lat: 43.0653, lng: -76.0785 },
  "13088": { city: "Liverpool", lat: 43.1028, lng: -76.1868 },
  "13090": { city: "Liverpool", lat: 43.1065, lng: -76.2091 },
  "13120": { city: "Nedrow", lat: 42.9784, lng: -76.1413 },
  "13126": { city: "Oswego", lat: 43.4553, lng: -76.5105 },

  "13201": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13202": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13203": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13204": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13205": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13206": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13207": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13208": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13210": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13211": { city: "Syracuse", lat: 43.0481, lng: -76.1474 },
  "13212": { city: "North Syracuse", lat: 43.1348, lng: -76.1291 },
  "13214": { city: "Syracuse", lat: 43.0395, lng: -76.0719 },
  "13215": { city: "Syracuse", lat: 42.9972, lng: -76.2210 },
  "13219": { city: "Syracuse", lat: 43.0404, lng: -76.2220 },
  "13224": { city: "Syracuse", lat: 43.0417, lng: -76.1035 },

  "13309": { city: "Boonville", lat: 43.4837, lng: -75.3307 },
  "13316": { city: "Camden", lat: 43.3406, lng: -75.7474 },

  "13413": { city: "New Hartford", lat: 43.0731, lng: -75.2857 },
  "13440": { city: "Rome", lat: 43.2128, lng: -75.4557 },
  "13441": { city: "Rome", lat: 43.2128, lng: -75.4557 },
  "13492": { city: "Whitesboro", lat: 43.1231, lng: -75.2963 },

  "13501": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13502": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13503": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13504": { city: "Utica", lat: 43.1009, lng: -75.2327 },
  "13505": { city: "Utica", lat: 43.1009, lng: -75.2327 },

  "13601": { city: "Watertown", lat: 43.9748, lng: -75.9108 },
  "13602": { city: "Watertown", lat: 43.9748, lng: -75.9108 },

  "13760": { city: "Endicott", lat: 42.0984, lng: -76.0494 },
  "13850": { city: "Vestal", lat: 42.0851, lng: -76.0538 },

  "13901": { city: "Binghamton", lat: 42.0987, lng: -75.9179 },
  "13903": { city: "Binghamton", lat: 42.0987, lng: -75.9179 },
  "13904": { city: "Binghamton", lat: 42.0987, lng: -75.9179 },
  "13905": { city: "Binghamton", lat: 42.0987, lng: -75.9179 }
};

const ZIP_PREFIX_FALLBACKS = {
  "120": { city: "Amsterdam Area", lat: 42.9387, lng: -74.1906 },
  "122": { city: "Albany Area", lat: 42.6781, lng: -73.8856 },
  "130": { city: "Central New York Area", lat: 43.1065, lng: -76.2091 },
  "131": { city: "Oswego Area", lat: 43.4553, lng: -76.5105 },
  "132": { city: "Syracuse Area", lat: 43.0481, lng: -76.1474 },
  "133": { city: "North Country Area", lat: 43.3406, lng: -75.7474 },
  "134": { city: "Rome / Mohawk Valley Area", lat: 43.2128, lng: -75.4557 },
  "135": { city: "Utica Area", lat: 43.1009, lng: -75.2327 },
  "136": { city: "Watertown Area", lat: 43.9748, lng: -75.9108 },
  "137": { city: "Southern Tier Area", lat: 42.0984, lng: -76.0494 },
  "138": { city: "Vestal Area", lat: 42.0851, lng: -76.0538 },
  "139": { city: "Binghamton Area", lat: 42.0987, lng: -75.9179 }
};

const ADDRESS_DATABASE = {
  "100 clinton sq syracuse ny": { lat: 43.0488, lng: -76.1546, label: "Syracuse Sample" },
  "1 broad st utica ny": { lat: 43.1006, lng: -75.2321, label: "Utica Sample" },
  "317 washington st watertown ny": { lat: 43.9744, lng: -75.9105, label: "Watertown Sample" },
  "1 court st binghamton ny": { lat: 42.0981, lng: -75.9180, label: "Binghamton Sample" }
};

function checkPoint(lat, lng) {
  const inside = pointInPolygon([lng, lat], ZONE_1_POLYGON);
  return inside
    ? { zone: "Zone 1", charge: DELIVERY_CHARGE }
    : { zone: "Ask for Quote", charge: null };
}

export default function DeliveryZoneCheckerApp() {
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);

  function lookupZip() {
    const cleanZip = String(zip || "").replace(/[^0-9]/g, "").slice(0, 5);

    if (cleanZip.length !== 5) {
      setResult({ label: "Enter a valid ZIP", zone: "Ask for Quote", charge: null });
      return;
    }

    let record = ZIP_DATABASE[cleanZip];
    if (!record) record = ZIP_PREFIX_FALLBACKS[cleanZip.slice(0, 3)] || null;

    if (!record) {
      setResult({ label: `${cleanZip}`, zone: "Ask for Quote", charge: null });
      return;
    }

    const quote = checkPoint(record.lat, record.lng);
    setResult({
      label: `${cleanZip} • ${record.city}`,
      zone: quote.zone,
      charge: quote.charge
    });
  }

  function lookupAddress() {
    const key = String(address || "").trim().toLowerCase();
    const record = ADDRESS_DATABASE[key];

    if (!record) {
      setResult({ label: "Address not found", zone: "Ask for Quote", charge: null });
      return;
    }

    const quote = checkPoint(record.lat, record.lng);
    setResult({
      label: record.label,
      zone: quote.zone,
      charge: quote.charge
    });
  }

  function clearAll() {
    setZip("");
    setAddress("");
    setResult(null);
  }

  const resultBoxStyle =
    result?.zone === "Zone 1"
      ? { background: "#2563eb", color: "white", border: "1px solid #2563eb" }
      : { background: "#f8fafc", color: "#0f172a", border: "1px solid #cbd5e1" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "#0f172a", color: "white", borderRadius: 24, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ background: "white", color: "#0f172a", borderRadius: 14, padding: "14px 18px", fontWeight: 700 }}>
                <div style={{ fontSize: 22, lineHeight: 1 }}>Tolpa's</div>
                <div style={{ fontSize: 14, lineHeight: 1.2 }}>Auto Parts</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>Tolpa&apos;s Auto Parts</div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>Delivery Quoting Tool</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Main dispatch: 10729 French Rd, Remsen, NY</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: "#2563eb", color: "white", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontWeight: 700 }}>
                Zone 1 = $25
              </div>
              <div style={{ background: "white", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontWeight: 700 }}>
                Outside = Ask for Quote
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "white", borderRadius: 24, padding: 24, border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Sales Lookup</h2>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 12, fontSize: 12, color: "#475569", marginBottom: 16 }}>
              NY ZIP coverage only. Street address lookup is optional and currently uses sample addresses.
            </div>

            <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>ZIP Code</label>
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Enter 5-digit ZIP"
              maxLength={5}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 12 }}
            />
            <button onClick={lookupZip} style={{ width: "100%", padding: 12, borderRadius: 14, border: "none", background: "#0f172a", color: "white", fontWeight: 700 }}>
              Check ZIP
            </button>

            <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 20, paddingTop: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Optional Street Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Example: 100 Clinton Sq Syracuse NY"
                style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 12 }}
              />
              <button onClick={lookupAddress} style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontWeight: 700 }}>
                Check Address
              </button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 16, marginTop: 20 }}>
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <button onClick={clearAll} style={{ fontSize: 12, border: "none", background: "transparent", color: "#64748b", cursor: "pointer" }}>
                  Clear Search
                </button>
              </div>

              {!result ? (
                <div style={{ color: "#64748b", fontSize: 14 }}>Enter ZIP or Address.</div>
              ) : (
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{result.label}</div>
                  <div style={{ borderRadius: 16, padding: 16, ...resultBoxStyle }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>Delivery Result</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{result.zone}</div>
                    {result.zone !== "Ask for Quote" ? (
                      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10 }}>${result.charge.toFixed(2)}</div>
                    ) : (
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>Manual quote required</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, border: "1px dashed #cbd5e1", borderRadius: 16, padding: 16, fontSize: 12, color: "#475569" }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>Sample NY ZIPs</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["13501", "13502", "13202", "13601", "13901", "13309", "12010", "12203"].map((sampleZip) => (
                  <button
                    key={sampleZip}
                    onClick={() => {
                      setZip(sampleZip);
                      setTimeout(() => {
                        const cleanZip = sampleZip;
                        let record = ZIP_DATABASE[cleanZip];
                        if (!record) record = ZIP_PREFIX_FALLBACKS[cleanZip.slice(0, 3)] || null;
                        if (!record) {
                          setResult({ label: `${cleanZip}`, zone: "Ask for Quote", charge: null });
                          return;
                        }
                        const quote = checkPoint(record.lat, record.lng);
                        setResult({
                          label: `${cleanZip} • ${record.city}`,
                          zone: quote.zone,
                          charge: quote.charge
                        });
                      }, 0);
                    }}
                    style={{ borderRadius: 999, border: "1px solid #cbd5e1", background: "white", padding: "6px 10px", cursor: "pointer" }}
                  >
                    {sampleZip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 24, padding: 24, border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Territory Reference</h2>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 16 }}>
              <div style={{ marginBottom: 10, fontWeight: 700 }}>Zone 1 — $25 Delivery</div>
              <div style={{ marginBottom: 8, fontSize: 14 }}>Outside Area — Ask for Quote</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Use the separate printable road-map PDF as the static map reference for sales and dispatch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
