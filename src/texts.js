(function () {
  const PROMPT_BANK = {
    en: {
      label: "English",
      wikiCode: "en",
      subjects: ["a lighthouse keeper", "an apprentice cartographer", "a quiet astronomer", "a market storyteller", "a patient game designer", "an island researcher"],
      verbs: ["mapped", "repaired", "translated", "observed", "collected", "arranged"],
      objects: ["silver tide charts", "old radio signals", "strange festival masks", "tiny mechanical birds", "forgotten harbor songs", "paper stars"],
      places: ["near the winter pier", "inside a midnight library", "beside a volcanic garden", "under a glass observatory", "across a windy bridge", "around a lantern workshop"],
      details: ["while rain tapped gently on the roof", "before the town clock rang twice", "as the ocean carried distant thunder", "while children counted blue kites", "before sunrise painted the windows", "as coffee cooled beside the notebook"],
      endings: ["The discovery felt small at first, but it changed the way everyone listened.", "Nobody rushed the work, because accuracy mattered more than applause.", "By evening, the whole room had learned a new rhythm.", "The final note was simple, bright, and almost impossible to forget."],
      fallbacks: [
        "A curious mechanic built a clock that measured courage instead of minutes. Each tick reminded the village that brave work often begins quietly, with one honest attempt and a steady hand.",
        "The old map did not show treasure. It showed shortcuts between kindness, patience, and practice, which turned out to be more useful for travelers who kept losing their way."
      ]
    },
    id: {
      label: "Indonesia",
      wikiCode: "id",
      subjects: ["penjaga mercusuar", "pembuat layang-layang", "arsitek muda", "peneliti hutan", "penulis pasar malam", "perajin jam kecil"],
      verbs: ["menyusun", "mencatat", "memperbaiki", "menggambar", "menemukan", "merapikan"],
      objects: ["peta hujan bulan Juni", "catatan suara ombak", "lentera dari kaca biru", "kamus rahasia kampung", "kotak musik tua", "benih bunga langka"],
      places: ["di tepi dermaga", "dalam perpustakaan kecil", "dekat kebun bambu", "di lorong stasiun lama", "sebelum pasar dibuka", "di bawah jembatan batu"],
      details: ["saat langit berubah warna pelan-pelan", "ketika angin membawa aroma kopi", "sebelum lonceng sekolah berbunyi", "sambil mendengar langkah hujan", "ketika kota masih sangat sepi", "saat lampu jalan mulai menyala"],
      endings: ["Hasilnya tidak besar, tetapi cukup untuk membuat semua orang tersenyum.", "Ia belajar bahwa cepat saja tidak cukup jika tidak teliti.", "Sejak hari itu, latihan kecil terasa seperti petualangan baru.", "Kalimat terakhir ditulis pelan, rapi, dan penuh percaya diri."],
      fallbacks: [
        "Di sebuah kota kecil, seorang pembuat peta menggambar jalan yang hanya muncul saat hujan turun. Orang-orang mengira itu legenda, sampai seorang anak mengikuti garis biru di kertasnya.",
        "Setiap pagi, penjaga taman menukar cerita dengan burung-burung yang singgah di pagar. Dari percakapan sederhana itu, ia belajar bahwa kesabaran punya bahasa sendiri."
      ]
    },
    tet: {
      label: "Tetun",
      wikiCode: "tet",
      subjects: ["labarik ida ne'ebe hakarak aprende", "ema halo mapa", "mestre eskola ida", "peskizador foho", "ema tau matan ba tasi", "hakerek-na'in joven"],
      verbs: ["hakerek", "lee", "halibur", "hadia", "haree", "hanoin"],
      objects: ["liafuan foun sira", "istoria kona-ba rai Timor", "nota kiik kona-ba loron aban", "mapa ba dalan naruk", "karta hosi kolega sira", "hanoin diak ba familia"],
      places: ["iha uma laran", "besik tasi ibun", "iha eskola kiik", "iha merkadu kalan", "iha foho nia leten", "besik ai-hun boot"],
      details: ["wainhira anin mai neineik", "molok loro-matan sae", "wainhira labarik sira hamnasa", "sambil udan monu kleur", "molok sineta rona", "wainhira kalan sai hakmatek"],
      endings: ["Lia ne'e halo nia aprende katak rapidez presiza mos atensaun.", "Ema hotu rona ho hakmatek no komprende mensajen ne'e.", "Ita bele aprende barak husi servisu kiik ne'ebe halo ho laran.", "Loron ne'e remata ho haksolok no fiar an ba futuru."],
      fallbacks: [
        "Iha loron ida, labarik ida aprende hakerek liafuan foun ho hakmatek. Nia la halo lalais deit, maibe nia tau matan ba letra ida-idak atu sala la barak.",
        "Mestre ida konta istoria kona-ba tasi, foho, no ema sira nia servisu. Labarik sira rona didiak, depois sira koko hakerek fila-fali ho laran haksolok."
      ]
    }
  };

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function normalizePrompt(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\([^)]{0,80}\)/g, "")
      .trim();
  }

  function clampPrompt(text) {
    const cleanText = normalizePrompt(text);
    if (cleanText.length <= 350) {
      return cleanText;
    }

    const truncated = cleanText.slice(0, 350);
    const lastSentence = Math.max(truncated.lastIndexOf("."), truncated.lastIndexOf("!"), truncated.lastIndexOf("?"));
    if (lastSentence > 180) {
      return truncated.slice(0, lastSentence + 1);
    }

    const lastSpace = truncated.lastIndexOf(" ");
    return `${truncated.slice(0, lastSpace > 180 ? lastSpace : 347)}...`;
  }

  function buildLocalPrompt(language) {
    const bank = PROMPT_BANK[language] || PROMPT_BANK.en;
    const sentence = [
      randomItem(bank.subjects),
      randomItem(bank.verbs),
      randomItem(bank.objects),
      randomItem(bank.places),
      randomItem(bank.details)
    ].join(" ");

    const prompt = `${sentence}. ${randomItem(bank.endings)}`;
    if (prompt.length < 180) {
      return `${prompt} ${randomItem(bank.fallbacks)}`;
    }

    return prompt;
  }

  async function fetchInternetPrompt(language) {
    const bank = PROMPT_BANK[language] || PROMPT_BANK.en;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    try {
      const response = await window.fetch(`https://${bank.wikiCode}.wikipedia.org/api/rest_v1/page/random/summary`, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Random article request failed.");
      }

      const data = await response.json();
      const extract = clampPrompt(data.extract || "");
      if (extract.length < 120) {
        throw new Error("Random article summary was too short.");
      }

      return {
        text: extract,
        source: `Wikipedia: ${data.title || bank.label}`
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function getPrompt(options) {
    const language = options.language || "en";
    const source = options.source || "local";

    if (source === "internet") {
      try {
        return await fetchInternetPrompt(language);
      } catch (error) {
        return {
          text: buildLocalPrompt(language),
          source: "Local fallback"
        };
      }
    }

    return {
      text: buildLocalPrompt(language),
      source: "Local prompt"
    };
  }

  function getLanguageLabel(language) {
    return (PROMPT_BANK[language] || PROMPT_BANK.en).label;
  }

  window.TypeRacePrompts = {
    getPrompt,
    getLanguageLabel
  };
})();
