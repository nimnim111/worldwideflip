"use client";

import { useMemo, useState } from "react";

const countries = [
  { code: "US", name: "United States", x: 24, y: 33 },
  { code: "CA", name: "Canada", x: 20, y: 20 },
  { code: "BR", name: "Brazil", x: 34, y: 62 },
  { code: "GB", name: "United Kingdom", x: 48, y: 26 },
  { code: "FR", name: "France", x: 50, y: 32 },
  { code: "NG", name: "Nigeria", x: 56, y: 52 },
  { code: "ZA", name: "South Africa", x: 56, y: 78 },
  { code: "IN", name: "India", x: 68, y: 48 },
  { code: "JP", name: "Japan", x: 82, y: 36 },
  { code: "AU", name: "Australia", x: 82, y: 76 }
];

const starterFlips = [
  {
    id: 1,
    country: "US",
    title: "Brooklyn rooftop kick",
    notes: "Sunset backflip over the skyline."
  },
  {
    id: 2,
    country: "FR",
    title: "Paris bridge spin",
    notes: "Landed near the Seine with crowd cheers."
  },
  {
    id: 3,
    country: "JP",
    title: "Osaka street jam",
    notes: "Perfect rotation with the crew."
  }
];

export default function Home() {
  const [backflips, setBackflips] = useState(starterFlips);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [formState, setFormState] = useState({
    country: "US",
    title: "",
    notes: ""
  });

  const countriesWithFlips = useMemo(() => {
    const set = new Set(backflips.map((flip) => flip.country));
    return set;
  }, [backflips]);

  const percentCovered = Math.round(
    (countriesWithFlips.size / countries.length) * 100
  );

  const selectedDetails = useMemo(() => {
    return backflips.filter((flip) => flip.country === selectedCountry);
  }, [backflips, selectedCountry]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.title.trim()) {
      return;
    }

    const newFlip = {
      id: Date.now(),
      country: formState.country,
      title: formState.title.trim(),
      notes: formState.notes.trim()
    };

    setBackflips((prev) => [newFlip, ...prev]);
    setSelectedCountry(formState.country);
    setFormState({
      country: formState.country,
      title: "",
      notes: ""
    });
  };

  return (
    <main>
      <header>
        <span className="badge">🌍 Worldwide Flip Tracker</span>
        <h1>Track every backflip across the planet.</h1>
        <p>
          Log your biggest flips by country, explore the map, and see how close
          you are to filling the world with backflips.
        </p>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Global coverage</h2>
          <p>
            {countriesWithFlips.size} of {countries.length} countries have at
            least one backflip logged.
          </p>
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${percentCovered}%` }} />
          </div>
          <p style={{ marginTop: 12, fontWeight: 700 }}>{percentCovered}%</p>
        </div>

        <div className="card">
          <h2>Add a backflip</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={formState.country}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    country: event.target.value
                  }))
                }
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="title">Backflip name</label>
              <input
                id="title"
                placeholder="Neon night flip"
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    title: event.target.value
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Where did it happen?"
                value={formState.notes}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    notes: event.target.value
                  }))
                }
              />
            </div>
            <button type="submit" disabled={!formState.title.trim()}>
              Log backflip
            </button>
          </form>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 32 }}>
        <div className="card map-shell">
          <svg
            className="map-svg"
            viewBox="0 0 1000 500"
            role="img"
            aria-label="Stylized world map"
          >
            <path
              d="M120 120 C80 140 60 180 60 220 C60 280 140 310 210 280 C250 270 290 270 320 310 C350 350 420 360 470 330 C520 300 520 240 500 210 C460 150 430 130 380 120 C310 100 240 90 120 120Z"
              fill="#1f2937"
              opacity="0.55"
            />
            <path
              d="M430 120 C420 150 430 200 450 230 C470 260 520 280 560 280 C600 280 640 260 660 230 C690 180 680 140 650 120 C620 100 580 90 540 100 C500 110 450 90 430 120Z"
              fill="#1f2937"
              opacity="0.55"
            />
            <path
              d="M560 300 C520 320 510 360 520 390 C540 440 600 460 660 450 C700 440 730 410 730 370 C730 330 700 300 660 290 C630 280 590 285 560 300Z"
              fill="#1f2937"
              opacity="0.55"
            />
            <path
              d="M700 140 C690 170 710 200 740 220 C770 240 820 250 860 230 C900 210 910 170 890 140 C870 110 820 100 780 110 C740 120 710 110 700 140Z"
              fill="#1f2937"
              opacity="0.55"
            />
            <path
              d="M740 320 C720 340 720 380 740 410 C770 450 840 470 900 450 C940 440 960 410 950 380 C940 350 900 330 850 320 C810 310 760 300 740 320Z"
              fill="#1f2937"
              opacity="0.55"
            />
          </svg>
          {countries.map((country) => {
            const isActive = country.code === selectedCountry;
            const hasFlip = countriesWithFlips.has(country.code);
            return (
              <button
                key={country.code}
                type="button"
                className={`map-pin${isActive ? " active" : ""}`}
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                onClick={() => setSelectedCountry(country.code)}
              >
                <span>{country.code}</span>
                {hasFlip ? "Flip" : "New"}
              </button>
            );
          })}
        </div>

        <div className="card">
          <h2>
            {countries.find((country) => country.code === selectedCountry)?.name}
          </h2>
          {selectedDetails.length ? (
            <div className="backflip-list">
              {selectedDetails.map((flip) => (
                <div key={flip.id} className="backflip-item">
                  <h4>{flip.title}</h4>
                  <p>{flip.notes || "No notes yet."}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 12, color: "#64748b" }}>
              No backflips logged here yet. Add the first one!
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
