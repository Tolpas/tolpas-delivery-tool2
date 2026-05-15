import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

const DELIVERY_CHARGE = 25;

const ZONE_1_POLYGON = [
  [-75.8156016,44.2553902],[-75.9227183,44.162859],[-76.0133556,44.0543933],
  [-76.091686,43.9852403],[-76.2578013,43.8962697],[-76.2962535,43.7416938],
  [-76.3264463,43.5358371],[-76.4253,43.5159275],[-76.4994404,43.5059701],
  [-76.574962,43.4820962],[-76.6504671,43.4461918],[-77.036548,43.2776181],
  [-77.0623603,43.0682273],[-77.0678531,42.9216124],[-77.0900948,42.8382312],
  [-76.9129637,42.8630384],[-76.8482363,42.8899162],[-76.7772832,42.891628],
  [-76.6696907,42.871829],[-76.4912184,42.7403592],[-76.418443,42.6344008],
  [-76.38269,42.5615796],[-76.3785461,42.4674455],[-76.2388729,42.3193418],
  [-76.277945,42.1955837],[-76.2930153,42.081309],[-76.1879631,42.012966],
  [-76.1652992,42.0211448],[-76.1467967,42.0256401],[-76.1159309,42.0291334],
  [-76.0753264,42.0431288],[-75.9936379,42.039506],[-75.9194802,42.0313461],
  [-75.7464455,42.0109418],[-75.6489418,42.029306],[-75.6118629,42.0293059],
  [-75.5953835,42.0272658],[-75.5658481,42.0231745],[-75.5171059,42.0252255],
  [-75.4498146,42.0323661],[-75.3303383,42.0537833],[-75.1504372,42.0833474],
  [-75.0515602,42.1353062],[-74.9526832,42.1780637],[-74.909335,42.226227],
  [-74.8455205,42.2937096],[-74.7356572,42.3079296],[-74.6216991,42.3622572],
  [-74.4980779,42.3191003],[-74.4410952,42.422593],[-74.3772283,42.4833833],
  [-74.342896,42.5764883],[-74.2714849,42.6512764],[-74.2426457,42.7491735],
  [-74.1767278,42.8257684],[-74.1245427,42.9394778],[-74.1767278,43.0650183],
  [-74.3195501,43.0860839],[-74.4541326,43.0890927],[-74.5626226,43.0690314],
  [-74.6422734,43.0790629],[-74.7425237,43.1211772],[-74.7796025,43.1492374],
  [-74.8304143,43.1812904],[-74.885346,43.1953083],[-74.937531,43.2163291],
  [-74.9787297,43.2333406],[-74.9457708,43.2953424],[-74.9183049,43.3522884],
  [-74.947144,43.3932165],[-75.0254216,43.3732551],[-75.131165,43.3642702],
  [-75.1723638,43.4111763],[-75.1229253,43.4600396],[-75.0858464,43.5307717],
  [-75.1345981,43.5312678],[-75.1339116,43.5566528],[-75.1558738,43.5641188],
  [-75.1558843,43.5964483],[-75.2540677,43.5556728],[-75.2753606,43.6103705],
  [-75.3247991,43.6670204],[-75.3618779,43.8108892],[-75.2808538,43.9682513],
  [-75.2822271,44.0768748],[-75.2794805,44.0837805],[-75.2684941,44.1488515],
  [-75.2877202,44.2059759],[-75.338532,44.2709123],[-75.3536382,44.3053191],
  [-75.4195562,44.3495269],[-75.4580083,44.3691641],[-75.5431524,44.3347947],
  [-75.631043,44.2925418],[-75.6846013,44.2482911],[-75.7477727,44.2374691],
  [-75.8156016,44.2553902]
];

