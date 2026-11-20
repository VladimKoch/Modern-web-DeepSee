export interface TranslationSchema {
  nav: {
    links: { name: string; href: string }[];
    searchAria: string;
    searchTitle: string;
    joinButton: string;
  };
  hero: {
    tag: string;
    tagAlert: string;
    title: string;
    tagline: string;
    description: string;
    exploreBtn: string;
    watchBtn: string;
    socialProofPrefix: string;
    socialProofSuffix: string;
    ratingLabel: string;
    currentExpeditionTag: string;
    currentExpeditionTitle: string;
    currentExpeditionMeta: string;
    liveActiveTitle: string;
    sonarActive: string;
    watchLive: string;
    metric1Value: string;
    metric1Label: string;
    metric2Value: string;
    metric2Label: string;
    tabs: { id: "01" | "02" | "03"; label: string }[];
    scrollCue: string;
  };
  depthGauge: {
    label: string;
    euphotic: string;
    mesopelagic: string;
  };
  act3: {
    badge: string;
    headline: string;
    copy: string;
    lightLabel: string;
    lightValue: string;
    tempLabel: string;
    visLabel: string;
    reefMonitoring: string;
    liveBadge: string;
    coralCoverLabel: string;
    coralCoverValue: string;
    acousticLabel: string;
    acousticValue: string;
  };
  act4: {
    badge: string;
    headline: string;
    copy: string;
    featuredTag: string;
    spotsRemaining: string;
    cardTitle: string;
    cardMeta: string;
    departure: string;
    bookBtn: string;
  };
  expeditions: {
    badge: string;
    title: string;
    subtitle: string;
    cards: {
      id: string;
      tag: string;
      title: string;
      location: string;
      desc: string;
      stats: string;
      border: string;
    }[];
    detailsBtn: string;
  };
  zones: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: { id: "sunlight" | "twilight" | "midnight"; label: string }[];
    sunlight: {
      tag: string;
      title: string;
      desc: string;
      stat1Label: string;
      stat1Val: string;
      stat2Label: string;
      stat2Val: string;
      stat3Label: string;
      stat3Val: string;
      caption: string;
    };
    twilight: {
      tag: string;
      title: string;
      desc: string;
      stat1Label: string;
      stat1Val: string;
      stat2Label: string;
      stat2Val: string;
      stat3Label: string;
      stat3Val: string;
      cardTitle: string;
      cardDesc: string;
    };
    midnight: {
      tag: string;
      title: string;
      desc: string;
      stat1Label: string;
      stat1Val: string;
      stat2Label: string;
      stat2Val: string;
      stat3Label: string;
      stat3Val: string;
      cardTitle: string;
      cardDesc: string;
    };
  };
  footer: {
    brand: string;
    desc: string;
    newsPlaceholder: string;
    newsSubmit: string;
    newsAlert: string;
    col1Title: string;
    col1Links: string[];
    col2Title: string;
    col2Links: string[];
    col3Title: string;
    col3Links: string[];
    rights: string;
    partner: string;
    returnTop: string;
  };
  modals: {
    video: {
      badge: string;
      title: string;
      runtime: string;
      audio: string;
    };
    live: {
      badge: string;
      location: string;
      camera: string;
      target: string;
      pressure: string;
      temp: string;
      depthTitle: string;
      oxygenTitle: string;
      oxygenStatus: string;
      uplinkTitle: string;
      uplinkDesc: string;
    };
    search: {
      placeholder: string;
      trending: string;
      tags: string[];
    };
    join: {
      title: string;
      desc: string;
      emailPlaceholder: string;
      submitBtn: string;
      successTitle: string;
      successPrefix: string;
      successSuffix: string;
      dismissBtn: string;
    };
    booking: {
      title: string;
      desc: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      submitBtn: string;
      successTitle: string;
      successDesc: string;
      returnBtn: string;
    };
  };
}

