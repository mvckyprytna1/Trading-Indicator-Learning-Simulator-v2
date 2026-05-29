"use strict";

const Storage = {
  get(key, fallback = null) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

const APP_KEY = "tils:v1";

const routes = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "materi", label: "Materi", icon: "book-open-check" },
  { id: "simulator", label: "Simulator", icon: "activity" },
  { id: "entry", label: "Simulasi Entry", icon: "crosshair" },
  { id: "risk", label: "Manajemen Risiko", icon: "shield-check" },
  { id: "checklist", label: "Checklist Entry", icon: "list-checks" },
  { id: "cheat", label: "Cheat Sheet", icon: "panel-top" },
  { id: "studi", label: "Studi Kasus", icon: "chart-candlestick" },
  { id: "quiz", label: "Kuis", icon: "badge-help" },
  { id: "hasil", label: "Hasil", icon: "trophy" },
  { id: "glossary", label: "Kamus Trading", icon: "languages" },
  { id: "mistakes", label: "Kesalahan Pemula", icon: "triangle-alert" },
  { id: "settings", label: "Pengaturan", icon: "settings" }
];

const bottomRoutes = ["dashboard", "materi", "simulator", "entry", "hasil"];

const statusMeta = {
  safe: { label: "AMAN RELATIF", short: "AMAN", className: "badge-green", color: "#22C55E" },
  watch: { label: "WASPADA", short: "WASPADA", className: "badge-yellow", color: "#FACC15" },
  danger: { label: "TIDAK AMAN", short: "TIDAK AMAN", className: "badge-red", color: "#EF4444" },
  info: { label: "INFO", short: "INFO", className: "badge-blue", color: "#3B82F6" }
};

const progressStatus = {
  not_started: { label: "Belum dipelajari", className: "badge-muted" },
  in_progress: { label: "Sedang dipelajari", className: "badge-blue" },
  understood: { label: "Sudah paham", className: "badge-green" },
  review: { label: "Perlu ulang", className: "badge-yellow" }
};

const learningLevels = [
  { level: 1, title: "Pengenalan indikator", text: "Kenali fungsi dasar setiap indikator dan istilah pentingnya." },
  { level: 2, title: "Cara membaca indikator", text: "Latih membaca sinyal aman relatif, waspada, dan tidak aman." },
  { level: 3, title: "Simulasi kondisi", text: "Gunakan data angka untuk melihat kombinasi indikator." },
  { level: 4, title: "Studi kasus chart", text: "Bandingkan skenario chart dan indikator pendukung." },
  { level: 5, title: "Latihan multi-indikator", text: "Gabungkan trend, momentum, volume, dan risiko entry." }
];

const indicators = [
  {
    id: "candlestick",
    name: "Candlestick",
    icon: "candlestick-chart",
    level: 1,
    main: "Membaca bentuk pergerakan harga dalam satu periode.",
    usedWhen: "Dipakai untuk melihat tekanan beli, tekanan jual, rejection, breakout, dan breakdown.",
    beginner: "Candlestick seperti ringkasan cerita harga: mulai di mana, sempat ke mana, dan berakhir di mana.",
    pro: "Candlestick merangkum OHLC: open, high, low, close. Body menunjukkan jarak open-close, wick menunjukkan penolakan harga di area high atau low.",
    read: [
      "Open adalah harga pembukaan periode.",
      "High adalah harga tertinggi periode.",
      "Low adalah harga terendah periode.",
      "Close adalah harga penutupan periode.",
      "Body adalah badan candle antara open dan close.",
      "Wick atau shadow adalah ekor yang menunjukkan harga sempat ditolak.",
      "Candle hijau berarti close lebih tinggi dari open.",
      "Candle merah berarti close lebih rendah dari open.",
      "Rejection muncul saat wick panjang menolak area tertentu.",
      "Breakout berarti harga menembus resistance.",
      "Breakdown berarti harga menembus support."
    ],
    safe: ["Candle hijau body besar", "Close dekat high", "Muncul dari area support", "Didukung volume besar"],
    watch: ["Candle hijau tapi wick atas panjang", "Naik tanpa volume", "Dekat resistance"],
    danger: ["Candle merah besar", "Close dekat low", "Breakdown support", "Volume jual besar"],
    mistakes: ["Menganggap semua candle hijau pasti bagus", "Tidak melihat posisi candle terhadap support dan resistance", "Mengabaikan volume"]
  },
  {
    id: "support-resistance",
    name: "Support dan Resistance",
    icon: "layers-3",
    level: 1,
    main: "Menentukan area lantai dan plafon harga.",
    usedWhen: "Dipakai untuk mencari area pantulan, area jual, breakout, breakdown, dan risk reward.",
    beginner: "Support seperti lantai harga. Resistance seperti plafon harga.",
    pro: "Support adalah area permintaan yang sering menahan penurunan. Resistance adalah area penawaran yang sering menahan kenaikan.",
    read: [
      "Harga dekat support biasanya punya risk yang lebih terukur jika stop loss jelas.",
      "Harga dekat resistance cenderung butuh konfirmasi breakout.",
      "Support yang jebol sering berubah menjadi resistance.",
      "Resistance yang ditembus dengan volume bisa berubah menjadi support baru."
    ],
    safe: ["Harga mantul dari support", "Ada candle rejection", "Volume naik saat mantul", "Risk reward jelas"],
    watch: ["Harga dekat resistance", "Support belum diuji", "Candle kecil tidak jelas"],
    danger: ["Support jebol", "Close di bawah support", "Volume jual besar", "Support lama berubah jadi resistance"],
    mistakes: ["Menganggap support pasti mantul", "Entry tepat di bawah resistance", "Tidak menunggu close candle"]
  },
  {
    id: "moving-average",
    name: "Moving Average / MA",
    icon: "trending-up",
    level: 2,
    main: "Melihat arah trend dari rata-rata harga.",
    usedWhen: "Dipakai untuk membaca trend pendek, menengah, dan besar.",
    beginner: "MA seperti garis jalur utama. Kalau harga di atas jalur besar, trend biasanya lebih sehat.",
    pro: "MA adalah rata-rata harga dalam periode tertentu. MA50 untuk trend pendek-menengah, MA100 untuk menengah, MA200 untuk trend besar.",
    read: [
      "MA50 membaca trend pendek-menengah.",
      "MA100 membaca trend menengah.",
      "MA200 membaca trend besar.",
      "MA50 > MA100 > MA200 menunjukkan struktur bullish lebih rapi.",
      "Harga di bawah MA200 membuat trend-following lebih berisiko."
    ],
    safe: [
      "Harga berada di atas MA200",
      "MA200 mulai mendatar atau naik",
      "Harga pullback menyentuh MA200 lalu mantul",
      "Candle close tetap di atas MA200",
      "Volume beli meningkat",
      "MA50 berada di atas MA100 atau mulai cross ke atas"
    ],
    watch: [
      "Harga menyentuh MA200 tapi belum mantul",
      "Harga hanya tipis di atas MA200",
      "MA200 masih miring turun",
      "Volume kecil",
      "MA50/MA100 masih di bawah MA200"
    ],
    danger: [
      "Harga close di bawah MA200",
      "Candle breakdown MA200 dengan volume besar",
      "MA50 di bawah MA100 dan MA200",
      "MA200 miring turun tajam",
      "Harga gagal reclaim MA200"
    ],
    formula: "distanceFromMA200 = ((currentPrice - ma200) / ma200) * 100",
    mistakes: ["Mengejar harga yang sudah terlalu jauh dari MA200", "Tidak membedakan MA50, MA100, dan MA200", "Menganggap satu MA cukup untuk keputusan"]
  },
  {
    id: "volume",
    name: "Volume",
    icon: "bar-chart-3",
    level: 2,
    main: "Mengukur ramai atau tidaknya transaksi.",
    usedWhen: "Dipakai untuk memvalidasi breakout, rebound, breakdown, dan tekanan jual.",
    beginner: "Volume seperti keramaian pasar. Gerakan harga lebih meyakinkan kalau banyak transaksi ikut mendukung.",
    pro: "Volume adalah jumlah transaksi. Volume ratio membandingkan volume sekarang dengan rata-rata volume.",
    read: [
      "Volume ratio = currentVolume / averageVolume.",
      "Volume ratio > 1,5 berarti volume kuat.",
      "Volume ratio 1,0 sampai 1,5 berarti normal.",
      "Volume ratio < 1,0 berarti lemah."
    ],
    safe: ["Harga naik dan volume di atas rata-rata", "Breakout disertai volume besar", "Rebound dari support disertai volume naik"],
    watch: ["Harga naik tapi volume kecil", "Volume besar tapi candle tidak naik jauh", "Volume besar dekat resistance"],
    danger: ["Harga turun dengan volume besar", "Breakdown support dengan volume tinggi", "Banyak candle merah volume besar"],
    formula: "volumeRatio = currentVolume / averageVolume",
    mistakes: ["Melihat harga saja tanpa volume", "Menganggap volume besar selalu bullish", "Tidak membandingkan dengan rata-rata volume"]
  },
  {
    id: "macd",
    name: "MACD",
    icon: "waves",
    level: 3,
    main: "Membaca perubahan momentum trend.",
    usedWhen: "Dipakai untuk melihat momentum menguat atau melemah.",
    beginner: "MACD seperti pedal tenaga. Cross up berarti tenaga mulai masuk, cross down berarti tenaga melemah.",
    pro: "MACD terdiri dari MACD line, signal line, dan histogram. Posisi di atas garis nol biasanya lebih kuat.",
    read: ["MACD line dibandingkan dengan signal line.", "Histogram membesar berarti momentum makin kuat.", "MACD di atas nol lebih kuat daripada cross di bawah nol."],
    safe: ["MACD line cross ke atas signal line", "Histogram mulai hijau atau membesar", "MACD bergerak ke atas", "Lebih kuat jika berada di atas garis nol"],
    watch: ["MACD naik tapi masih di bawah nol", "Histogram mengecil", "Cross belum jelas"],
    danger: ["MACD line cross ke bawah signal line", "Histogram merah membesar", "MACD bergerak turun", "Momentum melemah"],
    mistakes: ["Membeli hanya karena cross tanpa melihat trend besar", "Tidak melihat histogram", "Mengabaikan posisi terhadap garis nol"]
  },
  {
    id: "rsi",
    name: "RSI",
    icon: "gauge",
    level: 3,
    main: "Membaca kekuatan momentum harga.",
    usedWhen: "Dipakai untuk melihat momentum sehat, terlalu panas, atau melemah.",
    beginner: "RSI itu seperti suhu mesin. Kalau terlalu panas, jangan asal mengejar.",
    pro: "RSI 50-65 menunjukkan momentum sehat. RSI >75 menandakan overbought dan risiko pullback meningkat.",
    read: ["RSI < 30 = oversold.", "RSI 30-50 = lemah atau netral bawah.", "RSI 50-70 = sehat atau positif.", "RSI > 70 = overbought."],
    safe: ["RSI 50 sampai 65", "RSI naik dari area 40-50", "RSI tidak terlalu panas", "Harga breakout dengan RSI sehat"],
    watch: ["RSI 65 sampai 75", "Harga naik cepat", "Mulai dekat area panas"],
    danger: ["RSI turun di bawah 50", "RSI overbought lalu turun", "Bearish divergence", "RSI di bawah 30 dalam downtrend kuat"],
    mistakes: ["Menganggap RSI overbought pasti langsung turun", "Mengabaikan trend utama", "Tidak menunggu konfirmasi harga"]
  },
  {
    id: "stochastic",
    name: "Stochastic",
    icon: "scan-line",
    level: 3,
    main: "Membaca posisi harga terhadap range.",
    usedWhen: "Dipakai untuk melihat momentum pendek dan area jenuh beli/jual.",
    beginner: "Stochastic seperti posisi harga di dalam lintasan pendek. Di atas 80 mulai panas, di bawah 20 mulai dingin.",
    pro: "Stochastic membaca posisi close terhadap range harga. Cross dari area ekstrem lebih berarti jika didukung struktur harga.",
    read: ["Di atas 80 = overbought.", "Di bawah 20 = oversold.", "20-80 = normal."],
    safe: ["Stoch cross naik dari bawah 20", "Stoch naik dan belum terlalu panas", "Didukung support dan volume"],
    watch: ["Stoch di atas 80", "Harga dekat resistance", "Momentum pendek mulai panas"],
    danger: ["Stoch cross turun dari atas 80", "Stoch turun tajam", "Harga gagal breakout"],
    mistakes: ["Entry saat stoch sudah panas tanpa melihat resistance", "Menggunakan stochastic sendirian", "Tidak membedakan momentum pendek dan trend besar"]
  },
  {
    id: "order-book",
    name: "Order Book / Bid Offer",
    icon: "list-ordered",
    level: 4,
    main: "Melihat antrian beli, antrian jual, dan spread.",
    usedWhen: "Dipakai untuk membaca likuiditas dan tekanan antrian jangka pendek.",
    beginner: "Bid adalah antrian pembeli. Offer adalah antrian penjual. Spread adalah jarak di antara keduanya.",
    pro: "Bid tebal, offer wajar, spread tipis, dan transaksi aktif menunjukkan eksekusi lebih sehat. Order book bisa berubah cepat.",
    read: ["Bid = antrian beli.", "Offer = antrian jual.", "Spread = jarak bid dan offer.", "Order book membantu membaca likuiditas, bukan kepastian arah."],
    safe: ["Spread tipis", "Bid cukup tebal di bawah harga", "Offer tidak terlalu tebal", "Transaksi aktif"],
    watch: ["Offer tebal dekat harga sekarang", "Bid mulai menipis", "Spread melebar"],
    danger: ["Bid kosong atau tipis", "Offer sangat tebal", "Spread lebar", "Saham tidak likuid"],
    mistakes: ["Terlalu percaya bid tebal", "Tidak melihat transaksi berjalan", "Masuk saham tidak likuid karena terlihat murah"]
  },
  {
    id: "ara-arb",
    name: "ARA dan ARB",
    icon: "badge-percent",
    level: 4,
    main: "Mengenali batas kenaikan dan penurunan harian.",
    usedWhen: "Dipakai untuk membaca euforia, tekanan jual, dan risiko FOMO.",
    beginner: "ARA seperti batas naik harian. ARB seperti batas turun harian.",
    pro: "ARA adalah auto rejection atas. ARB adalah auto rejection bawah. Dekat batas ekstrem berarti risiko eksekusi dan emosi pasar meningkat.",
    read: ["Harga dekat ARA sering memicu FOMO.", "Harga dekat ARB menunjukkan tekanan jual ekstrem.", "Status tetap harus dikombinasikan dengan volume, trend, dan order book."],
    safe: ["Harga tidak terlalu dekat ARA", "Masih ada ruang naik", "Tidak sedang euforia ekstrem"],
    watch: ["Harga sudah dekat ARA", "Banyak orang FOMO", "Risk reward tidak menarik"],
    danger: ["Harga dekat ARB", "Banyak tekanan jual", "Order book tidak sehat"],
    mistakes: ["Mengejar harga dekat ARA", "Mengira ARB pasti murah", "Tidak menghitung risk reward"]
  },
  {
    id: "risk-score",
    name: "Risk Score",
    icon: "shield-alert",
    level: 5,
    main: "Menggabungkan indikator menjadi skor edukatif.",
    usedWhen: "Dipakai untuk membandingkan kondisi relatif, bukan keputusan beli/jual mutlak.",
    beginner: "Risk score seperti nilai rapor kondisi. Semakin tinggi, semakin banyak indikator yang mendukung.",
    pro: "Risk score menggabungkan trend, momentum, volume, support-resistance, dan likuiditas. Skor harus dibaca bersama alasan detail.",
    read: ["75-100 = aman relatif.", "50-74 = waspada.", "0-49 = tidak aman untuk trend-following."],
    safe: ["Banyak faktor searah", "Trend besar sehat", "Momentum dan volume mendukung"],
    watch: ["Ada faktor positif dan negatif bercampur", "Harga terlalu jauh dari area aman", "Konfirmasi belum lengkap"],
    danger: ["Trend besar lemah", "Momentum melemah", "Volume jual atau breakdown dominan"],
    mistakes: ["Menganggap skor tinggi sebagai rekomendasi beli", "Tidak membaca breakdown skor", "Mengabaikan risiko posisi"]
  },
  {
    id: "entry-simulation",
    name: "Simulasi Entry",
    icon: "target",
    level: 5,
    main: "Melatih rencana entry dengan risk reward.",
    usedWhen: "Dipakai sebelum membuat rencana entry edukatif.",
    beginner: "Entry sehat bukan cuma harga menarik. Harus ada stop loss, target, dan alasan.",
    pro: "Entry dievaluasi dari risk per share, reward per share, RR ratio, jarak ke support-resistance, MA200, RSI, dan volume.",
    read: ["Risk = entry - stop loss.", "Reward = target - entry.", "RR = reward / risk.", "RR minimal 1:2 lebih sehat untuk simulasi."],
    safe: ["Entry dekat support", "Stop loss jelas", "Risk reward minimal 1:2", "Harga di atas MA200", "RSI tidak lebih dari 70", "Volume mendukung"],
    watch: ["Risk reward 1:1 sampai 1:2", "Entry agak jauh dari support", "RSI 65-75", "Harga sudah naik jauh"],
    danger: ["Entry dekat resistance", "Stop loss terlalu jauh", "Risk reward kurang dari 1:1", "Harga di bawah MA200", "RSI terlalu panas", "Volume lemah"],
    mistakes: ["Entry tanpa stop loss", "Entry dekat resistance", "Mengejar candle hijau besar"]
  }
];