const ZIP_CODES = {
  "10001":[40.7506,-73.9972],"10002":[40.7170,-73.9870],"10003":[40.7314,-73.9897],
  "10004":[40.6888,-74.0182],"10005":[40.7060,-74.0087],"10006":[40.7086,-74.0134],
  "10007":[40.7135,-74.0086],"10009":[40.7275,-73.9788],"10010":[40.7391,-73.9826],
  "10011":[40.7423,-74.0006],"10012":[40.7259,-73.9980],"10013":[40.7206,-74.0052],
  "10014":[40.7340,-74.0062],"10016":[40.7452,-73.9784],"10017":[40.7523,-73.9725],
  "10018":[40.7547,-73.9925],"10019":[40.7657,-73.9857],"10021":[40.7685,-73.9580],
  "10022":[40.7586,-73.9679],"10023":[40.7760,-73.9822],"10024":[40.7864,-73.9771],
  "10025":[40.7990,-73.9685],"10026":[40.8028,-73.9523],"10027":[40.8116,-73.9547],
  "10028":[40.7769,-73.9548],"10029":[40.7916,-73.9447],"10030":[40.8186,-73.9431],
  "10031":[40.8269,-73.9495],"10032":[40.8400,-73.9416],"10033":[40.8509,-73.9355],
  "10034":[40.8677,-73.9212],"10035":[40.8015,-73.9376],"10128":[40.7812,-73.9504],
  "10301":[40.6318,-74.0952],"10314":[40.6075,-74.1502],
  "10451":[40.8195,-73.9223],"10452":[40.8377,-73.9276],"10453":[40.8526,-73.9122],
  "10457":[40.8467,-73.8985],"10458":[40.8635,-73.8880],"10461":[40.8450,-73.8402],
  "10550":[40.9087,-73.8360],"10601":[41.0330,-73.7629],"10701":[40.9445,-73.8840],
  "10940":[41.4493,-74.4368],"11001":[40.7237,-73.7068],"11550":[40.7062,-73.6197],
  "11701":[40.6815,-73.4140],"11743":[40.8684,-73.4240],"11746":[40.8257,-73.3855],
  "11758":[40.6804,-73.4568],
  "12010":[42.9387,-74.1906],"12020":[43.0831,-73.7850],"12065":[42.8518,-73.7856],
  "12078":[43.0529,-74.3437],"12095":[43.0067,-74.3710],
  "12180":[42.7284,-73.6918],"12203":[42.6781,-73.8856],"12205":[42.7190,-73.8296],
  "12302":[42.8776,-73.9396],"12401":[41.9270,-73.9974],"12550":[41.5034,-74.0104],
  "12601":[41.7004,-73.9209],"12701":[41.6520,-74.6899],"12801":[43.3095,-73.6440],
  "12901":[44.6995,-73.4529],
  "13021":[42.9317,-76.5661],"13027":[43.1764,-76.3027],"13029":[43.2195,-76.1260],
  "13031":[43.0826,-76.3130],"13039":[43.1748,-76.0953],"13041":[43.0510,-76.1494],
  "13045":[42.6012,-76.1805],"13057":[43.1003,-76.0749],"13066":[43.0838,-75.9894],
  "13069":[43.0451,-76.4133],"13088":[43.1828,-76.2388],"13090":[43.1065,-76.2091],
  "13104":[43.4376,-76.4777],"13114":[43.4590,-76.2366],"13120":[42.9784,-76.1413],
  "13126":[43.4553,-76.5119],"13135":[43.1584,-75.9705],"13165":[42.9148,-76.7124],
  "13201":[43.0481,-76.1474],"13202":[43.0481,-76.1474],"13203":[43.0676,-76.1360],
  "13204":[43.0407,-76.1757],"13205":[43.0008,-76.1443],"13206":[43.0748,-76.1065],
  "13207":[43.0104,-76.1645],"13208":[43.0843,-76.1478],"13210":[43.0347,-76.1279],
  "13211":[43.1002,-76.1195],"13212":[43.1284,-76.1383],"13214":[43.0392,-76.0781],
  "13215":[42.9988,-76.2168],"13219":[43.0404,-76.2220],"13224":[43.0417,-76.1035],
  "13309":[43.2537,-75.2552],"13316":[43.0056,-74.7435],"13323":[42.9854,-74.6735],
  "13340":[42.8795,-74.8260],"13350":[43.0987,-75.2488],"13357":[43.1795,-75.7240],
  "13365":[43.3803,-75.4916],"13367":[43.7118,-75.4633],"13368":[43.2501,-75.4565],
  "13402":[43.4484,-75.2252],"13407":[43.0965,-75.3171],"13413":[43.1245,-75.2907],
  "13421":[43.0057,-75.0083],"13424":[42.9380,-74.9859],"13440":[43.2236,-75.4643],
  "13441":[43.2128,-75.4557],"13456":[43.3178,-75.3150],"13476":[43.1026,-75.2307],
  "13478":[43.1184,-75.2910],"13492":[43.1486,-75.3685],
  "13501":[43.1009,-75.2327],"13502":[43.1009,-75.2327],"13503":[43.1009,-75.2327],
  "13504":[43.1009,-75.2327],"13505":[43.1009,-75.2327],
  "13601":[43.9748,-75.9108],"13602":[43.9748,-75.9108],"13619":[44.0059,-75.7860],
  "13662":[44.5892,-75.1738],"13669":[44.6531,-75.4710],"13676":[44.6934,-75.4860],
  "13684":[44.4350,-75.1600],
  "13732":[42.0987,-75.9179],"13760":[42.1156,-75.9707],"13790":[42.1790,-76.0588],
  "13820":[42.6295,-75.1780],"13850":[42.0851,-76.0538],
  "13901":[42.1412,-75.8880],"13903":[42.0987,-75.9179],"13904":[42.0987,-75.9179],
  "13905":[42.0987,-75.9179],
  "14020":[43.0017,-78.1875],"14048":[42.4795,-79.3337],"14094":[43.1706,-78.6903],
  "14201":[42.8965,-78.8894],"14221":[42.9873,-78.7292],"14301":[43.0945,-79.0567],
  "14424":[42.7967,-77.8169],"14450":[43.0906,-77.4419],"14534":[43.0620,-77.5140],
  "14602":[43.1566,-77.6088],"14604":[43.1566,-77.6088],"14606":[43.1683,-77.6931],
  "14609":[43.1774,-77.5537],"14612":[43.2565,-77.6643],"14618":[43.1142,-77.5565],
  "14623":[43.0874,-77.6343],
  "14701":[42.0970,-79.2353],"14850":[42.4439,-76.5019],"14901":[42.0898,-76.8077]
};

