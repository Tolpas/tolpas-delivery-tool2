import React, { useEffect, useState } from "react";
import { CircleDollarSign, Home, Map as MapIcon, Printer, Search, Truck } from "lucide-react";

function Card({ className = "", children }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ children }) {
  return <div className="border-b border-slate-100 px-6 py-4">{children}</div>;
}
function CardTitle({ className = "", children }) {
  return <div className={`font-semibold text-slate-900 ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
function Button({ className = "", variant = "default", children, ...props }) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${variantClass} ${className}`}>
      {children}
    </button>
  );
}
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 ${className}`}
    />
  );
}
function Badge({ className = "", variant = "default", children }) {
  const variantClass =
    variant === "secondary"
      ? "bg-slate-100 text-slate-900"
      : variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900"
      : "bg-slate-900 text-white";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClass} ${className}`}>{children}</span>;
}

const MAIN_LOCATION = {
  name: "Tolpa's Auto Parts",
  address: "10729 French Rd, Remsen, NY",
  lat: 43.3229,
  lng: -75.1888,
};

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
  [-76.6862682, 43.3705929],
  [-76.6642955, 43.2746821],
  [-76.6048185, 43.0905258],
  [-76.5828459, 42.9721277],
  [-76.6011241, 42.8975738],
  [-76.3017467, 42.8613459],
  [-76.2578014, 42.6798876],
  [-76.1644176, 42.4816952],
  [-76.0375832, 42.3163186],
  [-75.9675454, 42.2177413],
  [-75.9641822, 42.1468443],
  [-76.0781653, 42.1061033],
  [-76.0753264, 42.0431288],
  [-75.9936379, 42.039506],
  [-75.9194802, 42.0313461],
  [-75.7464455, 42.0109418],
  [-75.6489418, 42.029306],
  [-75.6022499, 42.0599011],
  [-75.5486916, 42.1027096],
  [-75.4786538, 42.1862048],
  [-75.4196022, 42.2441792],
  [-75.3014992, 42.288895],
  [-75.1943825, 42.3315487],
  [-75.0666664, 42.3833036],
  [-74.9897621, 42.4471772],
  [-74.8510137, 42.5228687],
  [-74.7081914, 42.5754771],
  [-74.5708623, 42.6209678],
  [-74.4925847, 42.6492563],
  [-74.4719854, 42.7037765],
  [-74.5131841, 42.7340448],
  [-74.5392766, 42.8378537],
  [-74.3593755, 42.871076],
  [-74.2124334, 42.8952265],
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
  [-75.0872197, 43.5596384],
  [-75.1558843, 43.5964483],
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
  [-75.8123174, 44.2433722],
  [-75.824677, 44.2197563],
  [-75.8156016, 44.2553902]
];

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
  "13901": { city: "Binghamton", lat: 42.0987, lng: -75.9179 },
  "10001": { city: "New York", lat: 40.7506, lng: -73.9972 }
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

const ADDRESS_DATABASE = {
  "100 clinton sq syracuse ny": { lat: 43.0488, lng: -76.1546, label: "Syracuse Sample" },
  "1 broad st utica ny": { lat: 43.1006, lng: -75.2321, label: "Utica Sample" },
  "317 washington st watertown ny": { lat: 43.9744, lng: -75.9105, label: "Watertown Sample" },
  "1 court st binghamton ny": { lat: 42.0981, lng: -75.9180, label: "Binghamton Sample" }
};

const MAP_LABELS = [
  { name: "Watertown", lat: 43.9748, lng: -75.9108 },
  { name: "Syracuse", lat: 43.0481, lng: -76.1474 },
  { name: "Utica", lat: 43.1009, lng: -75.2327 },
  { name: "Rome", lat: 43.2128, lng: -75.4557 },
  { name: "Binghamton", lat: 42.0987, lng: -75.9179 },
  { name: "Albany", lat: 42.6528, lng: -73.7562 }
];

function normalizeZip(value) {
  return String(value || "").replace(/[^0-9]/g, "").slice(0, 5);
}

function normalizeAddress(value) {
  return String(value || "").trim().toLowerCase();
}