export const translations: Record<"CZ" | "EN", TranslationSchema> = {
  CZ: {
    nav: {
      links: [
        { name: "Expedice", href: "#expeditions-grid" },
        { name: "Mořský život", href: "#depth-explorer" },
        { name: "Výzkum", href: "#expeditions-grid" },
        { name: "Ochrana oceánů", href: "#depth-explorer" },
        { name: "O nás", href: "#footer" },
      ],
      searchAria: "Hledat expedice",
      searchTitle: "Hledat",
      joinButton: "Připojit se k misi",
    },
    hero: {
      tag: "PRŮZKUM A OCHRANA OCEÁNŮ",
      tagAlert: "Globální iniciativa pro průzkum a ochranu oceánů",
      title: "DEEP SEA",
      tagline: "ODHALTE TAJEMSTVÍ OCEÁNSKÝCH HLUBIN",
      description:
        "Vydejte se na špičkové mořské expedice, objevujte nedotčené podmořské ekosystémy a pomozte chránit největší hranici naší planety.",
      exploreBtn: "Prozkoumat expedice",
      watchBtn: "Přehrát dokument",
      socialProofPrefix: "Připojilo se více než",
      socialProofSuffix: "ochránců oceánu",
      ratingLabel: "Hodnocení 4.9",
      currentExpeditionTag: "AKTUÁLNÍ EXPEDICE",
      currentExpeditionTitle: "Mise Mariánský příkop",
      currentExpeditionMeta: "Hloubka: 10 994 m • Živý přenos aktivní",
      liveActiveTitle: "Živý přenos aktivní",
      sonarActive: "Sonar aktivní",
      watchLive: "Sledovat živě",
      metric1Value: "42+",
      metric1Label: "Chráněných mořských oblastí",
      metric2Value: "12",
      metric2Label: "Aktivních výzkumných plavidel",
      tabs: [
        { id: "01", label: "EXPEDICE" },
        { id: "02", label: "HABITATY" },
        { id: "03", label: "MISE" },
      ],
      scrollCue: "SCROLLUJTE DO HLUBIN",
    },
    depthGauge: {
      label: "HLOUBKA",
      euphotic: "EUFOTICKÁ",
      mesopelagic: "MESOPELAGIÁL",
    },
    act3: {
      badge: "PODMOŘSKÉ EKOSYSTÉMY",
      headline: "Tvarováno světlem a přílivem",
      copy: "Pod prosluněnou hladinou leží živoucí hranice zvlněných písečných dun, podmořských proudů a křehkých mořských biotopů.",
      lightLabel: "PRŮNIK SVĚTLA",
      lightValue: "78 % Eufotická zóna",
      tempLabel: "Teplota vody: 24,6 °C",
      visLabel: "Viditelnost: 42 m",
      reefMonitoring: "AKTIVNÍ MONITORING ÚTESŮ",
      liveBadge: "ŽIVĚ",
      coralCoverLabel: "Pokrytí korály",
      coralCoverValue: "+14 % meziročně",
      acousticLabel: "Akustické mapování",
      acousticValue: "AKTIVNÍ",
    },
    act4: {
      badge: "POTOPENÉ DĚDICTVÍ A ARCHIVY ÚTESŮ",
      headline: "Ochrana historie a křehkých útesů",
      copy: "Od staletých námořních relikvií po prosperující korálové ekosystémy – každá expedice odkrývá příběhy čekající na ochranu.",
      featuredTag: "DOPORUČENÁ EXPEDICE",
      spotsRemaining: "ZBÝVAJÍ 4 MÍSTA",
      cardTitle: "Průzkum hlubokých útesů a relikvií",
      cardMeta: "Šelf San Pedro • Hloubka -118 m • 3D fotogrammetrie",
      departure: "Odplutí: Červen 2026",
      bookBtn: "Rezervovat expedici",
    },
    expeditions: {
      badge: "GLOBÁLNÍ VĚDECKÉ MISE",
      title: "Aktivní oceánské expedice",
      subtitle:
        "Připojte se k naší vědecké flotile na předních liniích ochrany přírody po celém světě. Každá plavba kombinuje pokročilou robotickou telemetrii s terénním výzkumem mořských biologů.",
      cards: [
        {
          id: "coral",
          tag: "BIODIVERZITA",
          title: "Obnova korálových útesů",
          location: "Velký bariérový útes • Austrálie",
          desc: "Využíváme mikro-fragmentační školky a akustické návnady pro larvy k obnově vybělených korálových struktur.",
          stats: "+34 obnovených hektarů",
          border: "border-cyan-400/35",
        },
        {
          id: "trench",
          tag: "BATYMETRIE HLUBIN",
          title: "Mapování hlubokooceánských příkopů",
          location: "Mariánský příkop • Tichý oceán",
          desc: "Submilimetrové mapování mnohopaprskovým sonarem na dně prohlubně Challenger Deep pro genomický výzkum extremofilních organismů.",
          stats: "10 994 m Ultra-hlubina",
          border: "border-sky-400/35",
        },
        {
          id: "heritage",
          tag: "ARCHEOLOGIE",
          title: "Námořní dědictví a relikvie",
          location: "Karibský hřbet • Atlantik",
          desc: "Dokumentace potopených galeon ze 17. století a historických artefaktů pomocí nedestruktivní 3D fotogrammetrie pod záštitou UNESCO.",
          stats: "18 chráněných vraků",
          border: "border-amber-400/35",
        },
      ],
      detailsBtn: "Podrobnosti",
    },
    zones: {
      badge: "STRATIFIKOVANÁ OCEÁNOGRAFIE",
      title: "Prozkoumejte vodní sloupec",
      subtitle:
        "Jak sluneční světlo slábne s rostoucí hloubkou mořské vody, mořské ekosystémy se dramaticky proměňují od zářivých korálových zahrad po vysokotlaké propasti.",
      tabs: [
        { id: "sunlight", label: "Sluneční zóna (0–200 m)" },
        { id: "twilight", label: "Soumračná zóna (200–1 000 m)" },
        { id: "midnight", label: "Půlnoční zóna (1 000 m+)" },
      ],
      sunlight: {
        tag: "ZÓNA 01 • EPIPELAGIÁL [0 AŽ 200 METRŮ]",
        title: "Prosluněná eufotická říše",
        desc: "Přijímá hojné sluneční záření, které živí 90 % veškerého mořského života. Zde fytoplankton pohání globální uhlíkový cyklus, korálové polypy staví obrovské útesy a daří se zde velkým pelagickým rybám.",
        stat1Label: "Úroveň světla",
        stat1Val: "100 % – 1 %",
        stat2Label: "Prům. teplota",
        stat2Val: "20 °C – 28 °C",
        stat3Label: "Tlak",
        stat3Val: "1 – 20 ATM",
        caption: "Hlavní obyvatelé: Korálové útesy, Mořské želvy, Žralok obrovský",
      },
      twilight: {
        tag: "ZÓNA 02 • MESOPELAGIÁL [200 AŽ 1 000 METRŮ]",
        title: "Hranice temného soumraku",
        desc: "Do této hloubky proniká pouze tlumené modrozelené vlnové spektrum. Živočichové si vyvinuli obří specializované oči a bioluminiscenční fotofory pro protisvětelné maskování a komunikaci.",
        stat1Label: "Úroveň světla",
        stat1Val: "< 1 % (Modrá)",
        stat2Label: "Prům. teplota",
        stat2Val: "4 °C – 12 °C",
        stat3Label: "Tlak",
        stat3Val: "20 – 100 ATM",
        cardTitle: "Denní vertikální migrace",
        cardDesc:
          "Největší migrace živočichů na Zemi se odehrává právě zde každou noc, kdy miliardy světlušek a olihní stoupají k hladině za potravou.",
      },
      midnight: {
        tag: "ZÓNA 03 • BATYPELAGIÁL A ABYSÁL [1 000 M AŽ 11 000 M]",
        title: "Věčná temnota a hluboká propast",
        desc: "Nulový dosvit slunečního záření. Potravní sítě spoléhají na \"mořské sněžení\" organického materiálu z horních pater a chemosyntetické bakterie kolem hydrotermálních pramenů chrlících přehřáté minerální roztoky.",
        stat1Label: "Úroveň světla",
        stat1Val: "0,00 % [Tma]",
        stat2Label: "Prům. teplota",
        stat2Val: "1 °C – 3 °C",
        stat3Label: "Tlak",
        stat3Val: "100 – 1 100 ATM",
        cardTitle: "Rekord Mariánského příkopu: 10 994 m",
        cardDesc:
          "Nepředstavitelný drtivý tlak, ve kterém přebývají endemické různonožce, hlubokomořské ryby a dokonale zachovalé relikvie dávných mořeplaveckých věků.",
      },
    },
    footer: {
      brand: "DEEP SEA EXPLORATION",
      desc: "Průkopníci autonomní podmořské robotiky, batymetrické kartografie a globální ochrany korálových útesů. Podporováno mezinárodní komunitou ochránců oceánu.",
      newsPlaceholder: "Zadejte e-mail pro odběr novinek...",
      newsSubmit: "Odebírat",
      newsAlert: "Děkujeme za přihlášení k odběru zpráv z expedic DEEP SEA!",
      col1Title: "Expedice",
      col1Links: ["Mariánský příkop", "Velký bariérový útes", "Arktický šelf", "Galapážské prameny"],
      col2Title: "Věda a výzkum",
      col2Links: ["Batymetrická telemetrie", "Odběr eDNA", "Akustický sonar", "Otevřená data"],
      col3Title: "Organizace",
      col3Links: ["O nadaci", "Výzkumná flotila", "Kariéra v posádce", "Kontakt dispečinku"],
      rights: "© 2026 DEEP SEA Exploration & Conservation. Všechna práva vyhrazena.",
      partner: "Partner Dekády oceánské vědy UNESCO",
      returnTop: "↑ Zpět na hladinu",
    },
    modals: {
      video: {
        badge: "DEEP SEA ORIGINALS",
        title: "Hranice propasti: Průzkum Challenger Deep",
        runtime: "Stopáž: 48m 22s",
        audio: "Prostorový zvuk 7.1 aktivní",
      },
      live: {
        badge: "ŽIVÝ PŘENOS Z BATYSKAFU \"TRITON-V\"",
        location: "Mariánský příkop • Souřadnice: 11°22′N 142°35′E",
        camera: "KAMERA-01 [VNĚJŠÍ STROBOSKOP]",
        target: "CÍL: ABYSÁLNÍ MOŘSKÉ DNO",
        pressure: "TLAK: 1 086 BAR",
        temp: "TEPLOTA VODY: 1,4 °C",
        depthTitle: "AKTUÁLNÍ HLOUBKA",
        oxygenTitle: "ZÁSOBY KYSLÍKU",
        oxygenStatus: "Nominální podpora života",
        uplinkTitle: "ŽIVÉ SPOJENÍ",
        uplinkDesc: "Kvantový laserový uplink na hladinové plavidlo. Latence: 14 ms",
      },
      search: {
        placeholder: "Hledat expedice, mořský život, vědecké studie...",
        trending: "Často hledané výrazy",
        tags: [
          "Mariánský příkop 2026",
          "Bioluminiscenční druhy",
          "Obnova korálů",
          "Hydrotermální prameny",
          "Potopené galeony 3D",
        ],
      },
      join: {
        title: "Staňte se ochráncem oceánu",
        desc: "Získejte přístup k exkluzivním živým přenosům z hlubin, vědeckým zprávám a přímé telemetrii z našich expedic.",
        emailPlaceholder: "Zadejte svou e-mailovou adresu",
        submitBtn: "Potvrdit členství v misi",
        successTitle: "Vítejte na palubě!",
        successPrefix: "Byli jste úspěšně zaregistrováni jako Ochránce oceánu #",
        successSuffix: ". Uvítací balíček expedice vám zašleme e-mailem.",
        dismissBtn: "Zavřít",
      },
      booking: {
        title: "Rezervace místa na expedici",
        desc: "Přihlaste se na jednu ze 4 civilních výzkumných pozic na expedici Průzkum hlubokých útesů a relikvií šelfu San Pedro (červen 2026).",
        namePlaceholder: "Jméno a příjmení",
        emailPlaceholder: "E-mailová adresa",
        submitBtn: "Odeslat přihlášku do posádky",
        successTitle: "Přihláška byla zaznamenána!",
        successDesc:
          "Náš hlavní potápěčský lékař a koordinátor expedice posoudí vaše údaje a spojí se s vámi do 48 hodin.",
        returnBtn: "Zpět k průzkumu",
      },
    },
  },
  EN: {
    nav: {
      links: [
        { name: "Expeditions", href: "#expeditions-grid" },
        { name: "Marine Life", href: "#depth-explorer" },
        { name: "Research", href: "#expeditions-grid" },
        { name: "Conservation", href: "#depth-explorer" },
        { name: "About Us", href: "#footer" },
      ],
      searchAria: "Search expeditions",
      searchTitle: "Search",
      joinButton: "Join Mission",
    },
    hero: {
      tag: "OCEAN EXPLORATION & CONSERVATION",
      tagAlert: "Global Ocean Exploration & Conservation Initiative",
      title: "DEEP SEA",
      tagline: "UNCOVER THE MYSTERIES OF THE OCEAN DEPTHS",
      description:
        "Embark on cutting-edge marine expeditions, discover untouched underwater ecosystems, and help protect our planet's greatest frontier.",
      exploreBtn: "Explore Expeditions",
      watchBtn: "Watch Documentary",
      socialProofPrefix: "Joined by",
      socialProofSuffix: "ocean advocates",
      ratingLabel: "4.9★ Explorer Rating",
      currentExpeditionTag: "CURRENT EXPEDITION",
      currentExpeditionTitle: "Mariana Trench Mission",
      currentExpeditionMeta: "Depth: 10,994m • Live Stream Active",
      liveActiveTitle: "Live Stream Active",
      sonarActive: "Sonar Active",
      watchLive: "Watch Live",
      metric1Value: "42+",
      metric1Label: "Marine Protected Areas",
      metric2Value: "12",
      metric2Label: "Active Vessels",
      tabs: [
        { id: "01", label: "EXPEDITIONS" },
        { id: "02", label: "HABITATS" },
        { id: "03", label: "MISSIONS" },
      ],
      scrollCue: "SCROLL TO DIVE",
    },
    depthGauge: {
      label: "DEPTH",
      euphotic: "EUPHOTIC",
      mesopelagic: "MESOPELAGIC",
    },
    act3: {
      badge: "SUBSURFACE ECOSYSTEMS",
      headline: "Sculpted by Light & Tide",
      copy: "Beneath the sunlit surface lies a living frontier of shifting sand ripples, acoustic currents, and delicate marine habitats.",
      lightLabel: "LIGHT PENETRATION",
      lightValue: "78% Euphotic Zone",
      tempLabel: "Water Temp: 24.6°C",
      visLabel: "Visibility: 42m",
      reefMonitoring: "ACTIVE REEF MONITORING",
      liveBadge: "LIVE",
      coralCoverLabel: "Coral Coverage",
      coralCoverValue: "+14% YoY",
      acousticLabel: "Acoustic Mapping",
      acousticValue: "ONLINE",
    },
    act4: {
      badge: "SUNKEN HERITAGE & REEF ARCHIVES",
      headline: "Preserving History & Fragile Reefs",
      copy: "From centuries-old maritime relics to thriving coral ecosystems, every expedition uncovers stories waiting to be protected.",
      featuredTag: "FEATURED EXPEDITION",
      spotsRemaining: "4 SPOTS REMAINING",
      cardTitle: "Deep Reef & Relic Survey",
      cardMeta: "San Pedro Shelf • Depth -118m • 3D Photogrammetry",
      departure: "Departure: June 2026",
      bookBtn: "Book Expedition",
    },
    expeditions: {
      badge: "GLOBAL SCIENTIFIC MISSIONS",
      title: "Active Oceanic Expeditions",
      subtitle:
        "Join our scientific fleet at the frontlines of ocean conservation worldwide. Each voyage fuses advanced robotic telemetry with hands-on marine field research.",
      cards: [
        {
          id: "coral",
          tag: "BIODIVERSITY",
          title: "Coral Reef Restoration",
          location: "Great Barrier Reef • Australia",
          desc: "Deploying micro-fragmentation nurseries and larval acoustic cues to rehabilitate bleached coral structures.",
          stats: "+34 Restored Hectares",
          border: "border-cyan-400/35",
        },
        {
          id: "trench",
          tag: "ABYSSAL BATHYMETRY",
          title: "Abyssal Trench Mapping",
          location: "Mariana Trench • Pacific Ocean",
          desc: "Sub-millimeter multibeam sonar bathymetry across Challenger Deep to discover novel piezophilic genomic strains.",
          stats: "10,994m Ultra-Deep",
          border: "border-sky-400/35",
        },
        {
          id: "heritage",
          tag: "ARCHAEOLOGY",
          title: "Maritime Archaeology",
          location: "Caribbean Ridge • Atlantic",
          desc: "High-precision 3D photogrammetry of 17th-century galleons and historical seafloor artifacts under UNESCO oversight.",
          stats: "18 Protected Wrecks",
          border: "border-amber-400/35",
        },
      ],
      detailsBtn: "Learn More",
    },
    zones: {
      badge: "STRATIFIED OCEANOGRAPHY",
      title: "Explore the Water Column",
      subtitle:
        "As sunlight vanishes with depth, oceanic ecosystems undergo dramatic morphological shifts from sunlit coral gardens to abyssal trenches.",
      tabs: [
        { id: "sunlight", label: "Sunlight Zone (0–200m)" },
        { id: "twilight", label: "Twilight Zone (200–1,000m)" },
        { id: "midnight", label: "Midnight Zone (1,000m+)" },
      ],
      sunlight: {
        tag: "ZONE 01 • EPIPELAGIC [0 TO 200 METERS]",
        title: "Sunlit Euphotic Realm",
        desc: "Bathed in abundant sunlight supporting over 90% of marine species. Phytoplankton fuels the carbon cycle while thriving coral reefs sustain pelagic apex predators.",
        stat1Label: "Light Level",
        stat1Val: "100% – 1%",
        stat2Label: "Avg Temp",
        stat2Val: "20°C – 28°C",
        stat3Label: "Pressure",
        stat3Val: "1 – 20 ATM",
        caption: "Key Inhabitants: Coral Reefs, Sea Turtles, Whale Sharks",
      },
      twilight: {
        tag: "ZONE 02 • MESOPELAGIC [200 TO 1,000 METERS]",
        title: "The Dim Twilight Boundary",
        desc: "Only faint blue-green wavelengths penetrate here. Creatures rely on sensitive eyes and bioluminescent photophores for counterillumination and intraspecies signalling.",
        stat1Label: "Light Level",
        stat1Val: "< 1% (Blue)",
        stat2Label: "Avg Temp",
        stat2Val: "4°C – 12°C",
        stat3Label: "Pressure",
        stat3Val: "20 – 100 ATM",
        cardTitle: "Diel Vertical Migration",
        cardDesc:
          "Earth's largest synchronized animal migration occurs here nightly, as billions of lanternfish and squid ascend to feed under cover of darkness.",
      },
      midnight: {
        tag: "ZONE 03 • BATHYPELAGIC & ABYSSAL [1,000M TO 11,000M]",
        title: "Perpetual Darkness & Abyssal Trenches",
        desc: "Zero sunlight penetration. Marine snow drifts down from surface layers feeding benthic detritivores, while hydrothermal vents support unique chemosynthetic ecosystems.",
        stat1Label: "Light Level",
        stat1Val: "0.00% [Pitch Black]",
        stat2Label: "Avg Temp",
        stat2Val: "1°C – 3°C",
        stat3Label: "Pressure",
        stat3Val: "100 – 1,100 ATM",
        cardTitle: "Mariana Trench Record: 10,994m",
        cardDesc:
          "Crushing barometric pressure where endemic amphipods, snailfish, and pristine historical seafloor artifacts endure indefinitely.",
      },
    },
    footer: {
      brand: "DEEP SEA EXPLORATION",
      desc: "Pioneering autonomous sub-surface robotics, bathymetric cartography, and reef restoration across global oceans. Backed by 14,500+ worldwide ocean advocates.",
      newsPlaceholder: "Enter your email for expedition dispatches...",
      newsSubmit: "Subscribe",
      newsAlert: "Thank you for subscribing to DEEP SEA expedition dispatches!",
      col1Title: "Expeditions",
      col1Links: ["Mariana Trench", "Great Barrier Reef", "Arctic Shelf", "Galapagos Vents"],
      col2Title: "Science & Research",
      col2Links: ["Bathymetric Telemetry", "eDNA Sampling", "Acoustic Sonar", "Open Science Data"],
      col3Title: "Organization",
      col3Links: ["About Foundation", "Research Fleet", "Crew Careers", "Mission Control"],
      rights: "© 2026 DEEP SEA Exploration & Conservation. All rights reserved.",
      partner: "Partner of the UNESCO Ocean Decade",
      returnTop: "↑ Return to Surface",
    },
    modals: {
      video: {
        badge: "DEEP SEA ORIGINALS",
        title: "Abyssal Frontier: Exploring Challenger Deep",
        runtime: "Runtime: 48m 22s",
        audio: "Spatial 7.1 Surround Active",
      },
      live: {
        badge: "LIVE STREAM FROM \"TRITON-V\" SUBMERSIBLE",
        location: "Mariana Trench • Coordinates: 11°22′N 142°35′E",
        camera: "CAM-01 [FORWARD STROBE ARRAY]",
        target: "TARGET: ABYSSAL SEABED",
        pressure: "PRESSURE: 1,086 BAR",
        temp: "WATER TEMP: 1.4°C",
        depthTitle: "CURRENT DEPTH",
        oxygenTitle: "OXYGEN RESERVES",
        oxygenStatus: "Nominal Life Support",
        uplinkTitle: "LIVE UPLINK",
        uplinkDesc: "Quantum laser telemetry to mothership. Latency: 14ms",
      },
      search: {
        placeholder: "Search expeditions, marine life, research papers...",
        trending: "Trending Searches",
        tags: [
          "Mariana Trench 2026",
          "Bioluminescent Species",
          "Coral Restoration",
          "Hydrothermal Vents",
          "Sunken Galleons 3D",
        ],
      },
      join: {
        title: "Become an Ocean Advocate",
        desc: "Gain access to exclusive live deep-sea dives, scientific telemetry dispatches, and priority expedition crew allocations.",
        emailPlaceholder: "Enter your email address",
        submitBtn: "Confirm Mission Membership",
        successTitle: "Welcome Aboard!",
        successPrefix: "You have been officially registered as Ocean Advocate #",
        successSuffix: ". Your expedition briefing packet is on its way.",
        dismissBtn: "Dismiss",
      },
      booking: {
        title: "Expedition Crew Berth Reservation",
        desc: "Apply for one of 4 civilian researcher berths on the San Pedro Deep Reef & Relic Survey (June 2026).",
        namePlaceholder: "Full Name",
        emailPlaceholder: "Email Address",
        submitBtn: "Submit Berth Application",
        successTitle: "Berth Application Submitted!",
        successDesc:
          "Our Chief Diving Medical Officer & Expedition Director will review your submission and contact you within 48 hours.",
        returnBtn: "Return to Exploration",
      },
    },
  },
};

