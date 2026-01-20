import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Globe, Search, LogOut, ShieldCheck, X } from "lucide-react";
import { feature } from "topojson-client";
import { supabase } from "./lib/supabase";
/* =====================
 * FIREBASE (AUTH + FIRESTORE)
 * ===================== */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* =====================
 * FIREBASE CONFIG
 * ===================== */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* =====================
 * CONFIG
 * ===================== */
const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";
const ADMIN_EMAILS = ["ardenwoodso2017@gmail.com"];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

/* =====================
 * HELPERS
 * ===================== */
function extractCountriesFromTopo(topo) {
  try {
    const geojson = feature(topo, topo.objects.countries);
    return geojson.features.map((f) => ({
      code: String(f.id),
                                        name: f.properties?.name || "Unknown",
    }));
  } catch {
    return [];
  }
}

/* =====================
 * MAIN
 * ===================== */
export default function BackflipTracker() {
  const [topo, setTopo] = useState(null);
  const [countries, setCountries] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);
  const [showAdmin, setShowAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* =====================
   * AUTH
   * ===================== */
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        setShowAdmin(false);
        return;
      }
      setUser({
        uid: u.uid,
        name: u.displayName || "",
        email: u.email || "",
        picture: u.photoURL || "",
      });
      setShowAdmin(ADMIN_EMAILS.includes(u.email));
    });
  }, []);

  const login = () => signInWithPopup(auth, provider).catch(() => {});
  const logout = () => signOut(auth);

  /* =====================
   * MAP + DATA
   * ===================== */
  useEffect(() => {
    (async () => {
      const res = await fetch(GEO_URL);
      const data = await res.json();
      setTopo(data);
      setCountries(extractCountriesFromTopo(data));
      setLoading(false);
    })();
  }, []);

  const loadSubmissions = async () => {
    const snap = await getDocs(collection(db, "backflips"));
    const map = {};
    snap.forEach((d) => (map[d.id] = d.data()));
    setSubmissions(map);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  /* =====================
   * STATS
   * ===================== */
  const approvedCount = useMemo(
    () => Object.values(submissions).filter((s) => s.status === "approved").length,
                                [submissions]
  );

  const totalCount = countries.length || 1;
  const completionPercent = Math.round((approvedCount / totalCount) * 100);

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [search, countries]);

  /* =====================
   * COUNTRY CLICK
   * ===================== */
  const openCountry = (code, name) => {
    setSelectedCountry({ code, name });
    setVideoFile(null);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
    setVideoFile(null);
    setError("");
  };

  /* =====================
   * FILE VALIDATION
   * ===================== */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/"))
      return setError("Only video files allowed");

    if (file.size > MAX_VIDEO_SIZE)
      return setError("Max file size is 50MB");

    setVideoFile(file);
    setError("");
  };

  /* =====================
   * SUBMIT (DIRECT TO BLOB)
   * ===================== */