const cheatSections = [
  { title: "MA", points: ["Harga di atas MA200 = trend besar lebih sehat", "Harga di bawah MA200 = trend besar lemah", "MA50 > MA100 > MA200 = bullish rapi", "MA200 turun = hati-hati"] },
  { title: "Volume", points: ["Naik + volume besar = lebih valid", "Naik + volume kecil = rawan palsu", "Turun + volume besar = tekanan jual kuat"] },
  { title: "MACD", points: ["MACD cross up = momentum menguat", "MACD cross down = momentum melemah", "Histogram membesar = tenaga makin kuat"] },
  { title: "RSI", points: ["50-65 = sehat", "65-75 = mulai panas", "> 75 = rawan pullback", "< 50 = momentum melemah"] },
  { title: "Stochastic", points: ["< 20 = oversold", "> 80 = overbought", "Cross up dari bawah = potensi rebound", "Cross down dari atas = potensi melemah"] },
  { title: "Order Book", points: ["Bid tebal = ada minat beli", "Offer tebal = ada tekanan jual", "Spread tipis = likuid", "Spread lebar = risiko eksekusi"] }
];

const glossaryTerms = [
  ["Candle", "Bentuk visual satu periode harga.", "Seperti satu catatan harian harga.", "Candle hijau besar dengan close dekat high menunjukkan tekanan beli."],
  ["Body", "Bagian tebal candle antara open dan close.", "Seperti badan cerita harga.", "Body besar berarti pergerakan open-close kuat."],
  ["Wick", "Ekor candle yang menunjukkan harga sempat ditolak.", "Seperti jejak harga yang tidak berhasil dipertahankan.", "Wick atas panjang dekat resistance berarti waspada."],
  ["Open", "Harga pembukaan periode.", "Titik mulai perjalanan harga.", "Open 3.000 lalu close 3.100 berarti candle hijau."],
  ["High", "Harga tertinggi periode.", "Titik paling atas yang sempat disentuh.", "Close dekat high sering lebih kuat."],
  ["Low", "Harga terendah periode.", "Titik paling bawah yang sempat disentuh.", "Low menembus support perlu diawasi."],
  ["Close", "Harga penutupan periode.", "Titik akhir cerita candle.", "Close di bawah MA200 membuat trend-following lebih berisiko."],
  ["Support", "Area harga yang sering menahan penurunan.", "Lantai harga.", "Harga mantul dari support 3.000 dengan volume kuat."],
  ["Resistance", "Area harga yang sering menahan kenaikan.", "Plafon harga.", "Harga dekat resistance 3.500 butuh konfirmasi breakout."],
  ["Breakout", "Harga menembus resistance.", "Harga berhasil naik melewati plafon.", "Breakout lebih valid jika volume besar."],
  ["Breakdown", "Harga menembus support ke bawah.", "Harga jatuh menembus lantai.", "Breakdown MA200 dengan volume besar tidak aman untuk trend-following."],
  ["Rejection", "Harga ditolak dari area tertentu.", "Seperti memantul karena tidak diterima pasar.", "Wick bawah panjang di support bisa menjadi rejection."],
  ["Pullback", "Harga turun sementara dalam trend naik.", "Seperti istirahat setelah naik.", "Pullback ke MA200 lalu mantul bisa sehat."],
  ["Rebound", "Harga memantul naik setelah turun.", "Seperti bola memantul dari lantai.", "Rebound dari support dengan volume naik lebih valid."],
  ["Moving Average", "Rata-rata harga dalam periode tertentu.", "Garis jalur trend.", "Harga di atas MA200 menunjukkan trend besar lebih sehat."],
  ["MA50", "Rata-rata harga 50 periode.", "Jalur trend pendek-menengah.", "MA50 di atas MA100 memberi sinyal struktur membaik."],
  ["MA100", "Rata-rata harga 100 periode.", "Jalur trend menengah.", "MA100 di atas MA200 membantu struktur bullish."],
  ["MA200", "Rata-rata harga 200 periode.", "Jalur trend besar.", "Harga di bawah MA200 tidak aman untuk trend-following."],
  ["Volume", "Jumlah transaksi.", "Keramaian pasar.", "Harga naik dengan volume lemah rawan palsu."],
  ["MACD", "Indikator momentum trend.", "Pedal tenaga trend.", "MACD cross up di atas signal line menandakan momentum menguat."],
  ["RSI", "Indikator kekuatan momentum.", "Suhu mesin harga.", "RSI 50-65 tergolong sehat."],
  ["Stochastic", "Indikator posisi harga terhadap range.", "Posisi harga di lintasan pendek.", "Stoch >80 berarti momentum pendek mulai panas."],
  ["Bid", "Antrian beli.", "Orang yang siap membeli.", "Bid tebal di bawah harga bisa menahan penurunan jangka pendek."],
  ["Offer", "Antrian jual.", "Orang yang siap menjual.", "Offer tebal dekat harga bisa menahan kenaikan."],
  ["Spread", "Jarak bid dan offer.", "Jarak tawar-menawar.", "Spread tipis lebih nyaman untuk eksekusi."],
  ["ARA", "Batas kenaikan harian.", "Batas atas hari itu.", "Harga dekat ARA sering membuat FOMO meningkat."],
  ["ARB", "Batas penurunan harian.", "Batas bawah hari itu.", "Harga dekat ARB menunjukkan tekanan jual ekstrem."],
  ["Overbought", "Kondisi momentum terlalu panas.", "Mesin terlalu panas.", "RSI >75 atau Stoch >80 perlu waspada."],
  ["Oversold", "Kondisi momentum terlalu rendah.", "Mesin terlalu dingin.", "RSI <30 tidak selalu langsung mantul dalam downtrend."],
  ["Trend-following", "Pendekatan mengikuti arah trend.", "Berjalan searah arus.", "Harga di bawah MA200 tidak aman untuk trend-following."],
  ["Risk reward", "Perbandingan potensi reward terhadap risk.", "Imbalan dibanding risiko.", "RR 1:2 berarti potensi profit dua kali risiko."],
  ["Stop loss", "Batas rugi yang direncanakan.", "Rem darurat.", "Stop loss di bawah support membuat risiko lebih jelas."],
  ["Target profit", "Area target keuntungan.", "Tujuan perjalanan.", "Target dekat resistance perlu realistis."],
  ["FOMO", "Takut tertinggal sehingga mengejar harga.", "Mengejar kereta yang sudah jalan.", "Harga jauh di atas MA200 dan RSI 80 rawan FOMO."]
];

const beginnerMistakes = [
  ["Entry hanya karena candle hijau", "Candle hijau bisa muncul dekat resistance atau tanpa volume.", "Harga hijau 5% tapi volume kecil dan wick atas panjang.", "Cek lokasi candle, volume, dan risk reward sebelum entry."],
  ["Menganggap RSI overbought pasti turun", "RSI tinggi bisa bertahan saat trend kuat.", "RSI 78 masih naik karena breakout volume besar.", "Gunakan RSI bersama trend, candle, dan resistance."],
  ["Menganggap support pasti mantul", "Support adalah area probabilitas, bukan jaminan.", "Support jebol dengan candle merah dan volume besar.", "Tunggu rejection atau close yang meyakinkan."],
  ["Mengejar harga jauh dari MA200", "Harga terlalu jauh rawan pullback.", "Distance MA200 sudah 16% dan RSI 76.", "Cari entry lebih dekat area support atau tunggu pullback."],
  ["Tidak pakai stop loss", "Tanpa stop loss, risiko sulit dikendalikan.", "Entry 3.200 tanpa batas rugi saat support jebol.", "Tentukan stop loss sebelum entry."],
  ["Entry dekat resistance", "Ruang naik sempit, risiko tertahan lebih besar.", "Entry 3.480 saat resistance 3.500.", "Pastikan RR minimal 1:2 dan ada konfirmasi breakout."],
  ["Tidak cek volume", "Harga naik tanpa volume lebih mudah gagal.", "Breakout tipis dengan volume di bawah rata-rata.", "Bandingkan volume sekarang dengan rata-rata volume."],
  ["Beda timeframe tapi disamakan", "Sinyal 1H bullish bisa kalah oleh Daily bearish.", "1H cross up tapi harga Daily masih di bawah MA200.", "Utamakan timeframe besar untuk arah utama."],
  ["Terlalu percaya order book", "Order book bisa berubah cepat dan tidak selalu mencerminkan transaksi nyata.", "Bid tebal hilang saat harga mulai turun.", "Lihat spread, transaksi aktif, dan chart."],
  ["Tidak hitung risk reward", "Entry tanpa RR bisa membuat profit kecil tetapi rugi besar.", "Risk 200, reward 100, RR hanya 0,5.", "Gunakan simulasi entry sebelum membuat rencana."]
];

const simulatorPresets = {
  safe: {
    label: "Kondisi Aman Relatif",
    data: { currentPrice: 3200, ma50: 3150, ma100: 3100, ma200: 3086, support: 3080, resistance: 3450, currentVolume: 17000000, averageVolume: 10000000, macd: 12, signal: 7, rsi: 58, stochastic: 65, bestBid: 3190, bestOffer: 3200, bidLots: 6200, offerLots: 3900 },
    scenario: "touch_ma200"
  },
  watch: {
    label: "Kondisi Waspada",
    data: { currentPrice: 3420, ma50: 3350, ma100: 3190, ma200: 3086, support: 3250, resistance: 3600, currentVolume: 10500000, averageVolume: 10000000, macd: 8, signal: 6, rsi: 72, stochastic: 78, bestBid: 3410, bestOffer: 3425, bidLots: 3600, offerLots: 5200 },
    scenario: "far_from_ma200"
  },
  danger: {
    label: "Kondisi Tidak Aman",
    data: { currentPrice: 2980, ma50: 3060, ma100: 3090, ma200: 3086, support: 3000, resistance: 3260, currentVolume: 18000000, averageVolume: 10000000, macd: -9, signal: -4, rsi: 43, stochastic: 32, bestBid: 2960, bestOffer: 2990, bidLots: 1600, offerLots: 7900 },
    scenario: "breakdown_ma200"
  },
  rebound: {
    label: "Rebound dari MA200",
    data: { currentPrice: 3200, ma50: 3160, ma100: 3110, ma200: 3086, support: 3075, resistance: 3400, currentVolume: 16000000, averageVolume: 10000000, macd: 6, signal: 3, rsi: 57, stochastic: 55, bestBid: 3190, bestOffer: 3200, bidLots: 5800, offerLots: 3600 },
    scenario: "touch_ma200"
  },
  breakdownSupport: {
    label: "Breakdown Support",
    data: { currentPrice: 2940, ma50: 3070, ma100: 3100, ma200: 3086, support: 3000, resistance: 3220, currentVolume: 19000000, averageVolume: 10000000, macd: -14, signal: -7, rsi: 38, stochastic: 24, bestBid: 2920, bestOffer: 2960, bidLots: 1200, offerLots: 8600 },
    scenario: "breakdown_support"
  },
  weakVolume: {
    label: "Naik Tapi Volume Lemah",
    data: { currentPrice: 3330, ma50: 3180, ma100: 3120, ma200: 3060, support: 3150, resistance: 3380, currentVolume: 6200000, averageVolume: 10000000, macd: 5, signal: 4, rsi: 67, stochastic: 78, bestBid: 3320, bestOffer: 3335, bidLots: 2500, offerLots: 4600 },
    scenario: "weak_volume"
  },
  hot: {
    label: "Harga Sudah Terlalu Panas",
    data: { currentPrice: 3600, ma50: 3350, ma100: 3200, ma200: 3086, support: 3320, resistance: 3650, currentVolume: 12000000, averageVolume: 10000000, macd: 16, signal: 12, rsi: 78, stochastic: 90, bestBid: 3580, bestOffer: 3600, bidLots: 4200, offerLots: 6100 },
    scenario: "overbought"
  },
  orderbook: {
    label: "Order Book Tidak Sehat",
    data: { currentPrice: 3120, ma50: 3140, ma100: 3100, ma200: 3050, support: 3040, resistance: 3260, currentVolume: 9000000, averageVolume: 10000000, macd: 1, signal: 3, rsi: 52, stochastic: 58, bestBid: 3090, bestOffer: 3135, bidLots: 900, offerLots: 7800 },
    scenario: "orderbook_pressure"
  }
};

const chartScenarios = {
  rebound_support: { label: "Rebound dari support", description: "Harga turun ke support, muncul pantulan, lalu bergerak naik dengan ruang risk yang lebih jelas.", line: [75, 69, 61, 52, 46, 51, 58, 66, 73, 79], support: 46, resistance: 84, ma200: 51, status: "safe" },
  breakdown_ma200: { label: "Breakdown MA200", description: "Harga menembus MA200 ke bawah. Untuk trend-following, ini masuk zona tidak aman.", line: [76, 72, 69, 65, 60, 54, 48, 42, 37, 34], support: 40, resistance: 82, ma200: 58, status: "danger" },
  breakout_resistance: { label: "Breakout resistance", description: "Harga menembus resistance. Lebih valid jika volume kuat dan close bertahan di atas resistance.", line: [48, 51, 53, 55, 58, 63, 72, 79, 83, 86], support: 46, resistance: 70, ma200: 52, status: "safe" },
  weak_volume: { label: "Naik tanpa volume", description: "Harga naik, tetapi validitasnya lemah jika volume tidak ikut naik.", line: [45, 50, 56, 61, 64, 67, 69, 71, 72, 73], support: 42, resistance: 75, ma200: 52, status: "watch" },
  overbought: { label: "RSI overbought", description: "Harga sudah tinggi dan momentum panas. Trend bisa tetap kuat, tetapi entry baru menjadi lebih berisiko.", line: [52, 58, 64, 70, 77, 84, 89, 92, 90, 88], support: 50, resistance: 92, ma200: 56, status: "watch" },
  macd_cross_up: { label: "MACD cross up", description: "Momentum mulai membaik. Sinyal lebih kuat jika trend besar ikut mendukung.", line: [42, 41, 43, 45, 47, 52, 57, 62, 66, 70], support: 41, resistance: 74, ma200: 49, status: "safe" },
  stoch_overbought: { label: "Stoch overbought", description: "Momentum pendek mulai panas. Jika dekat resistance, lebih baik waspada.", line: [50, 55, 61, 68, 74, 80, 84, 86, 85, 83], support: 48, resistance: 86, ma200: 54, status: "watch" },
  touch_ma200: { label: "Harga menyentuh MA200", description: "Harga berada dekat MA200. Butuh candle close dan volume konfirmasi.", line: [70, 64, 58, 53, 50, 52, 56, 61, 66, 71], support: 49, resistance: 78, ma200: 51, status: "watch" },
  breakdown_support: { label: "Breakdown support", description: "Support jebol dengan arah turun. Risiko trend-following meningkat.", line: [70, 66, 62, 58, 53, 49, 43, 37, 34, 31], support: 46, resistance: 76, ma200: 55, status: "danger" },
  far_from_ma200: { label: "Terlalu jauh dari MA200", description: "Harga di atas trend besar, tetapi jarak terlalu jauh dapat rawan pullback.", line: [54, 61, 68, 75, 82, 88, 92, 95, 94, 93], support: 61, resistance: 96, ma200: 52, status: "watch" },
  orderbook_pressure: { label: "Offer tebal", description: "Chart belum rusak, tetapi order book tidak sehat dapat menahan kenaikan jangka pendek.", line: [55, 57, 58, 60, 59, 61, 62, 60, 59, 58], support: 51, resistance: 65, ma200: 54, status: "watch" }
};

