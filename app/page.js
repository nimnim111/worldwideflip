"use client";

import { useMemo, useState } from "react";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const TOTAL_COUNTRIES = countries.length;

const buildMapPoint = (country) => {
  let hash = 0;
  for (let index = 0; index < country.length; index += 1) {
    hash = (hash * 31 + country.charCodeAt(index)) % 100000;
  }
  const x = 8 + (hash % 84);
  const y = 12 + ((hash * 7) % 70);
  return { x, y };
};

const starterFlips = [
  {
    id: 1,
    country: "United States",
    title: "Brooklyn rooftop kick",
    notes: "Sunset backflip over the skyline."
  },
  {
    id: 2,
    country: "France",
    title: "Paris bridge spin",
    notes: "Landed near the Seine with crowd cheers."
  },
  {
    id: 3,
    country: "Japan",
    title: "Osaka street jam",
    notes: "Perfect rotation with the crew."
  }
];

export default function Home() {
  const [backflips, setBackflips] = useState(starterFlips);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [formState, setFormState] = useState({
    country: "United States",
    title: "",
    notes: ""
  });
  const [countryError, setCountryError] = useState("");

  const normalizeCountry = (value) => value.trim().toLowerCase();

  const findCountryMatch = (value) =>
    countries.find(
      (country) => normalizeCountry(country) === normalizeCountry(value)
    );

  const countriesWithFlips = useMemo(() => {
    const set = new Set(
      backflips.map((flip) => normalizeCountry(flip.country))
    );
    return set;
  }, [backflips]);

  const flipCountries = useMemo(() => {
    const map = new Map();
    backflips.forEach((flip) => {
      const normalized = normalizeCountry(flip.country);
      if (!map.has(normalized)) {
        map.set(normalized, flip.country.trim());
      }
    });
    return Array.from(map.values());
  }, [backflips]);

  const percentCovered = Math.round(
    (countriesWithFlips.size / TOTAL_COUNTRIES) * 100
  );

  const selectedDetails = useMemo(() => {
    const normalized = normalizeCountry(selectedCountry);
    return backflips.filter(
      (flip) => normalizeCountry(flip.country) === normalized
    );
  }, [backflips, selectedCountry]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.country.trim()) {
      return;
    }

    const matchedCountry = findCountryMatch(formState.country);
    if (!matchedCountry) {
      setCountryError("Pick a country from the list to log a flip.");
      return;
    }

    const newFlip = {
      id: Date.now(),
      country: matchedCountry,
      title: formState.title.trim(),
      notes: formState.notes.trim()
    };

    setBackflips((prev) => [newFlip, ...prev]);
    setSelectedCountry(matchedCountry);
    setFormState({
      country: matchedCountry,
      title: "",
      notes: ""
    });
    setCountryError("");
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
            {countriesWithFlips.size} of {TOTAL_COUNTRIES} countries have at
            least one backflip logged.
          </p>
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${percentCovered}%` }} />
          </div>
          <p style={{ marginTop: 12, fontWeight: 700 }}>{percentCovered}%</p>
        </div>

        <div className="card">
          <h2>Add a backflip</h2>
          <p style={{ marginTop: 8, color: "#64748b" }}>
            Type any country in the world. Suggestions appear as you type.
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                list="country-list"
                placeholder="Type a country"
                value={formState.country}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    country: event.target.value
                  }))
                }
                onInput={() => setCountryError("")}
              />
              <datalist id="country-list">
                {countries.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
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
            {countryError ? (
              <p style={{ color: "#b91c1c", fontWeight: 600 }}>
                {countryError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!formState.title.trim() || !formState.country.trim()}
            >
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
          {flipCountries.map((country) => {
            const isActive =
              normalizeCountry(country) === normalizeCountry(selectedCountry);
            const point = buildMapPoint(country);
            return (
              <button
                key={country}
                type="button"
                className={`map-pin${isActive ? " active" : ""}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => setSelectedCountry(country)}
              >
                <span>{country.slice(0, 2).toUpperCase()}</span>
                Flip
              </button>
            );
          })}
        </div>

        <div className="card">
          <h2>
            {selectedCountry}
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