function pointInPolygon(point, polygon) {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function checkPoint(lat, lng) {
  const inside = pointInPolygon([lng, lat], ZONE_1_POLYGON);
  return inside
    ? { zone: "Zone 1", charge: DELIVERY_CHARGE }
    : { zone: "Ask for Quote", charge: null };
}

function ResultCard({ result }) {
  if (!result) return <div className="text-sm text-slate-500">Enter ZIP or Address.</div>;
  const zoneStyles = {
    "Zone 1": "bg-blue-600 text-white border-blue-600",
    "Ask for Quote": "bg-slate-100 text-slate-900 border-slate-300",
  };
  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold text-slate-900">{result.label}</div>
      <div className={`rounded-2xl border px-4 py-3 ${zoneStyles[result.zone] || zoneStyles["Ask for Quote"]}`}>
        <div className="text-sm font-medium opacity-90">Delivery Result</div>
        <div className="mt-1 text-2xl font-bold">{result.zone}</div>
        {result.zone !== "Ask for Quote" ? (
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
            <CircleDollarSign className="h-5 w-5" /> ${result.charge.toFixed(2)}
          </div>
        ) : (
          <div className="mt-2 text-sm font-medium">Manual quote required</div>
        )}
      </div>
    </div>
  );
}

function MapPreview({ point, onPrintTerritory }) {
  const width = 760;
  const height = 420;
  const xs = ZONE_1_POLYGON.map((p) => p[0]);
  const ys = ZONE_1_POLYGON.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const project = (lng, lat) => {
    const x = ((lng - minX) / (maxX - minX)) * width;
    const y = height - ((lat - minY) / (maxY - minY)) * height;
    return [x, y];
  };

  const pathFor = (polygon) =>
    polygon
      .map((p, i) => {
        const [x, y] = project(p[0], p[1]);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  const zonePath = pathFor(ZONE_1_POLYGON);
  const dispatch = project(MAIN_LOCATION.lng, MAIN_LOCATION.lat);
  const customer = point ? project(point.lng, point.lat) : null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 font-medium text-slate-800"><MapIcon className="h-4 w-4" /> Sales Territory Map</div>
        <button onClick={onPrintTerritory} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
          <Printer className="h-3.5 w-3.5" /> Print Territory Map
        </button>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-slate-50">
        <path d={zonePath} fill="rgba(59,130,246,.22)" stroke="#2563eb" strokeWidth="2" />
        {MAP_LABELS.map((label) => {
          if (label.lng < minX || label.lng > maxX || label.lat < minY || label.lat > maxY) return null;
          const [lx, ly] = project(label.lng, label.lat);
          return (
            <g key={label.name}>
              <circle cx={lx} cy={ly} r="2.5" fill="#334155" />
              <text x={lx + 6} y={ly - 6} fontSize="11" fill="#334155">{label.name}</text>
            </g>
          );
        })}
        <circle cx={dispatch[0]} cy={dispatch[1]} r="6" fill="black" />
        <text x={dispatch[0] + 10} y={dispatch[1] - 10} fontSize="12" fill="black">Dispatch</text>
        {customer ? (
          <>
            <line x1={dispatch[0]} y1={dispatch[1]} x2={customer[0]} y2={customer[1]} stroke="#64748b" strokeDasharray="6 6" strokeWidth="1.5" />
            <circle cx={customer[0]} cy={customer[1]} r="7" fill="red" />
            <text x={customer[0] + 10} y={customer[1] - 10} fontSize="12" fill="red">Customer</text>
          </>
        ) : null}
        <text x="18" y="24" fontSize="12" fill="#1e3a8a">Blue = Zone 1 ($25)</text>
        <text x="18" y="42" fontSize="12" fill="#334155">Outside = Ask for Quote</text>
      </svg>
    </div>
  );
}

export default function DeliveryZoneCheckerApp() {
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [point, setPoint] = useState(null);

  useEffect(() => {
    if (zip.length === 5) lookupZip(zip);
  }, [zip]);

  function lookupZip(zipValue = zip) {
    const z = normalizeZip(zipValue);
    if (z.length !== 5) {
      setPoint(null);
      setResult({ label: "Enter a valid ZIP", zone: "Ask for Quote", charge: null });
      return;
    }
    let record = ZIP_DATABASE[z];
    if (!record) record = ZIP_PREFIX_FALLBACKS[z.slice(0, 3)] || null;
    if (!record) {
      setPoint(null);
      setResult({ label: `${z}`, zone: "Ask for Quote", charge: null });
      return;
    }
    const quote = checkPoint(record.lat, record.lng);
    setPoint(record);
    setResult({ label: `${z} • ${record.city}`, zone: quote.zone, charge: quote.charge });
  }

  function lookupAddress() {
    const key = normalizeAddress(address);
    const record = ADDRESS_DATABASE[key];
    if (!record) {
      setPoint(null);
      setResult({ label: "Address not found (prototype)", zone: "Ask for Quote", charge: null });
      return;
    }
    const quote = checkPoint(record.lat, record.lng);
    setPoint(record);
    setResult({ label: record.label, zone: quote.zone, charge: quote.charge });
  }

  function clearSearch() {
    setZip("");
    setAddress("");
    setPoint(null);
    setResult(null);
  }

  function openPrintWindow(title, bodyHtml) {
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) return;
    win.document.open();
    win.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}.card{max-width:760px;border:1px solid #cbd5e1;border-radius:16px;padding:18px;margin:0 auto}.brand{font-weight:700;font-size:24px;margin-bottom:4px}.sub{color:#475569;font-size:13px;margin-bottom:14px}.row{display:flex;align-items:center;gap:10px;margin:8px 0}.sw{width:16px;height:16px;border:1px solid #999;border-radius:3px}.b{background:#60a5fa}.w{background:#fff}.muted{color:#475569;font-size:12px}.box{height:360px;border:1px dashed #94a3b8;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-top:16px;color:#475569;text-align:center;padding:20px}</style></head><body>${bodyHtml}</body></html>`);
    win.document.close();
    win.focus();
    win.onload = () => win.print();
  }

  function printQuickReference() {
    openPrintWindow(
      "Sales Territory Quick Reference",
      `<div class='card'><div class='brand'>Tolpa's Auto Parts</div><div class='sub'>Sales Territory Quick Reference</div><div class='row'><div class='sw b'></div><div>Zone 1 — $25 Delivery</div></div><div class='row'><div class='sw w'></div><div>Outside Area — Ask for Quote</div></div><div class='muted' style='margin-top:14px;'>Main dispatch: 10729 French Rd, Remsen, NY</div></div>`
    );
  }

  function printTerritoryMap() {
    openPrintWindow(
      "Printable Territory Map",
      `<div class='card'><div class='brand'>Tolpa's Auto Parts</div><div class='sub'>Printable Territory Map</div><div class='row'><div class='sw b'></div><div>Zone 1 — $25 Delivery</div></div><div class='row'><div class='sw w'></div><div>Outside Area — Ask for Quote</div></div><div class='muted' style='margin-top:14px;'>Main dispatch: 10729 French Rd, Remsen, NY</div><div class='box'>Static reference map for sales and dispatch staff.</div></div>`
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white px-4 py-3 text-slate-900 shadow-sm">
                <div className="text-xl font-bold leading-none">Tolpa's</div>
                <div className="mt-1 text-sm font-semibold leading-none">Auto Parts</div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight">Tolpa&apos;s Auto Parts</div>
                <div className="mt-1 text-sm text-slate-200">Delivery Quoting Tool</div>
                <div className="mt-1 text-xs text-slate-300">Main dispatch: 10729 French Rd, Remsen, NY</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full px-3 py-1">Zone 1 = $25</Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">Outside = Ask for Quote</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Truck className="h-5 w-5" /> Sales Lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">Single-zone version. Inside Zone 1 = $25 delivery. Outside = Ask for Quote.</div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">ZIP Code</label>
                <Input value={zip} onChange={(e) => setZip(normalizeZip(e.target.value))} placeholder="Enter 5-digit ZIP" className="h-11" maxLength={5} />
              </div>
              <Button onClick={() => lookupZip()} className="h-11 w-full"><Search className="mr-2 h-4 w-4" /> Check ZIP</Button>
              <div className="space-y-2 border-t pt-4">
                <label className="text-sm font-medium text-slate-700">Optional Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Example: 100 Clinton Sq Syracuse NY" className="h-11" />
                <Button variant="outline" onClick={lookupAddress} className="h-11 w-full"><Home className="mr-2 h-4 w-4" /> Check Address</Button>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 flex justify-end"><button onClick={clearSearch} className="text-xs text-slate-500 hover:text-slate-800">Clear Search</button></div>
                <ResultCard result={result} />
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-600">
                <div className="mb-2 font-semibold text-slate-900">Sample ZIPs</div>
                <div className="flex flex-wrap gap-2">
                  {["13501","13502","13309","13202","13901","13601"].map((sampleZip) => (
                    <button key={sampleZip} onClick={() => { setZip(sampleZip); lookupZip(sampleZip); }} className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-100">
                      {sampleZip}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-700">
                <div className="mb-2 font-semibold">Sales Territory Quick Reference</div>
                <div className="mb-3 text-xs">Tolpa&apos;s Auto Parts Delivery Zone</div>
                <div className="mb-1 flex items-center gap-2 text-xs"><div className="h-4 w-4 border bg-blue-400"></div>Zone 1 — $25 Delivery</div>
                <div className="mb-3 flex items-center gap-2 text-xs"><div className="h-4 w-4 border bg-white"></div>Outside Area — Ask for Quote</div>
                <button onClick={printQuickReference} className="mt-2 rounded border px-3 py-1 text-xs">Print Handout</button>
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2"><MapPreview point={point} onPrintTerritory={printTerritoryMap} /></div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Single-zone version. Zone 1 is $25. Outside remains Ask for Quote. Static printable reference map is for sales and dispatch staff.
        </div>
      </div>
    </div>
  );
}