const ma200Examples = [
  { label: "Contoh 1: Jauh di atas MA200", price: 3420, ma200: 3086, currentVolume: 10000000, avgVolume: 10000000, candlePosition: "above", maDirection: "flat", bounce: false },
  { label: "Contoh 2: Baru menyentuh MA200", price: 3100, ma200: 3086, currentVolume: 9000000, avgVolume: 10000000, candlePosition: "at", maDirection: "flat", bounce: false },
  { label: "Contoh 3: Di bawah MA200", price: 3000, ma200: 3086, currentVolume: 16000000, avgVolume: 10000000, candlePosition: "below", maDirection: "down", bounce: false },
  { label: "Contoh 4: Pantulan sehat", price: 3200, ma200: 3086, currentVolume: 16000000, avgVolume: 10000000, candlePosition: "above", maDirection: "up", bounce: true }
];

const studyCases = [
  {
    id: "case-ma200-rebound",
    title: "Harga Mantul dari MA200",
    answer: "safe",
    scenario: "touch_ma200",
    data: ["Harga: 3.200", "MA200: 3.086", "MA50: 3.150", "MA100: 3.100", "Volume ratio: 1,7", "RSI: 58", "MACD > Signal", "Stoch: 65"],
    explanation: "Status aman relatif karena harga di atas MA200, volume kuat, RSI sehat, dan MACD mendukung. Tetap butuh rencana stop loss."
  },
  {
    id: "case-ma200-break",
    title: "Harga Tembus MA200 ke Bawah",
    answer: "danger",
    scenario: "breakdown_ma200",
    data: ["Harga: 2.980", "MA200: 3.086", "Volume ratio: 1,8", "RSI: 43", "MACD < Signal"],
    explanation: "Status tidak aman untuk trend-following karena harga close di bawah MA200 dengan volume tinggi dan momentum melemah."
  },
  {
    id: "case-too-hot",
    title: "Harga Sudah Terlalu Jauh Naik",
    answer: "watch",
    scenario: "far_from_ma200",
    data: ["Harga: 3.600", "MA200: 3.086", "Distance: 16,65%", "RSI: 76", "Stoch: 88"],
    explanation: "Status waspada. Trend mungkin kuat, tetapi harga sudah jauh dari MA200 dan indikator momentum mulai panas."
  }
];

const quizBank = [
  { level: 1, topic: "MA200", type: "Pilihan ganda", question: "Jika harga berada di bawah MA200, artinya apa?", options: ["Trend besar cenderung lemah untuk trend-following", "Pasti akan naik besok", "Volume selalu kuat", "RSI pasti oversold"], answer: 0, explanation: "MA200 membaca trend besar. Harga di bawah MA200 membuat skenario trend-following lebih berisiko." },
  { level: 1, topic: "RSI", type: "Pilihan ganda", question: "RSI 80 biasanya berarti apa?", options: ["Momentum mulai panas atau overbought", "Harga pasti murah", "Volume pasti kecil", "Support pasti mantul"], answer: 0, explanation: "RSI di atas 70 mulai overbought. Itu bukan jaminan turun, tetapi risiko pullback meningkat." },
  { level: 1, topic: "Volume", type: "Benar/salah", question: "Harga naik tapi volume kecil selalu valid untuk entry.", options: ["Benar", "Salah"], answer: 1, explanation: "Harga naik dengan volume kecil perlu waspada karena tenaga kenaikan belum kuat." },
  { level: 2, topic: "MACD", type: "Pilihan ganda", question: "MACD line cross ke atas signal line artinya apa?", options: ["Momentum mulai menguat", "Support pasti jebol", "Order book pasti sehat", "RSI pasti 30"], answer: 0, explanation: "MACD cross up menunjukkan momentum mulai membaik, terutama jika trend besar mendukung." },
  { level: 2, topic: "Order Book", type: "Pilihan ganda", question: "Bid tebal dan spread tipis menunjukkan apa?", options: ["Likuiditas relatif lebih sehat", "Harga pasti ARA", "Resistance pasti ditembus", "RSI overbought"], answer: 0, explanation: "Bid tebal dan spread tipis membantu eksekusi, tetapi tetap bukan kepastian arah." },
  { level: 3, topic: "Support", type: "Skenario", question: "Harga mantul dari support dengan volume ratio 1,7. Apa bacaan awalnya?", options: ["Lebih positif, tetap cek resistance dan stop loss", "Pasti langsung beli tanpa rencana", "Tidak ada informasi sama sekali", "Pasti ARB"], answer: 0, explanation: "Pantulan support dengan volume kuat positif, tetapi masih harus cek risk reward." },
  { level: 3, topic: "Stochastic", type: "Skenario", question: "Stoch 88 dekat resistance. Status yang lebih bijak?", options: ["Waspada", "Pasti aman", "Pasti oversold", "Abaikan saja"], answer: 0, explanation: "Stochastic di atas 80 dekat resistance menunjukkan momentum pendek mulai panas." },
  { level: 4, topic: "Multi-timeframe", type: "Skenario", question: "1H bullish tetapi Daily bearish. Apa sikap edukatifnya?", options: ["Tetap waspada dan jangan agresif", "Abaikan Daily", "Entry full posisi", "Tidak perlu stop loss"], answer: 0, explanation: "Timeframe besar bearish dapat melemahkan sinyal timeframe kecil." },
  { level: 4, topic: "Risk reward", type: "Pilihan ganda", question: "RR 1:2 berarti apa?", options: ["Potensi reward dua kali risiko", "Risiko dua kali reward", "Tidak ada stop loss", "Harga pasti naik"], answer: 0, explanation: "RR 1:2 berarti reward per share dua kali risk per share." },
  { level: 5, topic: "Gabungan", type: "Skenario", question: "Harga 16% di atas MA200, RSI 76, Stoch 88, volume normal. Status paling masuk akal?", options: ["Waspada", "Aman mutlak", "Tidak perlu analisis", "Pasti ARB"], answer: 0, explanation: "Trend bisa kuat, tetapi harga jauh dari MA200 dan momentum panas membuat entry baru berisiko." },
  { level: 5, topic: "Gabungan", type: "Skenario", question: "Harga di atas MA200 4%, volume ratio 1,6, RSI 58, MACD > Signal, RR 1:2. Status edukatifnya?", options: ["Aman relatif", "Tidak aman mutlak", "Waspada karena semua buruk", "Pasti jual"], answer: 0, explanation: "Banyak indikator mendukung, tetapi tetap disebut aman relatif karena bukan rekomendasi mutlak." }
];

function defaultState() {
  return {
    settings: {
      name: "Trader Pemula",
      theme: "dark",
      mode: "beginner",
      sidebarCollapsed: false
    },
    materialProgress: Object.fromEntries(indicators.map((item) => [item.id, "not_started"])),
    notes: {},
    simulations: [],
    entrySimulations: [],
    riskSimulations: [],
    quizScores: [],
    quizRuntime: { level: 1, correctStreak: 0, wrongStreak: 0 },
    studyAnswers: {},
    checklist: {
      items: {},
      last: null
    },
    activities: []
  };
}

function mergeState(saved) {
  const base = defaultState();
  if (!saved || typeof saved !== "object") return base;
  return {
    ...base,
    ...saved,
    settings: { ...base.settings, ...(saved.settings || {}) },
    materialProgress: { ...base.materialProgress, ...(saved.materialProgress || {}) },
    notes: { ...base.notes, ...(saved.notes || {}) },
    quizRuntime: { ...base.quizRuntime, ...(saved.quizRuntime || {}) },
    checklist: { ...base.checklist, ...(saved.checklist || {}) }
  };
}