// Force specific ZIPs to inside/outside when ZIP-centroid logic is wrong.
// false = always Ask for Quote
// true = always Zone 1
const ZIP_OVERRIDES = {
  "13684": false // Russell NY — outside delivery area
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

function getZipCoordinates(zip) {
  if (ZIP_CODES[zip]) return ZIP_CODES[zip];

  const prefix = zip.slice(0, 3);
  const fallbackZip = Object.keys(ZIP_CODES).find((z) => z.startsWith(prefix));
  if (fallbackZip) return ZIP_CODES[fallbackZip];

  return null;
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
      center: [-75.6, 43.25],
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
          "line-width": 3
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
    setResult(inside ? `Zone 1 — $${DELIVERY_CHARGE.toFixed(2)}` : "Ask for Quote");

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

    if (ZIP_OVERRIDES[clean] === false) {
      setResult("Ask for Quote");
      return;
    }

    if (ZIP_OVERRIDES[clean] === true) {
      setResult(`Zone 1 — $${DELIVERY_CHARGE.toFixed(2)}`);
      const overrideCoords = getZipCoordinates(clean);
      if (overrideCoords) setPointResult(overrideCoords[0], overrideCoords[1]);
      return;
    }

    const coords = getZipCoordinates(clean);

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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src="/logo.jpg"
              alt="Tolpa's Auto Parts"
              style={{ height: 60, maxWidth: 180, objectFit: "contain", background: "white", borderRadius: 10, padding: 6 }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div>
              <h1 style={{ margin: 0 }}>Tolpa&apos;s Auto Parts</h1>
              <div style={{ marginTop: 6 }}>Delivery Tool</div>
              <div style={{ marginTop: 6, fontSize: 13 }}>Zone 1 = $25 | Outside = Ask for Quote</div>
            </div>
          </div>
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
              <button
                onClick={checkZip}
                style={{ width: "100%", marginTop: 10, padding: 12, borderRadius: 12, border: 0, background: "#0f172a", color: "white", fontWeight: 700 }}
              >
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
              <button
                onClick={checkAddress}
                style={{ width: "100%", marginTop: 10, padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontWeight: 700 }}
              >
                Check Address
              </button>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 18,
                borderRadius: 16,
                background: result.startsWith("Zone 1") ? "#2563eb" : "#f1f5f9",
                color: result.startsWith("Zone 1") ? "white" : "#0f172a",
                minHeight: 70
              }}
            >
              <div style={{ fontSize: 13, opacity: 0.9 }}>Delivery Result</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{result || "Enter ZIP or address"}</div>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              ZIP lookup uses NY ZIP coordinates plus overrides for edge-case ZIPs. Address lookup is best for boundary checks.
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