const submitForApproval = async () => {
  if (!user) return setError("Please sign in");
  if (!videoFile) return setError("Select a video");
  if (!selectedCountry) return setError("Select a country");

  setUploading(true);
  setError("");

  try {
    const path = `${selectedCountry.code}/${Date.now()}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from("backflips")
      .upload(path, videoFile, {
        contentType: videoFile.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("backflips")
      .getPublicUrl(path);

    await fetch("/api/submit-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        uploader: user.name,
        email: user.email,
        videoUrl: data.publicUrl,
      }),
    });

    closeModal();
  } catch (err) {
    console.error(err);
    setError(err.message || "Upload failed");
  } finally {
    setUploading(false);
  }
};

  /* =====================
   * ADMIN ACTIONS
   * ===================== */
  const approve = async (code) => {
    await updateDoc(doc(db, "backflips", code), { status: "approved" });
    setSubmissions((p) => ({
      ...p,
      [code]: { ...p[code], status: "approved" },
    }));
  };

  const reject = async (code) => {
    await deleteDoc(doc(db, "backflips", code));
    setSubmissions((p) => {
      const n = { ...p };
      delete n[code];
      return n;
    });
  };

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-blue-200 p-6">
    {/* HEADER */}
    <div className="flex justify-between bg-white/80 rounded-2xl p-4 mb-4">
    <div className="flex gap-2 items-center">
    <Globe /> <b>Global Backflip Tracker</b>
    </div>
    <div className="flex gap-2 items-center">
    {!user && <button onClick={login}>Sign in</button>}
    {user && (
      <>
      {isAdmin && (
        <button
        onClick={() => setShowAdmin((v) => !v)}
        className="px-3 py-1 rounded-xl bg-emerald-600 text-white flex gap-1"
        >
        <ShieldCheck className="w-4 h-4" /> Admin
        </button>
      )}
      <button onClick={logout}><LogOut /></button>
      </>
    )}
    </div>
    </div>

    {/* SEARCH */}
    <div className="bg-white rounded-xl p-3 mb-4 flex gap-2">
    <Search />
    <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search country"
    className="flex-1"
    />
    </div>

    {/* STATS */}
    <div className="grid grid-cols-3 gap-4 mb-4">
    <Stat label="Approved" value={approvedCount} />
    <Stat label="Total Countries" value={totalCount} />
    <Stat label="Completion" value={`${completionPercent}%`} />
    </div>

    {/* MAP */}
    <div className="bg-white rounded-2xl p-4">
    <ComposableMap projectionConfig={{ scale: 155 }}>
    <Geographies geography={topo}>
    {({ geographies }) =>
    geographies.map((geo) => {
      const code = String(geo.id);
      const entry = submissions[code];
      let fill = "#c7d2fe";
      if (entry?.status === "approved") fill = "#34d399";
      if (entry?.status === "pending") fill = "#facc15";
      return (
        <Geography
        key={geo.rsmKey}
        geography={geo}
        fill={fill}
        onClick={() =>
          openCountry(code, geo.properties?.name || "")
        }
        />
      );
    })
    }
    </Geographies>
    </ComposableMap>
    </div>

    {/* MODAL */}
    {showModal && selectedCountry && (
      <Modal title={selectedCountry.name} onClose={closeModal}>
      {error && <p className="text-red-600">{error}</p>}
      {!submissions[selectedCountry.code] && (
        <>
        <input type="file" accept="video/*" onChange={handleFile} />
        <button
        disabled={uploading}
        onClick={submitForApproval}
        className="w-full bg-indigo-600 text-white rounded-xl p-3 mt-2"
        >
        {uploading ? "Uploading…" : "Submit"}
        </button>
        </>
      )}
      </Modal>
    )}

    {/* ADMIN PANEL */}
    {showAdmin && isAdmin && (
      <Modal title="Admin Panel" onClose={() => setShowAdmin(false)}>
      {Object.entries(submissions)
        .filter(([, s]) => s.status === "pending")
        .map(([code, s]) => (
          <div key={code} className="border rounded-xl p-3 mb-3">
          <b>{s.country}</b>
          <video src={s.videoUrl} controls className="w-full my-2" />
          <div className="flex gap-2">
          <AdminBtn ok onClick={() => approve(code)}>Approve</AdminBtn>
          <AdminBtn onClick={() => reject(code)}>✕ Reject</AdminBtn>
          </div>
          </div>
        ))}
        </Modal>
    )}
    </div>
  );
}

/* =====================
 * UI HELPERS
 * ===================== */
const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl p-4">
  <div className="text-xs text-gray-500">{label}</div>
  <div className="text-2xl font-bold">{value}</div>
  </div>
);

const AdminBtn = ({ ok, children, ...p }) => (
  <button
  {...p}
  className={`flex-1 py-2 rounded-xl font-semibold ${
    ok ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
  }`}
  >
  {children}
  </button>
);

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-4 max-w-lg w-full">
    <div className="flex justify-between mb-2">
    <b>{title}</b>
    <button onClick={onClose}><X /></button>
    </div>
    {children}
    </div>
    </div>
  );
}