const App = {
  state: mergeState(Storage.get(APP_KEY, null)),
  route: "dashboard",
  lastIndicatorResult: null,
  lastMA200Result: null,
  lastEntryResult: null,
  lastRiskResult: null,
  quizFeedback: null,
  initialized: false,
  init() {
    this.applyTheme();
    this.route = getRouteFromHash();
    renderShell();
    renderCurrentRoute();
    bindEvents();
    this.initialized = true;
  },
  save() {
    Storage.set(APP_KEY, this.state);
  },
  addActivity(text, type = "info") {
    this.state.activities.unshift({ text, type, at: new Date().toISOString() });
    this.state.activities = this.state.activities.slice(0, 12);
    this.save();
  },
  applyTheme() {
    document.documentElement.dataset.theme = this.state.settings.theme || "dark";
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());

function bindEvents() {
  window.addEventListener("hashchange", () => {
    App.route = getRouteFromHash();
    closeDrawer();
    renderShell();
    renderCurrentRoute();
  });

  document.addEventListener("click", handleClick);
  document.addEventListener("change", handleChange);
  document.addEventListener("input", handleInput);
}

function getRouteFromHash() {
  const id = (location.hash || "#dashboard").replace("#", "");
  return routes.some((route) => route.id === id) ? id : "dashboard";
}

function renderShell() {
  const sidebar = document.querySelector("#sidebar");
  const topbar = document.querySelector("#topbar");
  const bottomNav = document.querySelector("#bottomNav");
  const currentRoute = routes.find((route) => route.id === App.route) || routes[0];
  const learned = countUnderstood();
  const total = indicators.length;

  sidebar.innerHTML = `
    <div class="h-full flex flex-col p-4">
      <div class="flex items-center gap-3 pb-4 border-b" style="border-color: var(--line)">
        <div class="brand-mark"><i data-lucide="line-chart"></i></div>
        <div class="min-w-0">
          <p class="text-sm font-black leading-tight">Trading Indicator</p>
          <p class="text-xs font-bold truncate" style="color: var(--muted)">Learning Simulator</p>
        </div>
      </div>
      <div class="mt-4 p-3 flat-panel">
        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-bold" style="color: var(--muted)">Progress materi</span>
          <span class="text-xs font-black">${learned}/${total}</span>
        </div>
        ${progressBar((learned / total) * 100)}
      </div>
      <nav class="mt-4 grid gap-1 overflow-auto no-scrollbar flex-1 min-h-0 pr-1" aria-label="Menu">
        ${routes.map((route) => navLink(route)).join("")}
      </nav>
      <div class="mt-3 pt-3 text-xs leading-relaxed shrink-0 border-t" style="color: var(--muted); border-color: var(--line)">
        <p>Edukasi, bukan rekomendasi investasi.</p>
      </div>
    </div>
  `;

  topbar.innerHTML = `
    <div class="flex items-center gap-3 min-w-0">
      <button class="icon-button lg:hidden" type="button" data-action="toggle-drawer" aria-label="Buka menu">
        <i data-lucide="menu"></i>
      </button>
      <div class="min-w-0">
        <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--muted)">Trading education dashboard</p>
        <h1 class="text-lg md:text-2xl font-black truncate">${escapeHtml(currentRoute.label)}</h1>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button class="secondary-button hidden sm:inline-flex" type="button" data-action="toggle-mode">
        <i data-lucide="${App.state.settings.mode === "pro" ? "cpu" : "graduation-cap"}"></i>
        ${App.state.settings.mode === "pro" ? "Mode Pro" : "Mode Pemula"}
      </button>
      <button class="icon-button" type="button" data-action="toggle-theme" aria-label="Ganti tema" title="Ganti tema">
        <i data-lucide="${App.state.settings.theme === "dark" ? "moon" : "sun"}"></i>
      </button>
      <div class="hidden md:flex items-center gap-2 pl-2">
        <div class="w-9 h-9 rounded-lg grid place-items-center font-black" style="background: var(--card); border: 1px solid var(--line)">
          ${escapeHtml((App.state.settings.name || "T").slice(0, 1).toUpperCase())}
        </div>
        <div class="leading-tight">
          <p class="text-sm font-black">${escapeHtml(App.state.settings.name || "Trader Pemula")}</p>
          <p class="text-xs" style="color: var(--muted)">${getLearningBadge()}</p>
        </div>
      </div>
    </div>
  `;

  bottomNav.innerHTML = bottomRoutes.map((id) => {
    const route = routes.find((item) => item.id === id);
    return `
      <a href="#${route.id}" class="bottom-link ${App.route === route.id ? "is-active" : ""}">
        <i data-lucide="${route.icon}" class="w-5 h-5"></i>
        <span class="truncate">${escapeHtml(route.label.replace("Simulasi ", ""))}</span>
      </a>
    `;
  }).join("");

  refreshIcons();
}

function navLink(route) {
  return `
    <a href="#${route.id}" class="nav-link ${App.route === route.id ? "is-active" : ""}" data-route="${route.id}">
      <i data-lucide="${route.icon}" class="w-5 h-5 shrink-0"></i>
      <span class="font-bold text-sm truncate">${escapeHtml(route.label)}</span>
    </a>
  `;
}

function renderCurrentRoute() {
  const loader = document.querySelector("#pageLoader");
  const root = document.querySelector("#pageRoot");
  loader.classList.remove("hidden");
  root.classList.add("is-transitioning");

  window.setTimeout(() => {
    root.innerHTML = getPageHtml(App.route);
    loader.classList.add("hidden");
    root.classList.remove("is-transitioning");
    root.focus({ preventScroll: true });
    afterRender(App.route);
  }, 120);
}

function getPageHtml(route) {
  const pages = {
    dashboard: renderDashboard,
    materi: renderMaterials,
    simulator: renderSimulator,
    entry: renderEntry,
    risk: renderRiskManagement,
    checklist: renderChecklist,
    cheat: renderCheatSheet,
    studi: renderStudyCases,
    quiz: renderQuiz,
    hasil: renderResults,
    glossary: renderGlossary,
    mistakes: renderMistakes,
    settings: renderSettings
  };
  return (pages[route] || renderDashboard)();
}

function afterRender(route) {
  refreshIcons();
  revealNow();
  if (route === "dashboard") drawDashboardCharts();
  if (route === "simulator") drawSimulatorCharts();
  if (route === "studi") drawStudyCharts();
  if (route === "hasil") drawResultCharts();
}

function renderDashboard() {
  const simulations = App.state.simulations || [];
  const averageRisk = simulations.length ? average(simulations.map((item) => item.score || 0)) : 0;
  const quizScores = App.state.quizScores || [];
  const lastQuiz = quizScores[0];
  const understood = countUnderstood();
  const opened = Object.values(App.state.materialProgress).filter((status) => status !== "not_started").length;
  const level = getUserLevelNumber();
  const progressItems = [
    ["MA", "moving-average"], ["Volume", "volume"], ["MACD", "macd"], ["RSI", "rsi"],
    ["Stochastic", "stochastic"], ["Order Book", "order-book"], ["Support Resistance", "support-resistance"]
  ];

  return `
    ${pageHero("Selamat datang, " + escapeHtml(App.state.settings.name || "Trader Pemula"), "Belajar indikator teknikal secara visual, bertahap, dan berbasis simulasi. Status aman relatif, waspada, dan tidak aman di sini hanya alat edukasi membaca risiko.")}
    ${disclaimerBlock()}
    <section class="grid grid-cols-1 xl:grid-cols-[1.4fr_.9fr] gap-4 mt-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${metricCard("Materi selesai", `${understood}/${indicators.length}`, "book-open-check", "badge-green", `${opened} materi sudah pernah dibuka`)}
        ${metricCard("Simulasi dilakukan", String(simulations.length), "activity", "badge-blue", simulations[0] ? `Terakhir: ${simulations[0].statusLabel}` : "Belum ada simulasi")}
        ${metricCard("Rata-rata risk score", simulations.length ? `${Math.round(averageRisk)}/100` : "0/100", "gauge", "badge-yellow", "Berdasarkan riwayat simulator")}
        ${metricCard("Kuis terakhir", lastQuiz ? `${lastQuiz.correct ? "Benar" : "Salah"} L${lastQuiz.level}` : "Belum ada", "badge-help", "badge-purple", lastQuiz ? lastQuiz.topic : "Mulai kuis pertama")}
      </div>
      <div class="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        ${riskMeter(Math.round(averageRisk || (understood / indicators.length) * 82), "Level")}
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            ${badge(getLearningBadge(), "purple")}
            ${badge(App.state.settings.mode === "pro" ? "Mode Pro" : "Mode Pemula", "blue")}
          </div>
          <h2 class="text-xl font-black">Level pemahaman: ${level}/5</h2>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--muted)">Semakin banyak materi dipelajari, simulasi dijalankan, dan kuis dikerjakan, semakin matang peta belajarmu.</p>
          ${progressBar((level / 5) * 100)}
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      ${actionCard("Mulai Belajar Indikator", "Pelajari konsep dari candlestick sampai risk score dengan catatan pribadi per materi.", "book-open", "Buka Materi", "materi")}
      ${actionCard("Mulai Simulator", "Isi data indikator, gunakan preset, lalu baca alasan status secara transparan.", "activity", "Buka Simulator", "simulator")}
      ${actionCard("Cek Kondisi Saham", "Latih MA200, multi-timeframe, entry, dan checklist sebelum membuat rencana.", "crosshair", "Simulasi Entry", "entry")}
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.8fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-xl font-black">Progress materi utama</h2>
            <p class="text-sm" style="color: var(--muted)">Status tersimpan otomatis di localStorage.</p>
          </div>
          ${badge(`${understood} paham`, "green")}
        </div>
        <div class="grid gap-3">
          ${progressItems.map(([label, id]) => {
            const status = App.state.materialProgress[id] || "not_started";
            const value = status === "understood" ? 100 : status === "in_progress" ? 55 : status === "review" ? 35 : 8;
            return `
              <div class="flat-panel p-3">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <span class="font-bold">${escapeHtml(label)}</span>
                  ${progressBadge(status)}
                </div>
                ${progressBar(value)}
              </div>
            `;
          }).join("")}
        </div>
      </div>
      <div class="grid gap-4">
        <div class="glass-card p-5 canvas-card">
          <div class="flex items-center justify-between gap-3 mb-3">
            <h2 class="text-xl font-black">Mini chart dummy</h2>
            ${badge("Visual belajar", "blue")}
          </div>
          <canvas id="dashboardSparkline" class="mini-chart" aria-label="Mini chart dummy"></canvas>
        </div>
        <div class="glass-card p-5">
          <h2 class="text-xl font-black mb-3">Aktivitas terakhir</h2>
          ${renderActivityList()}
        </div>
      </div>
    </section>
  `;
}

function renderMaterials() {
  return `
    ${pageHero("Materi Indikator", "Pelajari fungsi, cara membaca, sinyal aman relatif, sinyal tidak aman, dan kesalahan umum. Gunakan Mode Pemula atau Pro sesuai kebutuhan.")}
    <section class="grid grid-cols-1 md:grid-cols-5 gap-3 mt-5">
      ${learningLevels.map((item) => `
        <div class="flat-panel p-4 scroll-reveal">
          <div class="flex items-center justify-between gap-2 mb-2">
            ${badge(`Level ${item.level}`, item.level <= getUserLevelNumber() ? "green" : "muted")}
            <i data-lucide="route" class="w-4 h-4" style="color: var(--muted)"></i>
          </div>
          <h3 class="font-black">${escapeHtml(item.title)}</h3>
          <p class="text-sm mt-2" style="color: var(--muted)">${escapeHtml(item.text)}</p>
        </div>
      `).join("")}
    </section>
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
      ${indicators.map((item) => materialCard(item)).join("")}
    </section>
  `;
}

function materialCard(item) {
  const status = App.state.materialProgress[item.id] || "not_started";
  const modeText = App.state.settings.mode === "pro" ? item.pro : item.beginner;
  return `
    <article class="glass-card p-5 hover-lift scroll-reveal">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="brand-mark shrink-0"><i data-lucide="${item.icon}"></i></div>
          <div class="min-w-0">
            <h2 class="text-lg font-black truncate">${escapeHtml(item.name)}</h2>
            <p class="text-xs font-bold" style="color: var(--muted)">Level ${item.level}</p>
          </div>
        </div>
        ${progressBadge(status)}
      </div>
      <p class="mt-4 text-sm leading-relaxed" style="color: var(--muted)">${escapeHtml(modeText)}</p>
      <div class="grid gap-2 mt-4 text-sm">
        <p><strong>Fungsi:</strong> ${escapeHtml(item.main)}</p>
        <p><strong>Kapan:</strong> ${escapeHtml(item.usedWhen)}</p>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div class="flat-panel p-2">${badge("AMAN", "green")}</div>
        <div class="flat-panel p-2">${badge("WASPADA", "yellow")}</div>
        <div class="flat-panel p-2">${badge("TIDAK AMAN", "red")}</div>
      </div>
      <div class="mt-4 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
        <select class="form-select" data-progress-id="${item.id}" aria-label="Status progress ${escapeHtml(item.name)}">
          ${Object.entries(progressStatus).map(([key, meta]) => `<option value="${key}" ${status === key ? "selected" : ""}>${meta.label}</option>`).join("")}
        </select>
        <button class="primary-button" type="button" data-action="open-indicator" data-id="${item.id}">
          <i data-lucide="book-open"></i>
          Pelajari
        </button>
      </div>
    </article>
  `;
}

function renderSimulator() {
  const presetButtons = Object.entries(simulatorPresets).map(([key, preset]) => `
    <button class="secondary-button" type="button" data-action="fill-preset" data-preset="${key}">
      ${escapeHtml(preset.label)}
    </button>
  `).join("");

  return `
    ${pageHero("Simulator Indikator", "Masukkan data teknikal, lihat risk score 0-100, dan baca alasan status. Semua hasil berbasis kombinasi indikator, bukan satu indikator saja.")}
    ${disclaimerBlock()}
    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.75fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 class="text-xl font-black">Input indikator</h2>
            <p class="text-sm" style="color: var(--muted)">Format angka menerima 3420, 3.420, 10,82, atau 10.82.</p>
          </div>
          <button class="secondary-button" type="button" data-action="reset-simulator">
            <i data-lucide="rotate-ccw"></i>
            Reset
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">${presetButtons}</div>
        <form id="simulatorForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${numberInput("currentPrice", "Harga sekarang", "3.420")}
          ${numberInput("ma50", "MA50", "3.300")}
          ${numberInput("ma100", "MA100", "3.180")}
          ${numberInput("ma200", "MA200", "3.086")}
          ${numberInput("support", "Support terdekat", "3.200")}
          ${numberInput("resistance", "Resistance terdekat", "3.600")}
          ${numberInput("currentVolume", "Volume sekarang", "12.000.000")}
          ${numberInput("averageVolume", "Rata-rata volume 20", "10.000.000")}
          ${numberInput("macd", "MACD line", "8")}
          ${numberInput("signal", "Signal line", "5")}
          ${numberInput("rsi", "RSI", "58")}
          ${numberInput("stochastic", "Stochastic", "62")}
          ${numberInput("bestBid", "Bid terbaik", "3.410")}
          ${numberInput("bestOffer", "Offer terbaik", "3.420")}
          ${numberInput("bidLots", "Total bid lot", "5.000")}
          ${numberInput("offerLots", "Total offer lot", "3.500")}
        </form>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="primary-button" type="button" data-action="analyze-simulator">
            <i data-lucide="scan-search"></i>
            Analisis
          </button>
          <button class="secondary-button" type="button" data-action="fill-preset" data-preset="safe">
            <i data-lucide="wand-sparkles"></i>
            Gunakan Contoh Data
          </button>
          <button class="secondary-button" type="button" data-action="save-simulation">
            <i data-lucide="save"></i>
            Simpan Simulasi
          </button>
          <button class="secondary-button" type="button" data-action="show-last-explanation">
            <i data-lucide="circle-help"></i>
            Lihat Penjelasan
          </button>
        </div>
      </div>
      <div id="simulatorResult" class="glass-card p-5">${renderSimulatorResult()}</div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[.9fr_1fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 class="text-xl font-black">Simulator chart mini</h2>
            <p class="text-sm" style="color: var(--muted)">Pilih skenario untuk melihat visual dummy dan penjelasan otomatis.</p>
          </div>
          <select id="chartScenario" class="form-select max-w-xs" data-action-change="chart-scenario">
            ${Object.entries(chartScenarios).map(([key, scenario]) => `<option value="${key}">${escapeHtml(scenario.label)}</option>`).join("")}
          </select>
        </div>
        <canvas id="scenarioChart" class="mini-chart" aria-label="Chart skenario"></canvas>
        <div id="scenarioExplanation" class="flat-panel p-4 mt-3"></div>
      </div>
      <div class="glass-card p-5">
        <h2 class="text-xl font-black">Multi-timeframe simulator</h2>
        <p class="text-sm mt-1" style="color: var(--muted)">5M/30M cocok untuk timing pendek, 1H/4H untuk swing pendek, Daily untuk trend utama. Jangan entry hanya dari 1 timeframe.</p>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4" id="timeframeForm">
          ${["5M", "30M", "1H", "4H", "Daily"].map((tf) => `
            <label class="input-label">${tf}
              <select class="form-select" data-timeframe="${tf}">
                <option value="bullish">Bullish</option>
                <option value="neutral" ${tf === "30M" ? "selected" : ""}>Netral</option>
                <option value="bearish" ${tf === "Daily" ? "selected" : ""}>Bearish</option>
              </select>
            </label>
          `).join("")}
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <button class="primary-button" type="button" data-action="analyze-timeframe">
            <i data-lucide="layers"></i>
            Analisis Timeframe
          </button>
          <button class="secondary-button" type="button" data-action="timeframe-preset-align">Preset Searah</button>
          <button class="secondary-button" type="button" data-action="timeframe-preset-conflict">Preset Bertentangan</button>
        </div>
        <div id="timeframeResult" class="flat-panel p-4 mt-4">${renderTimeframeResult()}</div>
      </div>
    </section>

    <section class="glass-card p-5 mt-5">
      <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 class="text-xl font-black">Simulasi MA200: Aman atau Tidak?</h2>
          <p class="text-sm" style="color: var(--muted)">Modul khusus untuk membaca jarak harga dari MA200 dan konfirmasi volume.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          ${ma200Examples.map((example, index) => `<button class="secondary-button" type="button" data-action="fill-ma-example" data-index="${index}">${escapeHtml(example.label)}</button>`).join("")}
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_.9fr] gap-4">
        <div>
          <form id="ma200Form" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${numberInput("maPrice", "Harga sekarang", "3.420")}
            ${numberInput("maOnly200", "MA200", "3.086")}
            ${numberInput("maVolume", "Volume sekarang", "10.000.000")}
            ${numberInput("maAvgVolume", "Rata-rata volume", "10.000.000")}
            <label class="input-label">Posisi candle
              <select id="maCandlePosition" class="form-select">
                <option value="above">Close di atas MA200</option>
                <option value="at">Close tepat di MA200</option>
                <option value="below">Close di bawah MA200</option>
              </select>
            </label>
            <label class="input-label">Arah MA200
              <select id="maDirection" class="form-select">
                <option value="up">Naik</option>
                <option value="flat" selected>Datar</option>
                <option value="down">Turun</option>
              </select>
            </label>
            <label class="input-label sm:col-span-2 lg:col-span-3">
              <span class="flex items-center gap-2">
                <input id="maBounce" type="checkbox" class="w-4 h-4 accent-green-500">
                Ada candle pantulan/rejection dari area MA200
              </span>
            </label>
          </form>
          <button class="primary-button mt-4" type="button" data-action="analyze-ma200">
            <i data-lucide="gauge"></i>
            Analisis MA200
          </button>
        </div>
        <div id="ma200Result" class="flat-panel p-4">${renderMA200Result()}</div>
      </div>
    </section>
  `;
}

function renderEntry() {
  return `
    ${pageHero("Simulasi Entry", "Latih rencana entry dengan risk per share, reward per share, risk reward ratio, jarak support-resistance, MA200, RSI, dan volume.")}
    ${disclaimerBlock()}
    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.8fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 class="text-xl font-black">Input rencana entry</h2>
            <p class="text-sm" style="color: var(--muted)">Validasi dibuat untuk skenario buy: stop loss harus di bawah entry dan target di atas entry.</p>
          </div>
          <button class="secondary-button" type="button" data-action="fill-entry-example">
            <i data-lucide="wand-sparkles"></i>
            Contoh
          </button>
        </div>
        <form id="entryForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${numberInput("entryPrice", "Harga entry rencana", "3.200")}
          ${numberInput("entrySupport", "Support", "3.080")}
          ${numberInput("entryResistance", "Resistance", "3.500")}
          ${numberInput("stopLoss", "Stop loss", "3.050")}
          ${numberInput("targetProfit", "Target profit", "3.500")}
          ${numberInput("entryCurrentPrice", "Harga sekarang", "3.180")}
          ${numberInput("entryMA200", "MA200", "3.086")}
          ${numberInput("entryRSI", "RSI", "58")}
          ${numberInput("entryVolumeRatio", "Volume ratio", "1,6")}
        </form>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="primary-button" type="button" data-action="analyze-entry"><i data-lucide="target"></i>Analisis Entry</button>
          <button class="secondary-button" type="button" data-action="reset-entry"><i data-lucide="rotate-ccw"></i>Reset</button>
          <button class="secondary-button" type="button" data-action="save-entry"><i data-lucide="save"></i>Simpan Entry</button>
        </div>
      </div>
      <div id="entryResult" class="glass-card p-5">${renderEntryResult()}</div>
    </section>
  `;
}

function renderRiskManagement() {
  return `
    ${pageHero("Manajemen Risiko", "Hitung simulasi ukuran posisi dari modal, stop loss, target profit, dan batas risiko per transaksi.")}
    ${disclaimerBlock()}
    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.8fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <form id="riskForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${numberInput("capital", "Modal", "10.000.000")}
          ${numberInput("riskEntryPrice", "Harga entry", "3.200")}
          ${numberInput("riskStopLoss", "Stop loss", "3.050")}
          ${numberInput("riskTargetProfit", "Target profit", "3.500")}
          ${numberInput("riskPercent", "Risiko maksimal (%)", "2")}
          ${numberInput("lotSize", "Lot size", "100")}
        </form>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="primary-button" type="button" data-action="analyze-risk"><i data-lucide="calculator"></i>Hitung Risiko</button>
          <button class="secondary-button" type="button" data-action="fill-risk-example"><i data-lucide="wand-sparkles"></i>Contoh</button>
          <button class="secondary-button" type="button" data-action="save-risk"><i data-lucide="save"></i>Simpan</button>
        </div>
      </div>
      <div id="riskResult" class="glass-card p-5">${renderRiskResult()}</div>
    </section>
  `;
}

function renderChecklist() {
  const items = [
    "Harga di atas MA200?",
    "MA200 datar atau naik?",
    "Harga dekat support?",
    "Tidak terlalu dekat resistance?",
    "Volume mendukung?",
    "RSI tidak terlalu panas?",
    "MACD mendukung?",
    "Stochastic tidak overbought ekstrem?",
    "Risk reward minimal 1:2?",
    "Stop loss jelas?",
    "Tidak FOMO?"
  ];
  const checked = App.state.checklist.items || {};
  const percent = checklistPercent();
  const status = statusFromChecklist(percent);

  return `
    ${pageHero("Checklist Sebelum Entry", "Centang kondisi yang terpenuhi. Hasil checklist membantu membaca kesiapan rencana, bukan memastikan hasil transaksi.")}
    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.55fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${items.map((item, index) => `
            <label class="flat-panel p-4 flex items-start gap-3 cursor-pointer hover-lift">
              <input type="checkbox" class="w-5 h-5 mt-0.5 accent-green-500" data-checklist-index="${index}" ${checked[index] ? "checked" : ""}>
              <span class="font-bold">${escapeHtml(item)}</span>
            </label>
          `).join("")}
        </div>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="secondary-button" type="button" data-action="reset-checklist"><i data-lucide="rotate-ccw"></i>Reset</button>
          <button class="primary-button" type="button" data-action="save-checklist"><i data-lucide="save"></i>Simpan Checklist</button>
        </div>
      </div>
      <div class="glass-card p-5">
        <h2 class="text-xl font-black mb-4">Hasil checklist</h2>
        <div class="flex items-center justify-center">${riskMeter(percent, "Checklist")}</div>
        <div class="mt-4">${statusBadge(status)}</div>
        <p class="text-sm mt-3 leading-relaxed" style="color: var(--muted)">${checklistExplanation(percent)}</p>
        ${progressBar(percent)}
      </div>
    </section>
  `;
}

function renderCheatSheet() {
  return `
    ${pageHero("Cheat Sheet", "Ringkasan cepat untuk membaca indikator teknikal tanpa menganggap indikator selalu benar.")}
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
      ${cheatSections.map((section) => `
        <article class="glass-card p-5 hover-lift scroll-reveal">
          <h2 class="text-xl font-black">${escapeHtml(section.title)}</h2>
          <ul class="mt-4 grid gap-3">
            ${section.points.map((point) => `<li class="flex gap-2 text-sm"><i data-lucide="check-circle-2" class="w-4 h-4 shrink-0" style="color: var(--green)"></i><span>${escapeHtml(point)}</span></li>`).join("")}
          </ul>
        </article>
      `).join("")}
    </section>
  `;
}

function renderStudyCases() {
  return `
    ${pageHero("Studi Kasus Interaktif", "Baca data indikator, pilih status, lalu lihat pembahasan. Skor studi kasus disimpan otomatis.")}
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5">
      ${studyCases.map((item) => studyCaseCard(item)).join("")}
    </section>
  `;
}

function studyCaseCard(item) {
  const answer = App.state.studyAnswers[item.id];
  const answered = Boolean(answer);
  const correct = answered && answer.choice === item.answer;
  return `
    <article class="glass-card p-5 scroll-reveal">
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-xl font-black">${escapeHtml(item.title)}</h2>
        ${answered ? badge(correct ? "Benar" : "Perlu ulang", correct ? "green" : "yellow") : badge("Belum dijawab", "muted")}
      </div>
      <canvas id="study-${item.id}" data-scenario="${item.scenario}" class="mini-chart mt-4" aria-label="Chart ${escapeHtml(item.title)}"></canvas>
      <div class="grid gap-2 mt-4">
        ${item.data.map((line) => `<div class="flat-panel p-2 text-sm font-bold">${escapeHtml(line)}</div>`).join("")}
      </div>
      <p class="font-black mt-4">Menurut kamu statusnya apa?</p>
      <div class="grid gap-2 mt-3">
        ${["safe", "watch", "danger"].map((choice) => `
          <button class="secondary-button justify-start" type="button" data-action="answer-case" data-case="${item.id}" data-choice="${choice}">
            ${statusBadge(choice)}
          </button>
        `).join("")}
      </div>
      ${answered ? `
        <div class="flat-panel p-4 mt-4">
          <p class="font-black">Jawaban: ${statusBadge(item.answer)}</p>
          <p class="text-sm mt-2 leading-relaxed" style="color: var(--muted)">${escapeHtml(item.explanation)}</p>
        </div>
      ` : ""}
    </article>
  `;
}

function renderQuiz() {
  const runtime = App.state.quizRuntime;
  const question = getCurrentQuizQuestion();
  const history = App.state.quizScores || [];
  const accuracy = history.length ? Math.round((history.filter((item) => item.correct).length / history.length) * 100) : 0;
  const weakTopic = getWeakTopic();

  return `
    ${pageHero("Kuis Adaptif", "Jika benar 3 kali berturut-turut, level naik. Jika salah 2 kali berturut-turut, level turun.")}
    <section class="grid grid-cols-1 xl:grid-cols-[.7fr_1fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <h2 class="text-xl font-black mb-4">Ringkasan kuis</h2>
        <div class="grid gap-3">
          ${metricRow("Level aktif", `Level ${runtime.level}`)}
          ${metricRow("Skor tersimpan", String(history.length))}
          ${metricRow("Akurasi", `${accuracy}%`)}
          ${metricRow("Materi lemah", weakTopic || "Belum terdeteksi")}
        </div>
        <div class="mt-4">${progressBar(accuracy)}</div>
        <p class="text-sm mt-4" style="color: var(--muted)">Rekomendasi: ${weakTopic ? `ulang materi ${escapeHtml(weakTopic)}.` : "mulai dari MA200, Volume, RSI, dan MACD."}</p>
      </div>
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          ${badge(`Level ${question.level}`, "blue")}
          ${badge(question.type, "purple")}
        </div>
        <h2 class="text-2xl font-black mt-4">${escapeHtml(question.question)}</h2>
        <div class="grid gap-3 mt-5">
          ${question.options.map((option, index) => `
            <button class="secondary-button justify-start text-left" type="button" data-action="quiz-answer" data-index="${index}">
              <span class="w-7 h-7 rounded-full grid place-items-center shrink-0" style="background: var(--card-strong)">${index + 1}</span>
              <span>${escapeHtml(option)}</span>
            </button>
          `).join("")}
        </div>
        ${App.quizFeedback ? `
          <div class="flat-panel p-4 mt-5">
            <div class="mb-2">${badge(App.quizFeedback.correct ? "Benar" : "Salah", App.quizFeedback.correct ? "green" : "red")}</div>
            <p class="text-sm leading-relaxed" style="color: var(--muted)">${escapeHtml(App.quizFeedback.explanation)}</p>
            <button class="primary-button mt-4" type="button" data-action="next-quiz"><i data-lucide="arrow-right"></i>Soal Berikutnya</button>
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function renderResults() {
  const simulations = App.state.simulations || [];
  const entry = App.state.entrySimulations || [];
  const risk = App.state.riskSimulations || [];
  const quizzes = App.state.quizScores || [];
  const studyAnswers = Object.values(App.state.studyAnswers || {});
  const quizAvg = quizzes.length ? Math.round((quizzes.filter((item) => item.correct).length / quizzes.length) * 100) : 0;
  const opened = Object.entries(App.state.materialProgress).filter(([, status]) => status !== "not_started");

  return `
    ${pageHero("Hasil Belajar", "Pantau progres materi, skor kuis, riwayat simulasi, catatan pribadi, dan rekomendasi belajar ulang.")}
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
      ${metricCard("Total kuis", String(quizzes.length), "badge-help", "badge-purple", `Akurasi ${quizAvg}%`)}
      ${metricCard("Materi dibuka", String(opened.length), "book-open", "badge-blue", `${countUnderstood()} sudah paham`)}
      ${metricCard("Total simulasi", String(simulations.length + entry.length + risk.length), "activity", "badge-green", "Simulator, entry, dan risiko")}
      ${metricCard("Studi kasus", String(studyAnswers.length), "chart-candlestick", "badge-yellow", `${studyAnswers.filter((item) => item.correct).length} benar`)}
    </section>
    <section class="grid grid-cols-1 xl:grid-cols-[1fr_.75fr] gap-4 mt-5">
      <div class="glass-card p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h2 class="text-xl font-black">Riwayat simulator</h2>
          <div class="flex gap-2 flex-wrap">
            <button class="secondary-button" type="button" data-action="export-json"><i data-lucide="download"></i>Export JSON</button>
            <button class="secondary-button" type="button" data-action="export-csv"><i data-lucide="file-down"></i>Export CSV</button>
          </div>
        </div>
        ${simulations.length ? historyTable(simulations) : emptyState("Belum ada simulasi. Coba jalankan simulator pertama kamu.")}
      </div>
      <div class="grid gap-4">
        <div class="glass-card p-5">
          <h2 class="text-xl font-black">Rekomendasi berikutnya</h2>
          <p class="text-sm mt-2 leading-relaxed" style="color: var(--muted)">${getRecommendation()}</p>
        </div>
        <div class="glass-card p-5">
          <h2 class="text-xl font-black">Simulasi terakhir</h2>
          ${simulations[0] ? `
            <div class="flex items-center gap-4 mt-4">
              ${riskMeter(simulations[0].score, "Score")}
              <div>
                ${statusBadge(simulations[0].status)}
                <p class="text-sm mt-2" style="color: var(--muted)">${escapeHtml(simulations[0].summary)}</p>
              </div>
            </div>
          ` : emptyState("Belum ada data simulator.")}
        </div>
        <div class="glass-card p-5">
          <h2 class="text-xl font-black">Mini chart hasil</h2>
          <canvas id="resultChart" class="mini-chart mt-3"></canvas>
        </div>
      </div>
    </section>
  `;
}

function renderGlossary() {
  return `
    ${pageHero("Kamus Trading", "Definisi singkat, analogi sederhana, dan contoh penggunaan istilah yang sering muncul di aplikasi.")}
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
      ${glossaryTerms.map(([term, definition, analogy, example]) => `
        <article class="glass-card p-5 hover-lift scroll-reveal">
          <h2 class="text-xl font-black">${escapeHtml(term)}</h2>
          <div class="grid gap-3 mt-4 text-sm">
            <p><strong>Definisi:</strong> ${escapeHtml(definition)}</p>
            <p><strong>Analogi:</strong> ${escapeHtml(analogy)}</p>
            <p style="color: var(--muted)"><strong>Contoh:</strong> ${escapeHtml(example)}</p>
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderMistakes() {
  return `
    ${pageHero("Kesalahan Pemula", "Kesalahan yang sering terjadi saat membaca indikator teknikal dan cara menghindarinya.")}
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      ${beginnerMistakes.map(([title, explanation, example, avoid], index) => `
        <article class="glass-card p-5 scroll-reveal">
          <div class="flex items-start gap-3">
            <span class="w-9 h-9 rounded-lg grid place-items-center font-black shrink-0" style="background: rgba(239,68,68,0.14); color: var(--red)">${index + 1}</span>
            <div>
              <h2 class="text-lg font-black">${escapeHtml(title)}</h2>
              <p class="text-sm mt-2" style="color: var(--muted)">${escapeHtml(explanation)}</p>
            </div>
          </div>
          <div class="grid gap-3 mt-4 text-sm">
            <div class="flat-panel p-3"><strong>Contoh:</strong> ${escapeHtml(example)}</div>
            <div class="flat-panel p-3"><strong>Cara menghindari:</strong> ${escapeHtml(avoid)}</div>
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderSettings() {
  return `
    ${pageHero("Pengaturan", "Atur nama, mode belajar, tema, dan data lokal. Semua preferensi tersimpan di browser kamu.")}
    <section class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
      <div class="glass-card p-5">
        <h2 class="text-xl font-black mb-4">Profil belajar</h2>
        <label class="input-label">Nama user
          <input id="settingName" class="form-input" value="${escapeAttr(App.state.settings.name || "")}" placeholder="Nama kamu">
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button class="secondary-button ${App.state.settings.mode === "beginner" ? "ring-2 ring-blue-500" : ""}" type="button" data-action="set-mode" data-mode="beginner">
            <i data-lucide="graduation-cap"></i>
            Mode Pemula
          </button>
          <button class="secondary-button ${App.state.settings.mode === "pro" ? "ring-2 ring-blue-500" : ""}" type="button" data-action="set-mode" data-mode="pro">
            <i data-lucide="cpu"></i>
            Mode Pro
          </button>
          <button class="secondary-button ${App.state.settings.theme === "dark" ? "ring-2 ring-blue-500" : ""}" type="button" data-action="set-theme" data-theme="dark">
            <i data-lucide="moon"></i>
            Dark mode
          </button>
          <button class="secondary-button ${App.state.settings.theme === "light" ? "ring-2 ring-blue-500" : ""}" type="button" data-action="set-theme" data-theme="light">
            <i data-lucide="sun"></i>
            Light mode
          </button>
        </div>
        <button class="primary-button mt-4" type="button" data-action="save-settings">
          <i data-lucide="save"></i>
          Simpan Pengaturan
        </button>
      </div>
      <div class="glass-card p-5">
        <h2 class="text-xl font-black">Data lokal</h2>
        <p class="text-sm mt-2" style="color: var(--muted)">Progress materi, skor kuis, riwayat simulator, catatan pribadi, checklist, dan studi kasus tersimpan di localStorage.</p>
        <div class="grid gap-3 mt-4">
          ${metricRow("Catatan pribadi", String(Object.keys(App.state.notes || {}).length))}
          ${metricRow("Riwayat simulator", String((App.state.simulations || []).length))}
          ${metricRow("Riwayat entry", String((App.state.entrySimulations || []).length))}
          ${metricRow("Riwayat risiko", String((App.state.riskSimulations || []).length))}
        </div>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="secondary-button" type="button" data-action="export-json"><i data-lucide="download"></i>Export JSON</button>
          <button class="danger-button" type="button" data-action="clear-data"><i data-lucide="trash-2"></i>Reset Semua Data</button>
        </div>
      </div>
    </section>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action !== "answer-case" && action !== "quiz-answer") {
    event.preventDefault();
  }

  const actions = {
    "toggle-drawer": () => toggleDrawer(),
    "toggle-theme": () => toggleTheme(),
    "toggle-mode": () => toggleMode(),
    "open-indicator": () => openIndicator(target.dataset.id),
    "mark-understood": () => markIndicator(target.dataset.id, "understood"),
    "analyze-simulator": () => analyzeSimulator(),
    "reset-simulator": () => resetSimulator(),
    "fill-preset": () => fillSimulatorPreset(target.dataset.preset),
    "save-simulation": () => saveSimulation(),
    "show-last-explanation": () => showLastExplanation(),
    "analyze-ma200": () => analyzeMA200(),
    "fill-ma-example": () => fillMA200Example(Number(target.dataset.index)),
    "analyze-timeframe": () => analyzeTimeframe(),
    "timeframe-preset-align": () => setTimeframePreset("align"),
    "timeframe-preset-conflict": () => setTimeframePreset("conflict"),
    "analyze-entry": () => analyzeEntry(),
    "fill-entry-example": () => fillEntryExample(),
    "reset-entry": () => resetEntry(),
    "save-entry": () => saveEntry(),
    "analyze-risk": () => analyzeRisk(),
    "fill-risk-example": () => fillRiskExample(),
    "save-risk": () => saveRisk(),
    "reset-checklist": () => resetChecklist(),
    "save-checklist": () => saveChecklist(),
    "answer-case": () => answerStudyCase(target.dataset.case, target.dataset.choice),
    "quiz-answer": () => answerQuiz(Number(target.dataset.index)),
    "next-quiz": () => nextQuiz(),
    "export-json": () => exportData("json"),
    "export-csv": () => exportData("csv"),
    "clear-data": () => clearData(),
    "save-settings": () => saveSettings(),
    "set-mode": () => setMode(target.dataset.mode),
    "set-theme": () => setTheme(target.dataset.theme)
  };

  if (actions[action]) actions[action]();
}

function handleChange(event) {
  const progressSelect = event.target.closest("[data-progress-id]");
  if (progressSelect) {
    const id = progressSelect.dataset.progressId;
    App.state.materialProgress[id] = progressSelect.value;
    App.addActivity(`Progress ${getIndicator(id).name}: ${progressStatus[progressSelect.value].label}`, "progress");
    App.save();
    renderShell();
    renderCurrentRoute();
    return;
  }

  const checklist = event.target.closest("[data-checklist-index]");
  if (checklist) {
    App.state.checklist.items[checklist.dataset.checklistIndex] = checklist.checked;
    App.state.checklist.last = {
      percent: checklistPercent(),
      at: new Date().toISOString()
    };
    App.save();
    renderCurrentRoute();
    return;
  }

  if (event.target.id === "chartScenario") {
    updateScenarioChart();
  }
}

function handleInput(event) {
  const note = event.target.closest("[data-note-id]");
  if (note) {
    App.state.notes[note.dataset.noteId] = note.value;
    App.save();
  }
}

function toggleDrawer() {
  const shell = document.querySelector("#appShell");
  const overlay = document.querySelector("#drawerOverlay");
  shell.classList.toggle("drawer-open");
  overlay.classList.toggle("hidden", !shell.classList.contains("drawer-open"));
}

function closeDrawer() {
  document.querySelector("#appShell").classList.remove("drawer-open");
  document.querySelector("#drawerOverlay").classList.add("hidden");
}

function toggleTheme() {
  App.state.settings.theme = App.state.settings.theme === "dark" ? "light" : "dark";
  App.applyTheme();
  App.save();
  renderShell();
  toast(`Tema ${App.state.settings.theme === "dark" ? "dark" : "light"} aktif.`, "success");
}

function setTheme(theme) {
  App.state.settings.theme = theme;
  App.applyTheme();
  App.save();
  renderShell();
  renderCurrentRoute();
}

function toggleMode() {
  App.state.settings.mode = App.state.settings.mode === "pro" ? "beginner" : "pro";
  App.save();
  renderShell();
  renderCurrentRoute();
  toast(App.state.settings.mode === "pro" ? "Mode Pro aktif." : "Mode Pemula aktif.", "success");
}

function setMode(mode) {
  App.state.settings.mode = mode;
  App.save();
  renderShell();
  renderCurrentRoute();
}

function saveSettings() {
  const name = document.querySelector("#settingName")?.value.trim();
  if (name) App.state.settings.name = name;
  App.save();
  renderShell();
  renderCurrentRoute();
  toast("Pengaturan tersimpan.", "success");
}

function openIndicator(id) {
  const item = getIndicator(id);
  if (!item) return;
  if (App.state.materialProgress[id] === "not_started") {
    App.state.materialProgress[id] = "in_progress";
    App.addActivity(`Mulai belajar ${item.name}`, "material");
  }
  App.save();

  const modeText = App.state.settings.mode === "pro" ? item.pro : item.beginner;
  openModal(`
    <div class="pr-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="brand-mark"><i data-lucide="${item.icon}"></i></div>
        <div>
          <p class="text-sm font-bold" style="color: var(--muted)">Level ${item.level}</p>
          <h2 id="modalTitle" class="text-2xl font-black">${escapeHtml(item.name)}</h2>
        </div>
      </div>
      <p class="text-base leading-relaxed" style="color: var(--muted)">${escapeHtml(modeText)}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        ${detailList("Cara membaca", item.read, "blue")}
        ${detailList("Kesalahan pemula", item.mistakes, "yellow")}
        ${detailList("Sinyal aman relatif", item.safe, "green")}
        ${detailList("Sinyal tidak aman", item.danger, "red")}
      </div>
      <div class="flat-panel p-4 mt-5">
        <h3 class="font-black mb-2">Waspada jika</h3>
        <ul class="grid gap-2 text-sm">${item.watch.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul>
      </div>
      ${item.formula ? `<div class="flat-panel p-4 mt-5"><h3 class="font-black mb-2">Rumus Mode Pro</h3><code class="text-sm">${escapeHtml(item.formula)}</code></div>` : ""}
      <label class="input-label mt-5">Catatan Saya
        <textarea class="form-textarea" data-note-id="${item.id}" placeholder="Contoh: Kalau harga di atas MA200 tapi RSI 80, jangan FOMO.">${escapeHtml(App.state.notes[item.id] || "")}</textarea>
      </label>
      <div class="flex flex-wrap gap-2 mt-5">
        <button class="primary-button" type="button" data-action="mark-understood" data-id="${item.id}">
          <i data-lucide="check"></i>
          Tandai Sudah Paham
        </button>
      </div>
    </div>
  `);
  refreshIcons();
}

function markIndicator(id, status) {
  const item = getIndicator(id);
  App.state.materialProgress[id] = status;
  App.addActivity(`${item.name} ditandai ${progressStatus[status].label}`, "material");
  App.save();
  closeModal();
  renderShell();
  renderCurrentRoute();
  toast("Progress materi tersimpan.", "success");
}

function analyzeSimulator() {
  const values = getSimulatorValues();
  const errors = validateSimulator(values);
  if (errors.length) {
    toast(errors[0], "error");
    return;
  }
  App.lastIndicatorResult = calculateSimulator(values);
  document.querySelector("#simulatorResult").innerHTML = renderSimulatorResult();
  refreshIcons();
  toast("Analisis indikator selesai.", "success");
}

function calculateSimulator(v) {
  let score = 0;
  const rows = [];
  const supports = [];
  const weakens = [];
  const notes = [];
  const volumeRatio = v.currentVolume / v.averageVolume;
  const distanceFromMA200 = ((v.currentPrice - v.ma200) / v.ma200) * 100;
  const distanceToSupport = ((v.currentPrice - v.support) / v.currentPrice) * 100;
  const distanceToResistance = ((v.resistance - v.currentPrice) / v.currentPrice) * 100;
  const spreadPercent = ((v.bestOffer - v.bestBid) / v.currentPrice) * 100;

  function add(factor, value, reason, type = "support") {
    score += value;
    rows.push({ factor, value, reason });
    if (type === "weak" || value < 0) weakens.push(reason);
    else supports.push(reason);
  }

  if (v.currentPrice > v.ma200) add("Harga di atas MA200", 15, `Harga berada ${formatPercentID(distanceFromMA200)} di atas MA200, trend besar lebih sehat.`);
  else add("Harga di bawah MA200", -20, "Harga berada di bawah MA200, tidak aman untuk trend-following.", "weak");

  if (v.currentPrice > v.ma50) add("Harga di atas MA50", 10, "Harga juga berada di atas MA50, trend pendek-menengah mendukung.");
  if (v.ma50 > v.ma100) add("MA50 > MA100", 10, "MA50 di atas MA100, struktur trend mulai rapi.");
  if (v.ma100 > v.ma200) add("MA100 > MA200", 10, "MA100 di atas MA200, struktur menengah mendukung trend besar.");

  if (v.currentPrice > v.support && distanceToSupport <= 4) add("Harga dekat support", 10, "Harga relatif dekat support sehingga risk lebih mudah dipetakan.");
  if (v.currentPrice < v.support) add("Harga breakdown support", -20, "Harga berada di bawah support, ini sinyal lemah.", "weak");
  if (distanceToResistance <= 3) add("Dekat resistance", -10, "Harga sudah dekat resistance, ruang kenaikan lebih sempit.", "weak");

  if (volumeRatio > 1.5) add("Volume kuat", 10, `Volume ratio ${formatNumberID(volumeRatio, 2)}x, transaksi di atas rata-rata.`);
  else if (volumeRatio >= 1 && volumeRatio <= 1.5) add("Volume normal", 0, `Volume ratio ${formatNumberID(volumeRatio, 2)}x masih normal, tetapi belum cukup kuat sebagai konfirmasi besar.`, "weak");
  else if (volumeRatio < 1) add("Volume lemah", -6, `Volume ratio ${formatNumberID(volumeRatio, 2)}x, kenaikan kurang tervalidasi.`, "weak");

  if (volumeRatio > 1.5 && (v.currentPrice < v.ma50 || v.currentPrice < v.support)) add("Volume jual besar", -15, "Volume besar muncul saat harga lemah, tekanan jual perlu diwaspadai.", "weak");

  if (v.macd > v.signal) add("MACD > Signal", 10, "MACD berada di atas signal line, momentum mendukung.");
  else add("MACD < Signal", -10, "MACD berada di bawah signal line, momentum melemah.", "weak");

  if (v.rsi >= 50 && v.rsi <= 65) add("RSI sehat", 10, `RSI ${formatNumberID(v.rsi)} berada di zona sehat.`);
  if (v.rsi > 65 && v.rsi <= 75) add("RSI mulai panas", 0, `RSI ${formatNumberID(v.rsi)} berada di zona 65-75, jadi entry baru perlu lebih selektif.`, "weak");
  if (v.rsi < 50) add("RSI di bawah 50", -10, `RSI ${formatNumberID(v.rsi)} menunjukkan momentum belum kuat.`, "weak");
  if (v.rsi > 75) add("RSI terlalu panas", -8, `RSI ${formatNumberID(v.rsi)} sudah overbought, rawan pullback.`, "weak");

  if (v.stochastic >= 20 && v.stochastic <= 80) add("Stoch normal", 5, "Stochastic berada di area normal.");
  if (v.stochastic > 70 && v.stochastic <= 80) add("Stoch mendekati panas", 0, `Stochastic ${formatNumberID(v.stochastic)} mendekati area overbought.`, "weak");
  if (v.stochastic > 80) add("Stoch overbought", -8, `Stochastic ${formatNumberID(v.stochastic)} mulai panas.`, "weak");

  if (spreadPercent <= 0.5) add("Spread tipis", 5, `Spread hanya ${formatPercentID(spreadPercent)}, likuiditas lebih nyaman.`);
  if (spreadPercent > 1.5) add("Spread lebar", -10, `Spread ${formatPercentID(spreadPercent)} terlalu lebar untuk eksekusi nyaman.`, "weak");

  if (v.bidLots > v.offerLots) add("Bid lebih tebal", 5, "Total bid lot lebih besar dari offer, minat beli jangka pendek lebih baik.");
  if (v.offerLots > v.bidLots * 1.6) add("Offer jauh lebih tebal", -10, "Offer jauh lebih tebal dari bid, tekanan jual/antrian jual perlu diwaspadai.", "weak");

  if (distanceFromMA200 > 8 && distanceFromMA200 <= 15) add("Jarak MA200 mulai jauh", 0, `Jarak dari MA200 ${formatPercentID(distanceFromMA200)} sudah cukup jauh, jangan asal mengejar harga.`, "weak");
  if (distanceFromMA200 > 15) add("Terlalu jauh dari MA200", -8, `Jarak dari MA200 ${formatPercentID(distanceFromMA200)}, rawan pullback jika tidak ada volume lanjutan.`, "weak");

  score = clamp(Math.round(score), 0, 100);
  const status = statusFromScore(score);

  if (score >= 75) notes.push("Banyak indikator searah, tetapi status tetap aman relatif dan bukan rekomendasi beli.");
  if (score >= 50 && score < 75) notes.push("Ada kombinasi positif dan negatif. Tunggu konfirmasi tambahan sebelum agresif.");
  if (score < 50) notes.push("Banyak faktor melemahkan. Untuk trend-following, kondisi ini tidak aman.");

  return {
    type: "indicator",
    at: new Date().toISOString(),
    values: v,
    score,
    status,
    statusLabel: statusMeta[status].label,
    rows,
    supports,
    weakens,
    notes,
    volumeRatio,
    distanceFromMA200,
    summary: buildSummary(status, supports, weakens)
  };
}

function renderSimulatorResult() {
  const result = App.lastIndicatorResult;
  if (!result) return emptyState("Belum ada hasil. Pilih preset atau isi data, lalu klik Analisis.");
  return `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p class="text-sm font-bold" style="color: var(--muted)">Status akhir</p>
        <div class="mt-2">${statusBadge(result.status)}</div>
      </div>
      ${riskMeter(result.score, "Risk")}
    </div>
    <div class="grid grid-cols-2 gap-3 mt-4">
      ${metricRow("Distance MA200", formatPercentID(result.distanceFromMA200))}
      ${metricRow("Volume ratio", `${formatNumberID(result.volumeRatio, 2)}x`)}
    </div>
    <div class="flat-panel p-4 mt-4">
      <h3 class="font-black">Kenapa status ini muncul?</h3>
      <p class="text-sm mt-2 leading-relaxed" style="color: var(--muted)">${escapeHtml(result.summary)}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
      ${detailList("Indikator mendukung", result.supports.slice(0, 6), "green")}
      ${detailList("Indikator melemahkan", result.weakens.slice(0, 6), "red")}
    </div>
    <div class="mt-4">
      <h3 class="font-black mb-2">Breakdown skor transparan</h3>
      ${scoreTable(result.rows)}
    </div>
    <div class="flat-panel p-4 mt-4">
      <h3 class="font-black">Catatan risiko dan saran edukatif</h3>
      <ul class="grid gap-2 text-sm mt-2" style="color: var(--muted)">
        ${result.notes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        <li>Selalu cek support, resistance, timeframe besar, dan risk reward sebelum membuat rencana.</li>
      </ul>
    </div>
  `;
}

function saveSimulation() {
  if (!App.lastIndicatorResult) {
    toast("Jalankan analisis dulu sebelum menyimpan.", "warning");
    return;
  }
  App.state.simulations.unshift(App.lastIndicatorResult);
  App.state.simulations = App.state.simulations.slice(0, 40);
  App.addActivity(`Simulasi indikator disimpan: ${App.lastIndicatorResult.statusLabel} (${App.lastIndicatorResult.score}/100)`, "simulation");
  App.save();
  toast("Simulasi tersimpan di localStorage.", "success");
}

function showLastExplanation() {
  if (!App.lastIndicatorResult) {
    toast("Belum ada hasil untuk dijelaskan.", "warning");
    return;
  }
  const result = App.lastIndicatorResult;
  openModal(`
    <h2 id="modalTitle" class="text-2xl font-black">Kenapa status ${statusMeta[result.status].label}?</h2>
    <p class="mt-3 text-sm leading-relaxed" style="color: var(--muted)">${escapeHtml(result.summary)}</p>
    <div class="mt-5">${scoreTable(result.rows)}</div>
  `);
  refreshIcons();
}

function resetSimulator() {
  ["simulatorForm"].forEach((formId) => document.querySelector(`#${formId}`)?.reset());
  App.lastIndicatorResult = null;
  const result = document.querySelector("#simulatorResult");
  if (result) result.innerHTML = renderSimulatorResult();
  toast("Form simulator direset.", "success");
}

function fillSimulatorPreset(key) {
  const preset = simulatorPresets[key];
  if (!preset) return;
  setValues(preset.data);
  const select = document.querySelector("#chartScenario");
  if (select) {
    select.value = preset.scenario || "rebound_support";
    updateScenarioChart();
  }
  toast(`${preset.label} dimuat.`, "success");
}

function analyzeMA200() {
  const v = {
    price: getNumber("maPrice"),
    ma200: getNumber("maOnly200"),
    currentVolume: getNumber("maVolume"),
    avgVolume: getNumber("maAvgVolume"),
    candlePosition: document.querySelector("#maCandlePosition")?.value,
    maDirection: document.querySelector("#maDirection")?.value,
    bounce: document.querySelector("#maBounce")?.checked
  };
  const errors = [];
  if (v.price <= 0) errors.push("Harga sekarang harus lebih dari 0.");
  if (v.ma200 <= 0) errors.push("MA200 tidak boleh 0.");
  if (v.currentVolume < 0 || v.avgVolume <= 0) errors.push("Volume tidak boleh negatif dan rata-rata volume harus lebih dari 0.");
  if (errors.length) {
    toast(errors[0], "error");
    return;
  }
  const distance = ((v.price - v.ma200) / v.ma200) * 100;
  const volumeRatio = v.currentVolume / v.avgVolume;
  let status = "watch";
  const reasons = [];

  if (v.candlePosition === "below" || v.price < v.ma200) {
    status = "danger";
    reasons.push("Harga close di bawah MA200, tidak aman untuk trend-following.");
    if (volumeRatio > 1.5) reasons.push("Breakdown terjadi dengan volume ratio di atas 1,5.");
    if (v.maDirection === "down") reasons.push("MA200 juga mengarah turun.");
  } else if (v.candlePosition === "above" && distance >= 2 && distance <= 8 && ["flat", "up"].includes(v.maDirection) && volumeRatio >= 1.2 && v.bounce) {
    status = "safe";
    reasons.push("Harga close di atas MA200 dengan jarak sehat 2% sampai 8%.");
    reasons.push("MA200 datar atau naik, volume minimal 1,2x, dan ada candle pantulan.");
  } else {
    status = "watch";
    if (distance >= 0 && distance <= 2) reasons.push("Harga baru tipis di atas MA200, butuh konfirmasi candle close dan volume.");
    if (!v.bounce) reasons.push("Belum ada candle pantulan yang jelas.");
    if (volumeRatio < 1.2) reasons.push("Volume belum cukup kuat untuk konfirmasi.");
    if (v.maDirection === "down") reasons.push("MA200 masih turun.");
    if (distance > 12) reasons.push("Harga sudah cukup jauh dari MA200 sehingga rawan pullback.");
  }

  App.lastMA200Result = { ...v, distance, volumeRatio, status, reasons };
  document.querySelector("#ma200Result").innerHTML = renderMA200Result();
  refreshIcons();
  toast("Analisis MA200 selesai.", "success");
}

function renderMA200Result() {
  const result = App.lastMA200Result;
  if (!result) {
    return `
      ${emptyState("Belum ada hasil MA200. Gunakan contoh atau isi form lalu klik Analisis MA200.")}
      <div class="flat-panel p-4 mt-4 text-sm leading-relaxed" style="color: var(--muted)">
        <p><strong>Patokan:</strong> 2% sampai 8% di atas MA200 dengan trend dan volume mendukung cenderung aman relatif. 0% sampai 2% di atas MA200 masih butuh konfirmasi. Di bawah MA200 tidak aman untuk trend-following. Di atas 12%-15% mulai waspada karena rawan pullback.</p>
      </div>
    `;
  }
  return `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      ${statusBadge(result.status)}
      ${riskMeter(result.status === "safe" ? 82 : result.status === "watch" ? 58 : 30, "MA200")}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      ${metricRow("Distance", formatPercentID(result.distance))}
      ${metricRow("Volume ratio", `${formatNumberID(result.volumeRatio, 2)}x`)}
    </div>
    <div class="flat-panel p-4 mt-4">
      <h3 class="font-black">Rumus</h3>
      <p class="text-sm mt-2" style="color: var(--muted)">Distance = (${formatNumberID(result.price)} - ${formatNumberID(result.ma200)}) / ${formatNumberID(result.ma200)} x 100 = ${formatPercentID(result.distance)}</p>
    </div>
    <div class="flat-panel p-4 mt-4">
      <h3 class="font-black">Penjelasan</h3>
      <ul class="grid gap-2 text-sm mt-2" style="color: var(--muted)">
        ${result.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function fillMA200Example(index) {
  const ex = ma200Examples[index];
  if (!ex) return;
  setValues({ maPrice: ex.price, maOnly200: ex.ma200, maVolume: ex.currentVolume, maAvgVolume: ex.avgVolume });
  document.querySelector("#maCandlePosition").value = ex.candlePosition;
  document.querySelector("#maDirection").value = ex.maDirection;
  document.querySelector("#maBounce").checked = ex.bounce;
  analyzeMA200();
}

function analyzeTimeframe() {
  const values = Object.fromEntries([...document.querySelectorAll("[data-timeframe]")].map((input) => [input.dataset.timeframe, input.value]));
  const statuses = Object.values(values);
  let status = "watch";
  let text = "Timeframe bertentangan. Tetap waspada dan cari konfirmasi timeframe besar.";
  if (statuses.every((value) => value === "bullish")) {
    status = "safe";
    text = "Timeframe searah bullish. Sinyal lebih kuat, tetapi tetap butuh risk reward dan stop loss.";
  } else if (values.Daily === "bearish") {
    status = "danger";
    text = "Daily bearish. Timeframe besar melemah, jadi jangan terlalu agresif meskipun timeframe kecil bullish.";
  } else if (new Set(statuses).size > 1) {
    status = "watch";
    text = "Ada perbedaan sinyal antar timeframe. Sinyal 1H bullish belum tentu cukup jika 4H atau Daily belum mendukung.";
  }
  document.querySelector("#timeframeResult").innerHTML = renderTimeframeResult({ values, status, text });
  refreshIcons();
}

function renderTimeframeResult(result = null) {
  if (!result) return emptyState("Belum dianalisis. Pilih kondisi setiap timeframe lalu klik Analisis Timeframe.");
  return `
    <div class="flex items-center justify-between gap-3 flex-wrap">
      ${statusBadge(result.status)}
      <div class="flex flex-wrap gap-2">
        ${Object.entries(result.values).map(([tf, value]) => badge(`${tf}: ${value}`, value === "bullish" ? "green" : value === "bearish" ? "red" : "yellow")).join("")}
      </div>
    </div>
    <p class="text-sm mt-3 leading-relaxed" style="color: var(--muted)">${escapeHtml(result.text)}</p>
  `;
}

function setTimeframePreset(type) {
  document.querySelectorAll("[data-timeframe]").forEach((select) => {
    select.value = type === "align" ? "bullish" : (select.dataset.timeframe === "Daily" || select.dataset.timeframe === "4H" ? "bearish" : "bullish");
  });
  analyzeTimeframe();
}

function analyzeEntry() {
  const v = {
    entryPrice: getNumber("entryPrice"),
    support: getNumber("entrySupport"),
    resistance: getNumber("entryResistance"),
    stopLoss: getNumber("stopLoss"),
    targetProfit: getNumber("targetProfit"),
    currentPrice: getNumber("entryCurrentPrice"),
    ma200: getNumber("entryMA200"),
    rsi: getNumber("entryRSI"),
    volumeRatio: getNumber("entryVolumeRatio")
  };
  const errors = validateEntry(v);
  if (errors.length) {
    toast(errors[0], "error");
    return;
  }
  const risk = v.entryPrice - v.stopLoss;
  const reward = v.targetProfit - v.entryPrice;
  const rr = reward / risk;
  const nearSupport = ((v.entryPrice - v.support) / v.entryPrice) * 100 <= 4;
  const nearResistance = ((v.resistance - v.entryPrice) / v.entryPrice) * 100 <= 3;
  const distanceMA200 = ((v.entryPrice - v.ma200) / v.ma200) * 100;
  const checks = [
    { label: "Entry dekat support", ok: nearSupport },
    { label: "Stop loss jelas", ok: risk > 0 },
    { label: "Risk reward minimal 1:2", ok: rr >= 2 },
    { label: "Harga di atas MA200", ok: v.entryPrice > v.ma200 },
    { label: "RSI tidak lebih dari 70", ok: v.rsi <= 70 },
    { label: "Volume mendukung", ok: v.volumeRatio >= 1.2 },
    { label: "Tidak terlalu dekat resistance", ok: !nearResistance },
    { label: "Harga tidak terlalu jauh dari MA200", ok: distanceMA200 <= 12 }
  ];
  let status = "watch";
  if (rr >= 2 && nearSupport && !nearResistance && v.entryPrice > v.ma200 && v.rsi <= 70 && v.volumeRatio >= 1.2) status = "safe";
  if (rr < 1 || nearResistance || v.entryPrice < v.ma200 || v.rsi > 75 || v.volumeRatio < 1) status = "danger";

  App.lastEntryResult = { ...v, risk, reward, rr, nearSupport, nearResistance, distanceMA200, checks, status, at: new Date().toISOString() };
  document.querySelector("#entryResult").innerHTML = renderEntryResult();
  refreshIcons();
  toast("Analisis entry selesai.", "success");
}

function renderEntryResult() {
  const r = App.lastEntryResult;
  if (!r) return emptyState("Belum ada hasil entry. Isi form lalu klik Analisis Entry.");
  return `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      ${statusBadge(r.status)}
      ${riskMeter(r.status === "safe" ? 84 : r.status === "watch" ? 60 : 34, "Entry")}
    </div>
    <div class="mt-4">${calculationTable([
      ["Risk per share", formatNumberID(r.risk)],
      ["Reward per share", formatNumberID(r.reward)],
      ["Risk reward ratio", `1:${formatNumberID(r.rr, 2)}`],
      ["Distance dari MA200", formatPercentID(r.distanceMA200)]
    ])}</div>
    <div class="flat-panel p-4 mt-4">
      <h3 class="font-black">Penjelasan singkat</h3>
      <p class="text-sm mt-2" style="color: var(--muted)">${entryExplanation(r)}</p>
    </div>
    <div class="mt-4">
      <h3 class="font-black mb-2">Checklist entry</h3>
      <div class="grid gap-2">
        ${r.checks.map((item) => `
          <div class="flat-panel p-3 flex items-center gap-2">
            <i data-lucide="${item.ok ? "check-circle-2" : "x-circle"}" class="w-5 h-5" style="color: ${item.ok ? "var(--green)" : "var(--red)"}"></i>
            <span class="text-sm font-bold">${escapeHtml(item.label)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function saveEntry() {
  if (!App.lastEntryResult) {
    toast("Jalankan analisis entry dulu.", "warning");
    return;
  }
  App.state.entrySimulations.unshift(App.lastEntryResult);
  App.state.entrySimulations = App.state.entrySimulations.slice(0, 30);
  App.addActivity(`Simulasi entry disimpan: ${statusMeta[App.lastEntryResult.status].label}`, "entry");
  App.save();
  toast("Simulasi entry tersimpan.", "success");
}

function fillEntryExample() {
  setValues({ entryPrice: 3200, entrySupport: 3080, entryResistance: 3500, stopLoss: 3050, targetProfit: 3500, entryCurrentPrice: 3180, entryMA200: 3086, entryRSI: 58, entryVolumeRatio: 1.6 });
  toast("Contoh entry dimuat.", "success");
}

function resetEntry() {
  document.querySelector("#entryForm")?.reset();
  App.lastEntryResult = null;
  document.querySelector("#entryResult").innerHTML = renderEntryResult();
}

function analyzeRisk() {
  const v = {
    capital: getNumber("capital"),
    entryPrice: getNumber("riskEntryPrice"),
    stopLoss: getNumber("riskStopLoss"),
    targetProfit: getNumber("riskTargetProfit"),
    riskPercent: getNumber("riskPercent"),
    lotSize: getNumber("lotSize")
  };
  const errors = validateRisk(v);
  if (errors.length) {
    toast(errors[0], "error");
    return;
  }
  const riskPerShare = v.entryPrice - v.stopLoss;
  const rewardPerShare = v.targetProfit - v.entryPrice;
  const riskRewardRatio = rewardPerShare / riskPerShare;
  const maxRiskAmount = v.capital * v.riskPercent / 100;
  const maxShares = Math.floor(maxRiskAmount / riskPerShare);
  const maxLots = Math.floor(maxShares / v.lotSize);
  let status = "watch";
  if (riskRewardRatio >= 2 && v.riskPercent <= 2) status = "safe";
  if (riskRewardRatio < 1 || v.riskPercent > 3) status = "danger";
  App.lastRiskResult = { ...v, riskPerShare, rewardPerShare, riskRewardRatio, maxRiskAmount, maxShares, maxLots, status, at: new Date().toISOString() };
  document.querySelector("#riskResult").innerHTML = renderRiskResult();
  refreshIcons();
  toast("Manajemen risiko dihitung.", "success");
}

function renderRiskResult() {
  const r = App.lastRiskResult;
  if (!r) return emptyState("Belum ada hasil. Isi form lalu klik Hitung Risiko.");
  return `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      ${statusBadge(r.status)}
      ${riskMeter(r.status === "safe" ? 86 : r.status === "watch" ? 58 : 28, "Risiko")}
    </div>
    <div class="mt-4">${calculationTable([
      ["Risk per share", formatCurrencyID(r.riskPerShare)],
      ["Reward per share", formatCurrencyID(r.rewardPerShare)],
      ["Risk reward ratio", `1:${formatNumberID(r.riskRewardRatio, 2)}`],
      ["Maksimal kerugian", formatCurrencyID(r.maxRiskAmount)],
      ["Rekomendasi saham maksimal", formatNumberID(r.maxShares)],
      ["Rekomendasi lot maksimal", formatNumberID(r.maxLots)]
    ])}</div>
    <p class="text-sm mt-4 leading-relaxed" style="color: var(--muted)">RR < 1 tidak aman, RR 1 sampai 1,5 waspada, dan RR 2 atau lebih lebih sehat. Risiko per transaksi idealnya maksimal 1-2% dari modal.</p>
  `;
}

function fillRiskExample() {
  setValues({ capital: 10000000, riskEntryPrice: 3200, riskStopLoss: 3050, riskTargetProfit: 3500, riskPercent: 2, lotSize: 100 });
  toast("Contoh manajemen risiko dimuat.", "success");
}

function saveRisk() {
  if (!App.lastRiskResult) {
    toast("Hitung risiko dulu sebelum menyimpan.", "warning");
    return;
  }
  App.state.riskSimulations.unshift(App.lastRiskResult);
  App.state.riskSimulations = App.state.riskSimulations.slice(0, 30);
  App.addActivity(`Manajemen risiko disimpan: ${statusMeta[App.lastRiskResult.status].label}`, "risk");
  App.save();
  toast("Hasil risiko tersimpan.", "success");
}

function answerStudyCase(id, choice) {
  const item = studyCases.find((study) => study.id === id);
  if (!item) return;
  const correct = item.answer === choice;
  App.state.studyAnswers[id] = { choice, correct, at: new Date().toISOString() };
  App.addActivity(`Studi kasus ${item.title}: ${correct ? "benar" : "perlu ulang"}`, "study");
  App.save();
  renderCurrentRoute();
}

function getCurrentQuizQuestion() {
  const level = App.state.quizRuntime.level || 1;
  const pool = quizBank.filter((item) => item.level === level);
  const history = App.state.quizScores || [];
  const lastId = history[0]?.question;
  return pool.find((item) => item.question !== lastId) || pool[0] || quizBank[0];
}

function answerQuiz(index) {
  if (App.quizFeedback) return;
  const q = getCurrentQuizQuestion();
  const correct = index === q.answer;
  const runtime = App.state.quizRuntime;
  if (correct) {
    runtime.correctStreak += 1;
    runtime.wrongStreak = 0;
    if (runtime.correctStreak >= 3) {
      runtime.level = clamp(runtime.level + 1, 1, 5);
      runtime.correctStreak = 0;
      toast("Bagus, level kuis naik.", "success");
    }
  } else {
    runtime.wrongStreak += 1;
    runtime.correctStreak = 0;
    if (runtime.wrongStreak >= 2) {
      runtime.level = clamp(runtime.level - 1, 1, 5);
      runtime.wrongStreak = 0;
      toast("Level kuis turun supaya materi bisa diulang dengan nyaman.", "warning");
    }
  }
  const record = { question: q.question, topic: q.topic, level: q.level, correct, chosen: index, at: new Date().toISOString() };
  App.state.quizScores.unshift(record);
  App.state.quizScores = App.state.quizScores.slice(0, 80);
  App.quizFeedback = { correct, explanation: q.explanation };
  App.addActivity(`Kuis ${q.topic}: ${correct ? "benar" : "salah"}`, "quiz");
  App.save();
  renderCurrentRoute();
}

function nextQuiz() {
  App.quizFeedback = null;
  renderCurrentRoute();
}

function resetChecklist() {
  App.state.checklist = { items: {}, last: null };
  App.save();
  renderCurrentRoute();
  toast("Checklist direset.", "success");
}

function saveChecklist() {
  App.state.checklist.last = { percent: checklistPercent(), at: new Date().toISOString() };
  App.addActivity(`Checklist entry tersimpan: ${Math.round(checklistPercent())}%`, "checklist");
  App.save();
  toast("Checklist tersimpan.", "success");
}

function exportData(format) {
  const data = {
    progressMateri: App.state.materialProgress,
    skorKuis: App.state.quizScores,
    riwayatSimulator: App.state.simulations,
    catatanPribadi: App.state.notes,
    checklistEntry: App.state.checklist,
    studiKasus: App.state.studyAnswers,
    entrySimulations: App.state.entrySimulations,
    riskSimulations: App.state.riskSimulations
  };
  if (format === "json") {
    downloadFile("trading-learning-progress.json", JSON.stringify(data, null, 2), "application/json");
    return;
  }
  const rows = [["kategori", "tanggal", "status", "score", "ringkasan"]];
  (App.state.simulations || []).forEach((item) => rows.push(["simulator", item.at, item.statusLabel, item.score, item.summary]));
  (App.state.quizScores || []).forEach((item) => rows.push(["kuis", item.at, item.correct ? "benar" : "salah", item.level, item.topic]));
  Object.entries(App.state.materialProgress || {}).forEach(([id, status]) => rows.push(["materi", "", status, "", getIndicator(id)?.name || id]));
  downloadFile("trading-learning-progress.csv", rows.map((row) => row.map(csvEscape).join(",")).join("\n"), "text/csv");
}

function clearData() {
  if (!confirm("Reset semua data localStorage aplikasi ini?")) return;
  Storage.remove(APP_KEY);
  App.state = defaultState();
  App.applyTheme();
  renderShell();
  renderCurrentRoute();
  toast("Semua data lokal direset.", "success");
}

function getSimulatorValues() {
  return {
    currentPrice: getNumber("currentPrice"),
    ma50: getNumber("ma50"),
    ma100: getNumber("ma100"),
    ma200: getNumber("ma200"),
    support: getNumber("support"),
    resistance: getNumber("resistance"),
    currentVolume: getNumber("currentVolume"),
    averageVolume: getNumber("averageVolume"),
    macd: getNumber("macd"),
    signal: getNumber("signal"),
    rsi: getNumber("rsi"),
    stochastic: getNumber("stochastic"),
    bestBid: getNumber("bestBid"),
    bestOffer: getNumber("bestOffer"),
    bidLots: getNumber("bidLots"),
    offerLots: getNumber("offerLots")
  };
}

function validateSimulator(v) {
  const errors = [];
  if (v.currentPrice <= 0) errors.push("Harga sekarang harus lebih dari 0.");
  if (v.ma50 <= 0 || v.ma100 <= 0 || v.ma200 <= 0) errors.push("MA tidak boleh 0.");
  if (v.support >= v.currentPrice) errors.push("Support harus lebih kecil dari harga sekarang.");
  if (v.resistance <= v.currentPrice) errors.push("Resistance harus lebih besar dari harga sekarang.");
  if (v.rsi < 0 || v.rsi > 100) errors.push("RSI harus 0-100.");
  if (v.stochastic < 0 || v.stochastic > 100) errors.push("Stochastic harus 0-100.");
  if (v.currentVolume < 0 || v.averageVolume <= 0) errors.push("Volume tidak boleh negatif dan rata-rata volume harus lebih dari 0.");
  if (v.bestBid > v.bestOffer) errors.push("Bid harus lebih kecil atau sama dengan offer.");
  if (v.bidLots < 0 || v.offerLots < 0) errors.push("Total bid/offer lot tidak boleh negatif.");
  return errors;
}

function validateEntry(v) {
  const errors = [];
  if (v.entryPrice <= 0) errors.push("Harga entry harus lebih dari 0.");
  if (v.support >= v.entryPrice) errors.push("Support harus lebih kecil dari entry.");
  if (v.resistance <= v.entryPrice) errors.push("Resistance harus lebih besar dari entry.");
  if (v.stopLoss >= v.entryPrice) errors.push("Stop loss harus lebih kecil dari entry untuk skenario buy.");
  if (v.targetProfit <= v.entryPrice) errors.push("Target profit harus lebih besar dari entry untuk skenario buy.");
  if (v.ma200 <= 0) errors.push("MA200 tidak boleh 0.");
  if (v.rsi < 0 || v.rsi > 100) errors.push("RSI harus 0-100.");
  if (v.volumeRatio < 0) errors.push("Volume ratio tidak boleh negatif.");
  return errors;
}

function validateRisk(v) {
  const errors = [];
  if (v.capital <= 0) errors.push("Modal harus lebih dari 0.");
  if (v.entryPrice <= 0) errors.push("Harga entry harus lebih dari 0.");
  if (v.stopLoss >= v.entryPrice) errors.push("Stop loss harus lebih kecil dari entry.");
  if (v.targetProfit <= v.entryPrice) errors.push("Target profit harus lebih besar dari entry.");
  if (v.riskPercent <= 0) errors.push("Risiko maksimal harus lebih dari 0.");
  if (v.lotSize <= 0) errors.push("Lot size harus lebih dari 0.");
  return errors;
}

function drawDashboardCharts() {
  drawScenario(document.querySelector("#dashboardSparkline"), chartScenarios.breakout_resistance);
}

function drawSimulatorCharts() {
  updateScenarioChart();
}

function drawStudyCharts() {
  document.querySelectorAll("[id^='study-']").forEach((canvas) => {
    drawScenario(canvas, chartScenarios[canvas.dataset.scenario] || chartScenarios.rebound_support);
  });
}

function drawResultCharts() {
  const scenario = App.state.simulations?.[0]?.status === "danger" ? chartScenarios.breakdown_ma200 : chartScenarios.touch_ma200;
  drawScenario(document.querySelector("#resultChart"), scenario || chartScenarios.rebound_support);
}

function updateScenarioChart() {
  const select = document.querySelector("#chartScenario");
  const key = select?.value || "rebound_support";
  const scenario = chartScenarios[key] || chartScenarios.rebound_support;
  drawScenario(document.querySelector("#scenarioChart"), scenario);
  const box = document.querySelector("#scenarioExplanation");
  if (box) {
    box.innerHTML = `
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h3 class="font-black">${escapeHtml(scenario.label)}</h3>
        ${statusBadge(scenario.status)}
      </div>
      <p class="text-sm mt-2 leading-relaxed" style="color: var(--muted)">${escapeHtml(scenario.description)}</p>
    `;
    refreshIcons();
  }
}

function drawScenario(canvas, scenario) {
  if (!canvas || !scenario) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || canvas.clientWidth || 520);
  const height = Math.max(170, rect.height || 190);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const pad = 22;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const colors = getComputedStyle(document.documentElement);
  const text = colors.getPropertyValue("--muted").trim();
  const line = statusMeta[scenario.status || "info"].color;
  const maColor = colors.getPropertyValue("--blue").trim();
  const supportColor = colors.getPropertyValue("--green").trim();
  const resistColor = colors.getPropertyValue("--red").trim();

  ctx.fillStyle = "rgba(2,6,23,0.08)";
  ctx.fillRect(0, 0, width, height);

  [0.25, 0.5, 0.75].forEach((ratio) => {
    ctx.strokeStyle = "rgba(148,163,184,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad + plotH * ratio);
    ctx.lineTo(width - pad, pad + plotH * ratio);
    ctx.stroke();
  });

  drawGuideLine(ctx, scenario.support, supportColor, "Support", pad, plotW, plotH);
  drawGuideLine(ctx, scenario.resistance, resistColor, "Resistance", pad, plotW, plotH);
  drawGuideLine(ctx, scenario.ma200, maColor, "MA200", pad, plotW, plotH);

  const points = scenario.line.map((value, index) => ({
    x: pad + (index / (scenario.line.length - 1)) * plotW,
    y: pad + (1 - value / 100) * plotH
  }));

  ctx.lineWidth = 4;
  ctx.strokeStyle = line;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.fillStyle = index === points.length - 1 ? line : "rgba(248,250,252,0.72)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, index === points.length - 1 ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = text;
  ctx.font = "700 11px Inter, sans-serif";
  ctx.fillText(scenario.label, pad, height - 8);
}

function drawGuideLine(ctx, value, color, label, pad, plotW, plotH) {
  const y = pad + (1 - value / 100) * plotH;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(pad + plotW, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.font = "700 10px Inter, sans-serif";
  ctx.fillText(label, pad + 4, y - 5);
}

function pageHero(title, subtitle) {
  return `
    <section class="glass-card p-5 md:p-6 scroll-reveal">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="max-w-4xl">
          <p class="text-xs font-black uppercase tracking-wider" style="color: var(--blue)">Trading Indicator Learning Simulator</p>
          <h1 class="text-2xl md:text-4xl font-black mt-2">${title}</h1>
          <p class="text-sm md:text-base leading-relaxed mt-3" style="color: var(--muted)">${subtitle}</p>
        </div>
        <div class="hidden md:grid place-items-center w-24 h-24 rounded-lg" style="border: 1px solid var(--line); background: var(--card)">
          <i data-lucide="line-chart" class="w-10 h-10" style="color: var(--green)"></i>
        </div>
      </div>
    </section>
  `;
}

function disclaimerBlock() {
  return `
    <section class="flat-panel p-4 mt-4 flex gap-3 items-start">
      <i data-lucide="info" class="w-5 h-5 shrink-0" style="color: var(--blue)"></i>
      <p class="text-sm leading-relaxed" style="color: var(--muted)">Aplikasi ini hanya untuk edukasi dan simulasi. Bukan ajakan membeli atau menjual saham. Keputusan investasi tetap menjadi tanggung jawab pengguna.</p>
    </section>
  `;
}

function numberInput(id, label, placeholder = "") {
  return `
    <label class="input-label">${escapeHtml(label)}
      <input id="${id}" class="form-input" inputmode="decimal" placeholder="${escapeAttr(placeholder)}" autocomplete="off">
    </label>
  `;
}

function metricCard(title, value, icon, badgeClass, subtitle) {
  return `
    <article class="glass-card p-5 hover-lift scroll-reveal">
      <div class="flex items-center justify-between gap-3">
        <span class="badge ${badgeClass}"><i data-lucide="${icon}" class="w-4 h-4"></i>${escapeHtml(title)}</span>
      </div>
      <p class="text-3xl font-black mt-4">${escapeHtml(value)}</p>
      <p class="text-sm mt-2" style="color: var(--muted)">${escapeHtml(subtitle)}</p>
    </article>
  `;
}

function actionCard(title, text, icon, button, route) {
  return `
    <article class="glass-card p-5 hover-lift scroll-reveal">
      <div class="brand-mark mb-4"><i data-lucide="${icon}"></i></div>
      <h2 class="text-xl font-black">${escapeHtml(title)}</h2>
      <p class="text-sm leading-relaxed mt-2" style="color: var(--muted)">${escapeHtml(text)}</p>
      <a href="#${route}" class="primary-button mt-5">${escapeHtml(button)}<i data-lucide="arrow-right"></i></a>
    </article>
  `;
}

function detailList(title, items = [], color = "blue") {
  const colorVar = color === "green" ? "var(--green)" : color === "red" ? "var(--red)" : color === "yellow" ? "var(--yellow)" : "var(--blue)";
  return `
    <div class="flat-panel p-4">
      <h3 class="font-black mb-3">${escapeHtml(title)}</h3>
      <ul class="grid gap-2 text-sm" style="color: var(--muted)">
        ${(items.length ? items : ["Belum ada data."]).map((item) => `
          <li class="flex gap-2">
            <i data-lucide="dot" class="w-4 h-4 shrink-0" style="color: ${colorVar}"></i>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function emptyState(text) {
  return `
    <div class="flat-panel p-6 text-center">
      <div class="mx-auto brand-mark mb-3"><i data-lucide="sparkles"></i></div>
      <p class="font-black">Belum ada data</p>
      <p class="text-sm mt-2" style="color: var(--muted)">${escapeHtml(text)}</p>
    </div>
  `;
}

function metricRow(label, value) {
  return `
    <div class="flat-panel p-3 flex items-center justify-between gap-3">
      <span class="text-sm font-bold" style="color: var(--muted)">${escapeHtml(label)}</span>
      <span class="font-black text-right">${escapeHtml(String(value))}</span>
    </div>
  `;
}

function calculationTable(rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <tbody>
          ${rows.map(([label, value]) => `<tr><td class="font-bold" style="color: var(--muted)">${escapeHtml(label)}</td><td class="font-black text-right">${escapeHtml(value)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function scoreTable(rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Faktor</th><th>Nilai</th><th>Alasan</th></tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td class="font-bold">${escapeHtml(row.factor)}</td>
              <td class="font-black ${row.value >= 0 ? "status-safe" : "status-danger"}">${row.value > 0 ? "+" : ""}${row.value}</td>
              <td style="color: var(--muted)">${escapeHtml(row.reason)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function historyTable(rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Status</th><th>Score</th><th>Ringkasan</th></tr></thead>
        <tbody>
          ${rows.slice(0, 12).map((item) => `
            <tr>
              <td>${formatDate(item.at)}</td>
              <td>${statusBadge(item.status)}</td>
              <td class="font-black">${item.score}/100</td>
              <td style="color: var(--muted)">${escapeHtml(item.summary || "-")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function progressBar(value) {
  return `<div class="progress-track mt-3"><div class="progress-fill" style="--progress: ${clamp(value, 0, 100)}%"></div></div>`;
}

function riskMeter(value, label) {
  const score = clamp(Math.round(value || 0), 0, 100);
  const meta = statusMeta[statusFromScore(score)] || statusMeta.info;
  return `
    <div class="meter-ring" style="--meter-value: ${score}%; --meter-color: ${meta.color}">
      <div class="meter-value">
        <strong class="text-2xl">${score}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    </div>
  `;
}

function badge(text, color = "blue") {
  const className = color === "green" ? "badge-green" : color === "red" ? "badge-red" : color === "yellow" ? "badge-yellow" : color === "purple" ? "badge-purple" : color === "muted" ? "badge-muted" : "badge-blue";
  return `<span class="badge ${className}">${escapeHtml(text)}</span>`;
}

function statusBadge(status) {
  const meta = statusMeta[status] || statusMeta.info;
  return `<span class="badge ${meta.className}">${escapeHtml(meta.label)}</span>`;
}

function progressBadge(status) {
  const meta = progressStatus[status] || progressStatus.not_started;
  return `<span class="badge ${meta.className}">${escapeHtml(meta.label)}</span>`;
}

function statusFromScore(score) {
  if (score >= 75) return "safe";
  if (score >= 50) return "watch";
  return "danger";
}

function statusFromChecklist(percent) {
  if (percent >= 75) return "safe";
  if (percent >= 50) return "watch";
  return "danger";
}

function checklistPercent() {
  const total = 11;
  const checked = Object.values(App.state.checklist.items || {}).filter(Boolean).length;
  return Math.round((checked / total) * 100);
}

function checklistExplanation(percent) {
  if (percent >= 75) return "Checklist hijau lebih dari 75%. Rencana terlihat lebih siap secara edukatif, tetapi tetap gunakan stop loss dan jangan anggap pasti benar.";
  if (percent >= 50) return "Checklist 50-74%. Ada beberapa kondisi yang mendukung, tetapi masih ada faktor yang perlu dikonfirmasi.";
  return "Checklist kurang dari 50%. Banyak faktor belum siap, jadi kondisi tidak aman untuk entry trend-following.";
}

function entryExplanation(r) {
  const parts = [];
  if (r.rr >= 2) parts.push("Risk reward minimal 1:2, ini lebih sehat.");
  else if (r.rr >= 1) parts.push("Risk reward masih 1:1 sampai 1:2, status waspada.");
  else parts.push("Risk reward kurang dari 1:1, tidak sehat.");
  if (r.nearSupport) parts.push("Entry relatif dekat support.");
  if (r.nearResistance) parts.push("Namun entry dekat resistance sehingga ruang naik terbatas.");
  if (r.entryPrice > r.ma200) parts.push("Harga di atas MA200.");
  else parts.push("Harga di bawah MA200, tidak aman untuk trend-following.");
  if (r.rsi > 75) parts.push("RSI terlalu panas.");
  else if (r.rsi > 65) parts.push("RSI mulai panas.");
  else parts.push("RSI belum terlalu panas.");
  return parts.join(" ");
}

function getIndicator(id) {
  return indicators.find((item) => item.id === id);
}

function countUnderstood() {
  return Object.values(App.state.materialProgress || {}).filter((status) => status === "understood").length;
}

function getUserLevelNumber() {
  const material = countUnderstood();
  const simulations = (App.state.simulations || []).length;
  const quiz = (App.state.quizScores || []).filter((item) => item.correct).length;
  const raw = 1 + Math.floor((material + simulations + quiz) / 5);
  return clamp(raw, 1, 5);
}

function getLearningBadge() {
  const level = getUserLevelNumber();
  if (level >= 5) return "Expert";
  if (level >= 3) return "Intermediate";
  return "Pemula";
}

function getWeakTopic() {
  const wrong = (App.state.quizScores || []).filter((item) => !item.correct);
  if (!wrong.length) return "";
  const counts = wrong.reduce((acc, item) => {
    acc[item.topic] = (acc[item.topic] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function getRecommendation() {
  const weak = getWeakTopic();
  if (weak) return `Materi yang paling sering salah adalah ${weak}. Ulang bagian tersebut, lalu coba kuis adaptif lagi.`;
  const notDone = indicators.find((item) => App.state.materialProgress[item.id] !== "understood");
  if (notDone) return `Lanjutkan materi ${notDone.name}, lalu gunakan simulator untuk membaca kombinasi indikator.`;
  return "Bagus. Lanjutkan latihan gabungan multi-indikator, studi kasus, dan manajemen risiko.";
}

function renderActivityList() {
  const activities = App.state.activities || [];
  if (!activities.length) return emptyState("Aktivitas akan muncul setelah kamu membuka materi, menjalankan simulasi, atau menjawab kuis.");
  return `
    <div class="grid gap-3">
      ${activities.slice(0, 6).map((item) => `
        <div class="flat-panel p-3">
          <p class="text-sm font-bold">${escapeHtml(item.text)}</p>
          <p class="text-xs mt-1" style="color: var(--muted)">${formatDate(item.at)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function buildSummary(status, supports, weakens) {
  if (status === "safe") {
    return `Banyak indikator mendukung: ${supports.slice(0, 3).join(" ")} Kesimpulan: kondisi aman relatif, tetap wajib memakai rencana risiko.`;
  }
  if (status === "watch") {
    return `Ada sinyal positif, tetapi juga faktor yang perlu diwaspadai: ${weakens.slice(0, 3).join(" ")} Kesimpulan: tunggu konfirmasi dan jangan asal mengejar harga.`;
  }
  return `Faktor pelemah lebih dominan: ${weakens.slice(0, 3).join(" ")} Kesimpulan: kondisi tidak aman untuk trend-following.`;
}

function getNumber(id) {
  return parseNumberID(document.querySelector(`#${id}`)?.value || "");
}

function setValues(values) {
  Object.entries(values).forEach(([id, value]) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = formatNumberID(value, Number.isInteger(value) ? 0 : 2);
  });
}

function parseNumberID(value) {
  if (typeof value === "number") return value;
  let text = String(value || "").trim().replace(/rp/ig, "").replace(/%|x/g, "").replace(/\s/g, "");
  if (!text) return 0;
  const commaCount = (text.match(/,/g) || []).length;
  const dotCount = (text.match(/\./g) || []).length;
  if (commaCount && dotCount) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (commaCount) {
    text = text.replace(",", ".");
  } else if (dotCount > 1) {
    text = text.replace(/\./g, "");
  } else if (dotCount === 1) {
    const [before, after] = text.split(".");
    if (after.length === 3 && before.length <= 3) text = before + after;
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumberID(value, maximumFractionDigits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits }).format(number);
}

function formatPercentID(value) {
  return `${formatNumberID(value, 2)}%`;
}

function formatCurrencyID(value) {
  return `Rp${formatNumberID(value, 0)}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast(`${filename} berhasil dibuat.`, "success");
}

function openModal(html) {
  document.querySelector("#modalContent").innerHTML = html;
  document.querySelector("#modalBackdrop").classList.remove("hidden");
  refreshIcons();
}

function closeModal() {
  document.querySelector("#modalBackdrop").classList.add("hidden");
  document.querySelector("#modalContent").innerHTML = "";
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#modalClose")) closeModal();
  if (event.target.id === "drawerOverlay") closeDrawer();
  if (event.target.id === "modalBackdrop") closeModal();
});

function toast(message, type = "info") {
  const container = document.querySelector("#toastContainer");
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.innerHTML = `<p class="font-bold">${escapeHtml(message)}</p>`;
  container.appendChild(node);
  window.setTimeout(() => node.remove(), 3600);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function revealNow() {
  document.querySelectorAll(".scroll-reveal").forEach((item, index) => {
    window.setTimeout(() => item.classList.add("is-visible"), index * 25);
  });
}
