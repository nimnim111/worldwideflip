"use client";

import { useMemo, useState } from "react";

const countryData = `
India India \t1,417,492,000 \t17.2% \t1 Jul 2025 \tOfficial projection
China China \t1,408,280,000 \t17.1% \t31 Dec 2024 \tOfficial estimate
United States United States \t340,110,988 \t4.1% \t1 Jul 2024 \tOfficial estimate
Indonesia Indonesia \t284,438,782 \t3.5% \t30 Jun 2025 \tNational annual projection
Pakistan Pakistan \t241,499,431 \t2.9% \t1 Mar 2023 \t2023 census result
Nigeria Nigeria \t223,800,000 \t2.7% \t1 Jul 2023 \tOfficial projection
Brazil Brazil \t213,421,037 \t2.6% \t1 Jul 2025 \tOfficial estimate
Bangladesh Bangladesh \t169,828,911 \t2.1% \t14 Jun 2022 \t2022 census result
Russia Russia \t146,028,325 \t1.8% \t1 Jan 2025 \tOfficial estimate
Mexico Mexico \t130,760,049 \t1.6% \t30 Sep 2025 \tNational quarterly estimate
Japan Japan \t123,160,000 \t1.5% \t1 Dec 2025 \tMonthly national estimate
Philippines Philippines \t114,123,600 \t1.4% \t1 Jul 2025 \tOfficial projection
Democratic Republic of the Congo Democratic Republic of the Congo \t112,832,000 \t1.4% \t1 Jul 2025 \tUN projection
Ethiopia Ethiopia \t111,652,998 \t1.4% \t1 Jul 2025 \tNational annual projection
Egypt Egypt \t107,271,260 \t1.3% \t1 Jan 2025 \tOfficial estimate
Vietnam Vietnam \t102,300,000 \t1.2% \t31 Dec 2025 \tOfficial estimate
Iran Iran \t85,961,000 \t1.0% \t20 Mar 2024 \tOfficial estimate
Turkey Turkey \t85,664,944 \t1.0% \t31 Dec 2024 \tOfficial estimate
Germany Germany \t83,497,147 \t1.0% \t30 Sep 2025 \tNational quarterly estimate
United Kingdom United Kingdom \t69,487,000 \t0.8% \t30 Jun 2025 \tOfficial estimate
France France \t68,736,000 \t0.8% \t1 Nov 2025 \tMonthly national estimate
Tanzania Tanzania \t68,153,004 \t0.8% \t1 Jul 2025 \tOfficial projection
Thailand Thailand \t65,826,149 \t0.8% \t30 Nov 2025 \tMonthly national estimate
South Africa South Africa \t63,100,945 \t0.8% \t30 Jun 2025 \tOfficial estimate
Italy Italy \t58,947,569 \t0.7% \t30 Sep 2025 \tMonthly national estimate
Kenya Kenya \t53,330,978 \t0.6% \t1 Jul 2025 \tOfficial projection
Colombia Colombia \t53,057,212 \t0.6% \t1 Jan 2025 \tOfficial projection
Sudan Sudan \t51,662,000 \t0.6% \t1 Jul 2025 \tUN projection
Myanmar Myanmar \t51,375,327 \t0.6% \t15 Oct 2024 \t2024 census result
South Korea South Korea \t51,143,421 \t0.6% \t31 Oct 2025 \tMonthly national estimate
Spain Spain \t49,442,844 \t0.6% \t1 Oct 2025 \tNational quarterly estimate
Algeria Algeria \t47,400,000 \t0.6% \t1 Jan 2025 \tNational annual projection
Argentina Argentina \t46,387,098 \t0.6% \t1 Jul 2025 \tNational annual projection
Iraq Iraq \t46,118,793 \t0.6% \t24 Feb 2025 \t2024 census result
Uganda Uganda \t45,905,417 \t0.6% \t10 May 2024 \t2024 census result
Afghanistan Afghanistan \t43,844,000 \t0.5% \t1 Jul 2025 \tUN projection
Canada Canada \t41,575,585 \t0.5% \t1 Oct 2025 \tNational quarterly estimate
Uzbekistan Uzbekistan \t38,069,116 \t0.5% \t1 Oct 2025 \tOfficial estimate
Poland Poland \t37,363,000 \t0.5% \t31 Oct 2025 \tMonthly national estimate
Morocco Morocco \t36,828,330 \t0.4% \t1 Sep 2024 \t2024 census result
Angola Angola \t36,604,681 \t0.4% \t19 Sep 2024 \t2024 census result
Saudi Arabia Saudi Arabia \t35,300,280 \t0.4% \t1 Jul 2024 \tOfficial estimate
Peru Peru \t34,350,244 \t0.4% \t1 Jul 2025 \tNational annual projection
Malaysia Malaysia \t34,281,100 \t0.4% \t30 Sep 2025 \tNational quarterly estimate
Mozambique Mozambique \t34,090,466 \t0.4% \t1 Jul 2025 \tNational annual projection
Ghana Ghana \t33,742,380 \t0.4% \t1 Jul 2025 \tNational annual projection
Ukraine Ukraine \t32,862,000 \t0.4% \t1 Apr 2025 \tIMF estimate
Yemen Yemen \t32,684,503 \t0.4% \t1 Jul 2023 \tOfficial estimate
Madagascar Madagascar \t31,727,042 \t0.4% \t1 Jul 2025 \tNational annual projection
Ivory Coast Ivory Coast \t31,719,275 \t0.4% \t31 Dec 2024 \tNational annual projection
Nepal Nepal \t29,911,840 \t0.4% \t2025 \tNational annual projection
Cameroon Cameroon \t29,442,327 \t0.4% \t1 Jul 2025 \tNational annual projection
Venezuela Venezuela \t28,517,000 \t0.3% \t1 Jul 2025 \tUN projection
Australia Australia \t27,614,400 \t0.3% \t30 Jun 2025 \tOfficial projection
Niger Niger \t27,522,750 \t0.3% \t1 Jul 2025 \tNational annual projection
North Korea North Korea \t25,950,000 \t0.3% \t1 Jul 2024 \tNational annual projection
Syria Syria \t25,620,427 \t0.3% \t1 Jul 2025 \tMonthly estimate
Burkina Faso Burkina Faso \t24,070,553 \t0.3% \t1 Jul 2025 \tOfficial projection
Taiwan Taiwan \t23,306,085 \t0.3% \t30 Nov 2025 \tOfficial estimate
Mali Mali \t22,395,489 \t0.3% \t15 Jun 2022 \t2022 census result
Sri Lanka Sri Lanka \t21,781,800 \t0.3% \t19 Dec 2024 \t2024 census result
Malawi Malawi \t20,734,262 \t0.3% \t1 Jul 2025 \tNational annual projection
Kazakhstan Kazakhstan \t20,478,879 \t0.2% \t1 Dec 2025 \tOfficial estimate
Chile Chile \t20,206,953 \t0.2% \t30 Jun 2025 \tNational annual projection
Zambia Zambia \t19,693,423 \t0.2% \t8 Sep 2022 \t2022 census result
Somalia Somalia \t19,655,000 \t0.2% \t1 Jul 2025 \tUN projection
Chad Chad \t19,340,757 \t0.2% \t1 Jul 2025 \tNational annual projection
Romania Romania \t19,036,031 \t0.2% \t1 Jan 2025 \tOfficial estimate
Senegal Senegal \t18,593,258 \t0.2% \t1 Jul 2024 \tNational annual projection
Netherlands Netherlands \t18,134,031 \t0.2% \t30 Nov 2025 \tOfficial estimate
Ecuador Ecuador \t18,103,660 \t0.2% \t1 Jul 2025 \tNational annual projection
Guatemala Guatemala \t18,079,810 \t0.2% \t1 Jul 2025 \tNational annual projection
Cambodia Cambodia \t17,577,760 \t0.2% \t1 Jul 2025 \tOfficial projection
Zimbabwe Zimbabwe \t17,073,087 \t0.2% \t1 Jul 2025 \tOfficial projection
South Sudan South Sudan \t15,786,898 \t0.2% \t1 Jul 2025 \tNational annual projection
Guinea Guinea \t14,363,931 \t0.2% \t1 Jul 2025 \tNational annual projection
Rwanda Rwanda \t14,104,969 \t0.2% \t1 Jul 2025 \tNational annual projection
Benin Benin \t13,224,860 \t0.2% \t1 Jul 2025 \tNational annual projection
Burundi Burundi \t12,332,788 \t0.1% \t16 Aug 2024 \tPreliminary census result
Tunisia Tunisia \t11,972,169 \t0.1% \t6 Nov 2024 \t2024 census result
Belgium Belgium \t11,924,322 \t0.1% \t1 Nov 2025 \tOfficial estimate
Haiti Haiti \t11,867,032 \t0.1% \t1 Jul 2024 \tNational annual projection
Jordan Jordan \t11,734,000 \t0.1% \t31 Dec 2024 \tNational estimate
Bolivia Bolivia \t11,365,333 \t0.1% \t23 Mar 2024 \t2024 census result
United Arab Emirates United Arab Emirates \t11,294,243 \t0.1% \t31 Dec 2024 \tOfficial estimate
Czech Republic Czech Republic \t10,897,178 \t0.1% \t30 Sep 2025 \tOfficial estimate
Dominican Republic Dominican Republic \t10,771,504 \t0.1% \t10 Nov 2022 \t2022 census result
Portugal Portugal \t10,749,635 \t0.1% \t31 Dec 2024 \tOfficial estimate
Sweden Sweden \t10,610,485 \t0.1% \t31 Oct 2025 \tMonthly national estimate
Tajikistan Tajikistan \t10,499,000 \t0.1% \t1 Jan 2025 \tOfficial estimate
Greece Greece \t10,372,335 \t0.1% \t1 Jan 2025 \tOfficial estimate
Azerbaijan Azerbaijan \t10,253,647 \t0.1% \t1 Oct 2025 \tMonthly national estimate
Papua New Guinea Papua New Guinea \t10,185,363 \t0.1% \t16 Jun 2024 \t2024 census result
Israel Israel \t10,178,000 \t0.1% \t31 Dec 2025 \tMonthly national estimate
Honduras Honduras \t9,892,632 \t0.1% \t1 Jul 2024 \tNational annual projection
Cuba Cuba \t9,748,007 \t0.1% \t31 Dec 2024 \tOfficial estimate
Hungary Hungary \t9,539,502 \t0.1% \t1 Jan 2025 \tOfficial estimate
Austria Austria \t9,216,459 \t0.1% \t1 Oct 2025 \tNational quarterly estimate
Belarus Belarus \t9,109,280 \t0.1% \t1 Jan 2025 \tOfficial estimate
Switzerland Switzerland \t9,104,063 \t0.1% \t30 Sep 2025 \tNational quarterly estimate
Sierra Leone Sierra Leone \t9,077,691 \t0.1% \t1 Jul 2025 \tNational annual projection
Togo Togo \t8,095,498 \t0.10% \t8 Nov 2022 \t2022 census result
Laos Laos \t7,647,000 \t0.09% \t1 Jul 2024 \tNational annual projection
Hong Kong Hong Kong (China) \t7,527,500 \t0.09% \t30 Jun 2025 \tNational estimate
Libya Libya \t7,459,000 \t0.09% \t1 Jul 2025 \tUN projection
Kyrgyzstan Kyrgyzstan \t7,281,800 \t0.09% \t1 Jan 2025 \tMonthly national estimate
Turkmenistan Turkmenistan \t7,057,841 \t0.09% \t17 Dec 2022 \t2022 census result
Nicaragua Nicaragua \t6,874,748 \t0.08% \t30 Jun 2024 \tOfficial estimate
Serbia Serbia \t6,567,783 \t0.08% \t1 Jan 2025 \tOfficial estimate
Central African Republic Central African Republic \t6,470,307 \t0.08% \t1 Jul 2024 \tNational annual projection
Bulgaria Bulgaria \t6,437,360 \t0.08% \t31 Dec 2024 \tOfficial estimate
Republic of the Congo Republic of the Congo \t6,142,180 \t0.07% \t17 May 2023 \t2023 census result
Singapore Singapore \t6,110,200 \t0.07% \t30 Jun 2025 \tNational annual projection
Paraguay Paraguay \t6,109,644 \t0.07% \t9 Nov 2022 \t2022 census result
El Salvador El Salvador \t6,029,976 \t0.07% \t2 May 2024 \t2024 census result
Denmark Denmark \t6,027,601 \t0.07% \t1 Dec 2025 \tMonthly national estimate
Finland Finland \t5,656,394 \t0.07% \t30 Nov 2025 \tMonthly national estimate
Norway Norway \t5,618,354 \t0.07% \t30 Sep 2025 \tNational quarterly estimate
Lebanon Lebanon \t5,490,000 \t0.07% \t1 Jul 2021 \tOfficial estimate
Palestine Palestine \t5,483,450 \t0.07% \t1 Jan 2023 \tNational annual projection
Republic of Ireland Ireland \t5,458,600 \t0.07% \t1 Apr 2025 \tNational estimate
Slovakia Slovakia \t5,413,191 \t0.07% \t30 Sep 2025 \tNational quarterly estimate
Oman Oman \t5,357,728 \t0.07% \t30 Nov 2025 \tMonthly national estimate
New Zealand New Zealand \t5,334,200 \t0.06% \t30 Sep 2025 \tNational quarterly estimate
Liberia Liberia \t5,248,621 \t0.06% \t10 Nov 2022 \t2022 census result
Costa Rica Costa Rica \t5,191,824 \t0.06% \t30 Jun 2025 \tNational annual projection
Mauritania Mauritania \t4,927,532 \t0.06% \t25 Dec 2023 \t2023 census result
Kuwait Kuwait \t4,881,254 \t0.06% \t1 Jan 2025 \tOfficial estimate
Panama Panama \t4,064,780 \t0.05% \t8 Jan 2023 \t2023 census result
Croatia Croatia \t3,866,233 \t0.05% \t1 Jul 2024 \tOfficial estimate
Georgia (country) Georgia \t3,704,500 \t0.05% \t1 Jan 2025 \tOfficial estimate
Eritrea Eritrea \t3,607,000 \t0.04% \t1 Jul 2025 \tUN projection
Mongolia Mongolia \t3,544,835 \t0.04% \t31 Dec 2024 \tNational annual projection
Uruguay Uruguay \t3,499,451 \t0.04% \t31 May 2023 \t2023 Census
Bosnia and Herzegovina Bosnia and Herzegovina \t3,412,000 \t0.04% \t1 Jul 2024 \tOfficial estimate
Puerto Rico Puerto Rico (US) \t3,203,295 \t0.04% \t1 Jul 2024 \tAnnual projection
Qatar Qatar \t3,173,024 \t0.04% \t30 Nov 2024 \tMonthly national estimate
Armenia Armenia \t3,076,200 \t0.04% \t1 Jan 2025 \tOfficial estimate
Namibia Namibia \t3,022,401 \t0.04% \t24 Sep 2023 \t2023 Census
Lithuania Lithuania \t2,896,808 \t0.04% \t1 Dec 2025 \tMonthly national estimate
Jamaica Jamaica \t2,774,538 \t0.03% \t12 Sep 2022 \t2022 census result
Gabon Gabon \t2,469,296 \t0.03% \t1 Jul 2025 \tNational annual projection
The Gambia Gambia \t2,422,712 \t0.03% \t1 May 2024 \tPreliminary census results
Moldova Moldova \t2,381,300 \t0.03% \t1 Jan 2025 \tOfficial estimate
Albania Albania \t2,363,314 \t0.03% \t1 Jan 2025 \tOfficial estimate
Botswana Botswana \t2,359,609 \t0.03% \t18 Mar 2022 \t2022 census result
Slovenia Slovenia \t2,130,986 \t0.03% \t1 Jul 2025 \tNational quarterly estimate
Lesotho Lesotho \t2,116,427 \t0.03% \t2024 \tOfficial survey
Latvia Latvia \t1,826,200 \t0.02% \t1 Nov 2025 \tMonthly national estimate
North Macedonia North Macedonia \t1,822,612 \t0.02% \t31 Dec 2024 \tOfficial estimate
Guinea-Bissau Guinea-Bissau \t1,781,308 \t0.02% \t1 Jul 2023 \tNational annual projection
Equatorial Guinea Equatorial Guinea \t1,668,768 \t0.02% \t1 Jul 2024 \tOfficial estimate
Bahrain Bahrain \t1,594,654 \t0.02% \t31 Dec 2024 \tOfficial estimate
Kosovo Kosovo \t1,585,566 \t0.02% \t4 Apr 2024 \t2024 national census
Timor-Leste Timor-Leste \t1,391,221 \t0.02% \t1 Jul 2025 \tNational annual projection
Estonia Estonia \t1,369,995 \t0.02% \t1 Jan 2025 \tOfficial estimate
Trinidad and Tobago Trinidad and Tobago \t1,367,764 \t0.02% \t30 Jun 2025 \tOfficial estimate
Mauritius Mauritius \t1,243,741 \t0.02% \t1 Jul 2025 \tNational estimate
Eswatini Eswatini \t1,235,549 \t0.02% \t1 Jul 2024 \tOfficial projection
Djibouti Djibouti \t1,066,809 \t0.01% \t20 May 2024 \t2024 census result
Cyprus Cyprus \t966,400 \t0.01% \t31 Dec 2023 \tOfficial estimate
Comoros Comoros \t919,901 \t0.01% \t2025 \tOfficial estimate
Fiji Fiji \t900,869 \t0.01% \t1 Jan 2025 \tNational annual projection
Bhutan Bhutan \t784,043 \t0.010% \t2025 \tNational annual projection
Guyana Guyana \t772,975 \t0.009% \t1 Jul 2021 \tOfficial estimate
Solomon Islands Solomon Islands \t750,325 \t0.009% \t1 Jul 2024 \tNational annual projection
Macau Macau (China) \t686,600 \t0.008% \t30 Sep 2025 \tNational quarterly estimate
Luxembourg Luxembourg \t681,973 \t0.008% \t1 Jan 2025 \tOfficial estimate
Montenegro Montenegro \t623,327 \t0.008% \t1 Jan 2025 \tOfficial estimate
Suriname Suriname \t616,500 \t0.007% \t1 Jul 2021 \tOfficial estimate
Western Sahara (disputed) \t600,904 \t0.007% \t1 Jul 2025 \tUN projection
Malta Malta \t574,250 \t0.007% \t31 Dec 2024 \tOfficial estimate
Maldives Maldives \t515,132 \t0.006% \t13 Sep 2022 \t2022 census result
Cape Verde Cape Verde \t491,233 \t0.006% \t16 Jun 2021 \t2021 census result
Northern Cyprus Northern Cyprus \t476,214 \t0.006% \t31 Dec 2023 \tOfficial projection
Brunei Brunei \t455,500 \t0.006% \t1 Jul 2024 \tOfficial estimate
Belize Belize \t417,634 \t0.005% \t1 Jul 2025 \tOfficial estimate
The Bahamas Bahamas \t398,165 \t0.005% \t4 Apr 2022 \t2022 census result
Iceland Iceland \t393,160 \t0.005% \t1 Oct 2025 \tNational quarterly estimate
Transnistria Transnistria \t367,776 \t0.004% \t31 Mar 2024 \tOfficial estimate
Vanuatu Vanuatu \t321,409 \t0.004% \t1 Jul 2024 \tNational annual projection
French Polynesia French Polynesia (France) \t279,500 \t0.003% \t31 Dec 2024 \tNational annual projection
Barbados Barbados \t267,800 \t0.003% \t31 Dec 2022 \tOfficial estimate
New Caledonia New Caledonia (France) \t264,596 \t0.003% \t1 Jan 2025 \tNational annual projection
Abkhazia Abkhazia \t244,236 \t0.003% \t1 Jan 2022 \tOfficial estimate
São Tomé and Príncipe São Tomé and Príncipe \t209,607 \t0.003% \t2024 \tPreliminary census result
Samoa Samoa \t205,557 \t0.002% \t6 Nov 2021 \t2021 Census
Saint Lucia Saint Lucia \t184,100 \t0.002% \t1 Jul 2023 \tOfficial estimate
Curaçao Curaçao (Netherlands) \t156,115 \t0.002% \t1 Jan 2025 \tOfficial estimate
Guam Guam (US) \t153,836 \t0.002% \t1 Apr 2020 \t2020 census result
Seychelles Seychelles \t122,729 \t0.001% \t30 Jun 2025 \tOfficial estimate
Kiribati Kiribati \t120,740 \t0.001% \t1 Jul 2021 \tNational annual projection
Saint Vincent and the Grenadines Saint Vincent and the Grenadines \t110,872 \t0.001% \t1 Jul 2022 \tOfficial estimate
Aruba Aruba (Netherlands) \t109,435 \t0.001% \t30 Jun 2025 \tOfficial estimate
Grenada Grenada \t109,021 \t0.001% \t2021 \tPreliminary Census results
Federated States of Micronesia Micronesia \t105,564 \t0.001% \t2025 \tNational annual projection
Antigua and Barbuda Antigua and Barbuda \t103,603 \t0.001% \t1 Jan 2024 \tOfficial estimate
Jersey Jersey (UK) \t103,267 \t0.001% \t21 Mar 2021 \t2021 census result
Tonga Tonga \t100,179 \t0.001% \t30 Nov 2021 \t2021 census result
Andorra Andorra \t88,941 \t0.001% \t30 Nov 2025 \tMonthly national estimate
United States Virgin Islands U.S. Virgin Islands (US) \t87,146 \t0.001% \t1 Apr 2020 \t2020 census result
Cayman Islands Cayman Islands (UK) \t84,738 \t0.001% \t31 Dec 2023 \tNational annual projection
Isle of Man Isle of Man (UK) \t84,530 \t0.001% \t1 Apr 2023 \tOfficial estimate
Dominica Dominica \t67,408 \t0.0008% \t31 Dec 2017 \tOfficial estimate
Guernsey Guernsey (UK) \t64,781 \t0.0008% \t31 Dec 2023 \tNational quarterly estimate
Bermuda Bermuda (UK) \t64,055 \t0.0008% \t1 Jul 2021 \tNational annual projection
Greenland Greenland (Denmark) \t56,831 \t0.0007% \t1 Jul 2025 \tNational quarterly estimate
South Ossetia South Ossetia \t56,520 \t0.0007% \t31 Dec 2021 \tOfficial estimate
Faroe Islands Faroe Islands (Denmark) \t54,870 \t0.0007% \t1 Nov 2025 \tMonthly national estimate
Saint Kitts and Nevis Saint Kitts and Nevis \t51,320 \t0.0006% \t2022 \t2022 census result
Turks and Caicos Islands Turks and Caicos Islands (UK) \t50,828 \t0.0006% \t1 Jul 2024 \tOfficial estimate
American Samoa American Samoa (US) \t49,710 \t0.0006% \t1 Apr 2020 \t2020 census result
Northern Mariana Islands Northern Mariana Islands (US) \t47,329 \t0.0006% \t1 Apr 2020 \t2020 census result
Marshall Islands Marshall Islands \t42,418 \t0.0005% \t30 Sep 2021 \t2021 Census
Sint Maarten Sint Maarten (Netherlands) \t41,349 \t0.0005% \t1 Jan 2025 \tOfficial estimate
Liechtenstein Liechtenstein \t41,024 \t0.0005% \t30 Jun 2024 \tNational estimate
British Virgin Islands British Virgin Islands (UK) \t39,471 \t0.0005% \t1 Jul 2024 \tUN projection
Monaco Monaco \t39,000 \t0.0005% \t2025 \tOfficial estimate
`.trim();

const countries = Array.from(
  new Set(
    countryData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("["))
      .map((line) => line.split("\t")[0].trim())
      .map((name) => {
        const duplicateMatch = name.match(/^(.+)\s\1$/i);
        return duplicateMatch ? duplicateMatch[1] : name;
      })
  )
);

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
