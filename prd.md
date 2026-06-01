# PRD: Henrique Rapido Type Race JavaScript Game

## 1. Ringkasan Produk

Henrique Rapido adalah game Type Race berbasis JavaScript untuk melatih kecepatan dan akurasi mengetik. Pemain mengetik teks yang muncul di layar secepat dan seakurat mungkin sebelum waktu habis. Game menampilkan skor real-time seperti WPM, akurasi, jumlah karakter benar/salah, progress teks, timer, dan hasil akhir setelah sesi selesai.

Project ini harus berjalan langsung di browser menggunakan HTML, CSS, dan JavaScript vanilla. Untuk versi pertama, tidak perlu backend, login, database, atau framework frontend.

## 2. Tujuan

Tujuan utama:

- Membuat game typing race yang bisa dimainkan di browser.
- Melatih pemain mengetik cepat dan akurat.
- Menyediakan feedback real-time yang jelas.
- Menyimpan high score lokal di browser.
- Membuat codebase sederhana agar mudah dipahami junior developer.

Tujuan teknis:

- Menggunakan JavaScript vanilla.
- Memisahkan struktur HTML, style CSS, dan logic JavaScript.
- Menulis logic game dengan fungsi yang jelas dan mudah dites manual.
- Membuat UI responsive untuk desktop dan mobile.

## 3. Non-Goals

Hal berikut tidak dikerjakan di versi pertama:

- Multiplayer real-time.
- Login user.
- Leaderboard online.
- Backend/API server.
- Database.
- Bot typing atau AI opponent.
- Mode custom text dari file upload.
- Framework seperti React, Vue, Angular, atau Svelte.

## 4. Target Pengguna

Target pengguna:

- Pelajar atau developer pemula yang ingin melatih mengetik.
- Orang yang ingin mengetahui WPM dan akurasi mengetik.
- Developer junior yang ingin mempelajari struktur game sederhana dengan JavaScript.

Kondisi penggunaan:

- Pengguna membuka game di browser.
- Pengguna memilih mode/durasi, lalu mulai mengetik.
- Pengguna melihat hasil akhir setelah waktu habis atau teks selesai.

## 5. Platform dan Browser

Target platform:

- Desktop browser.
- Mobile browser.

Browser minimum:

- Chrome versi modern.
- Edge versi modern.
- Firefox versi modern.

Tidak perlu mendukung Internet Explorer.

## 6. Tech Stack

Gunakan:

- HTML5 untuk struktur halaman.
- CSS3 untuk styling responsive.
- JavaScript ES6+ untuk logic game.
- LocalStorage untuk menyimpan high score.

Struktur file minimum:

```text
Henrique-Rapido/
  index.html
  src/
    app.js
    texts.js
    storage.js
  styles/
    main.css
  docs/
    workflow.md
  prd.md
  README.md
```

Jika developer ingin menambah file, hanya boleh jika membuat code lebih mudah dipahami.

## 7. Pengalaman Pengguna

### 7.1 First Screen

Saat halaman dibuka, pengguna langsung melihat game, bukan landing page.

Elemen yang harus terlihat:

- Nama game: `Henrique Rapido`.
- Area teks yang harus diketik.
- Input typing.
- Timer.
- WPM.
- Accuracy.
- Tombol start/restart.
- Pilihan durasi.
- High score lokal.

Tidak perlu hero marketing, section promosi, atau halaman penjelasan panjang.

### 7.2 Alur Game

Alur utama:

1. Pengguna membuka halaman.
2. Game menampilkan teks latihan default.
3. Pengguna memilih durasi: 30 detik, 60 detik, atau 120 detik.
4. Pengguna menekan tombol `Start`.
5. Input typing aktif dan timer berjalan.
6. Pengguna mengetik teks yang ditampilkan.
7. Game menghitung WPM, akurasi, kesalahan, dan progress secara real-time.
8. Game selesai ketika waktu habis atau seluruh teks selesai diketik.
9. Modal/section hasil akhir muncul.
10. Jika skor lebih tinggi dari high score lokal, high score diperbarui.
11. Pengguna bisa menekan `Restart` untuk bermain lagi.

### 7.3 State Game

Game harus punya state berikut:

- `idle`: game belum dimulai.
- `running`: timer berjalan dan input aktif.
- `finished`: game selesai dan hasil akhir tampil.

Perilaku state:

- Saat `idle`, input disabled atau readonly.
- Saat `running`, input enabled dan fokus otomatis.
- Saat `finished`, input disabled dan tombol restart tersedia.

## 8. Fitur Utama

### 8.1 Text Prompt

Game harus menampilkan teks latihan.

Requirement:

- Minimal tersedia 5 teks latihan.
- Teks dipilih secara random saat game dimulai.
- Teks harus berupa kalimat bahasa Inggris atau Indonesia yang mudah diketik.
- Teks tidak boleh terlalu pendek.
- Panjang target per teks: 180 sampai 350 karakter.

Contoh isi teks:

```js
const TEXTS = [
  "Practice makes progress when every small session is done with focus and patience.",
  "Typing quickly is useful, but typing accurately is what makes speed reliable."
];
```

### 8.2 Typing Input

Input bisa berupa `textarea` atau `input` besar.

Requirement:

- Input menerima teks yang diketik pengguna.
- Input harus fokus otomatis setelah game dimulai.
- Input harus kosong setiap game baru.
- Copy-paste harus dicegah saat game sedang berjalan.
- Jika pengguna mengetik lebih panjang dari teks target, input tambahan tidak dihitung sebagai benar.

### 8.3 Character Highlight

Teks target harus diberi highlight per karakter.

Requirement:

- Karakter yang benar diberi style `correct`.
- Karakter yang salah diberi style `incorrect`.
- Karakter yang sedang aktif diberi style `current`.
- Karakter yang belum diketik tetap neutral.

Contoh class:

```html
<span class="char correct">T</span>
<span class="char incorrect">y</span>
<span class="char current">p</span>
```

### 8.4 Timer

Requirement:

- Durasi default: 60 detik.
- Pilihan durasi: 30, 60, 120 detik.
- Timer mulai saat tombol `Start` ditekan.
- Timer berhenti saat waktu habis atau semua teks selesai.
- Timer tampil dalam format detik, misalnya `42s`.

### 8.5 WPM Calculation

WPM dihitung real-time.

Formula:

```text
WPM = (jumlah karakter benar / 5) / menit berjalan
```

Aturan:

- Gunakan hanya karakter benar untuk WPM.
- Jika waktu berjalan masih 0 detik, WPM harus 0.
- Hasil WPM dibulatkan ke bilangan bulat terdekat.

### 8.6 Accuracy Calculation

Accuracy dihitung real-time.

Formula:

```text
Accuracy = (jumlah karakter benar / total karakter yang diketik) * 100
```

Aturan:

- Jika belum ada karakter diketik, accuracy adalah 100%.
- Accuracy dibulatkan ke bilangan bulat terdekat.
- Karakter salah menurunkan accuracy.

### 8.7 Progress

Progress menunjukkan persentase teks yang sudah diketik.

Formula:

```text
Progress = (jumlah karakter yang diketik sampai panjang target / panjang teks target) * 100
```

Requirement:

- Tampilkan progress dalam bentuk progress bar.
- Progress maksimal 100%.

### 8.8 Result Summary

Setelah game selesai, tampilkan hasil akhir.

Data yang harus tampil:

- Final WPM.
- Final accuracy.
- Correct characters.
- Incorrect characters.
- Total typed characters.
- Duration.
- Status high score baru atau bukan.

### 8.9 Local High Score

High score disimpan di LocalStorage.

Key:

```text
type-race-high-score
```

Format data:

```json
{
  "wpm": 72,
  "accuracy": 96,
  "duration": 60,
  "date": "2026-06-01T13:00:00.000Z"
}
```

Aturan high score:

- High score utama berdasarkan WPM tertinggi.
- Jika WPM sama, accuracy lebih tinggi menang.
- Jika WPM dan accuracy sama, durasi lebih panjang menang.
- Jika tidak ada high score, tampilkan `No score yet`.

### 8.10 Restart

Requirement:

- Tombol `Restart` tersedia saat game `running` dan `finished`.
- Restart mengatur ulang input, timer, score, progress, dan target text.
- Restart memilih teks random baru.

## 9. UI Requirements

### 9.1 Layout Desktop

Desktop layout:

- Header kecil berisi title dan high score.
- Main game area di tengah.
- Stats bar berisi timer, WPM, accuracy, progress.
- Text prompt area.
- Text input area.
- Control bar berisi durasi dan tombol start/restart.
- Result summary muncul di bawah atau sebagai dialog sederhana.

### 9.2 Layout Mobile

Mobile layout:

- Semua elemen tersusun satu kolom.
- Text prompt tetap mudah dibaca.
- Input cukup tinggi untuk mengetik nyaman.
- Stats tidak boleh saling bertumpuk.
- Tombol minimal tinggi 44px agar mudah disentuh.

### 9.3 Visual Style

Style yang diinginkan:

- Bersih, modern, dan fokus pada typing.
- Background netral terang atau gelap, tetapi kontras harus baik.
- Gunakan maksimal 3 warna utama:
  - warna dasar background,
  - warna aksen,
  - warna error.
- Hindari dekorasi berlebihan.

Style karakter:

- Correct: warna hijau atau teks dengan background hijau lembut.
- Incorrect: warna merah atau background merah lembut.
- Current: underline atau border bawah.
- Neutral: warna teks normal.

### 9.4 Accessibility

Requirement:

- Semua tombol punya label teks jelas.
- Kontras teks harus mudah dibaca.
- Fokus keyboard harus terlihat.
- Jangan mengandalkan warna saja untuk error; gunakan underline/border juga.
- Input harus punya label yang bisa dibaca screen reader.

## 10. Functional Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | Pengguna bisa memulai game | Klik `Start` mengaktifkan input dan timer |
| FR-002 | Game menampilkan teks random | Setiap start/restart memilih salah satu teks dari daftar |
| FR-003 | Game menghitung WPM | WPM berubah saat user mengetik |
| FR-004 | Game menghitung accuracy | Accuracy berubah saat user salah/benar mengetik |
| FR-005 | Game menampilkan highlight karakter | Correct, incorrect, current, dan neutral terlihat berbeda |
| FR-006 | Game selesai saat waktu habis | Input disabled dan result summary muncul |
| FR-007 | Game selesai saat teks selesai | Input disabled dan result summary muncul |
| FR-008 | High score tersimpan lokal | Refresh browser tetap menampilkan high score |
| FR-009 | User bisa restart | Restart mengulang state dan memilih teks baru |
| FR-010 | Paste dicegah saat running | Event paste tidak mengisi input saat game berjalan |

## 11. Data Model

### 11.1 Game State Object

Gunakan object state sederhana:

```js
const state = {
  status: "idle",
  targetText: "",
  typedText: "",
  duration: 60,
  timeLeft: 60,
  startedAt: null,
  timerId: null,
  correctCount: 0,
  incorrectCount: 0,
  wpm: 0,
  accuracy: 100,
  progress: 0
};
```

### 11.2 High Score Object

```js
const highScore = {
  wpm: 0,
  accuracy: 0,
  duration: 60,
  date: null
};
```

## 12. Suggested JavaScript Functions

Junior developer boleh memakai nama fungsi berikut agar implementasi terstruktur:

```js
initApp()
loadHighScore()
saveHighScore(score)
isNewHighScore(score, highScore)
selectRandomText()
renderTargetText()
startGame()
restartGame()
finishGame(reason)
handleTypingInput(event)
preventPaste(event)
updateStats()
calculateCorrectCount(targetText, typedText)
calculateIncorrectCount(targetText, typedText)
calculateWpm(correctCount, elapsedSeconds)
calculateAccuracy(correctCount, typedLength)
calculateProgress(typedLength, targetLength)
renderStats()
renderResult()
setGameStatus(status)
```

## 13. Event Handling

Required events:

- `DOMContentLoaded`: jalankan `initApp`.
- `click` pada tombol `Start`: jalankan `startGame`.
- `click` pada tombol `Restart`: jalankan `restartGame`.
- `change` pada duration selector: update `state.duration`.
- `input` pada typing input: jalankan `handleTypingInput`.
- `paste` pada typing input: cegah paste saat game running.

## 14. Edge Cases

Developer harus menangani:

- User menekan start berkali-kali.
- User restart saat timer masih berjalan.
- User mengetik sebelum game dimulai.
- User menghapus karakter dengan Backspace.
- User mengetik karakter lebih panjang dari target.
- Timer mencapai 0.
- Target text selesai sebelum timer habis.
- LocalStorage kosong.
- LocalStorage berisi data rusak atau JSON invalid.

## 15. Manual Test Plan

### 15.1 Start Game

Steps:

1. Buka `index.html`.
2. Klik `Start`.
3. Pastikan input aktif.
4. Pastikan timer berkurang.

Expected:

- Status game menjadi running.
- Timer mulai dari durasi yang dipilih.

### 15.2 Typing Correct Text

Steps:

1. Start game.
2. Ketik beberapa karakter yang sama dengan target.

Expected:

- Karakter berubah menjadi correct.
- WPM naik.
- Accuracy tetap 100%.
- Progress naik.

### 15.3 Typing Incorrect Text

Steps:

1. Start game.
2. Ketik karakter yang berbeda dari target.

Expected:

- Karakter berubah menjadi incorrect.
- Accuracy turun.
- Incorrect count naik.

### 15.4 Finish By Timer

Steps:

1. Pilih durasi 30 detik.
2. Start game.
3. Tunggu sampai timer habis.

Expected:

- Input disabled.
- Result summary tampil.
- Timer berhenti di 0.

### 15.5 Finish By Completing Text

Steps:

1. Start game.
2. Ketik seluruh target text.

Expected:

- Game selesai.
- Result summary tampil.
- Progress 100%.

### 15.6 Restart

Steps:

1. Start game.
2. Ketik beberapa karakter.
3. Klik `Restart`.

Expected:

- Input kosong.
- Timer reset.
- Score reset.
- Target text baru atau di-render ulang.

### 15.7 High Score

Steps:

1. Selesaikan game dengan skor tinggi.
2. Refresh browser.

Expected:

- High score tetap tampil.
- Data berasal dari LocalStorage.

### 15.8 Paste Prevention

Steps:

1. Start game.
2. Copy text target.
3. Coba paste ke input.

Expected:

- Paste tidak masuk ke input.
- Game tetap berjalan normal.

## 16. Acceptance Criteria

Project dianggap selesai jika:

- `index.html` bisa dibuka langsung di browser.
- Game bisa start, running, finish, dan restart.
- WPM, accuracy, progress, correct count, dan incorrect count tampil benar.
- Character highlight bekerja untuk correct, incorrect, current, dan neutral.
- Durasi 30, 60, dan 120 detik tersedia.
- High score tersimpan di LocalStorage.
- Paste dicegah saat game berjalan.
- Layout usable di desktop dan mobile.
- Tidak ada error JavaScript di console saat alur normal.
- README menjelaskan cara menjalankan project.

## 17. Implementation Tasks

Urutan kerja untuk junior developer:

1. Buat struktur file `index.html`, `styles/main.css`, `src/app.js`, `src/texts.js`, dan `src/storage.js`.
2. Buat layout HTML sesuai section UI requirements.
3. Tambahkan daftar teks di `src/texts.js`.
4. Buat fungsi LocalStorage di `src/storage.js`.
5. Buat state object di `src/app.js`.
6. Implement `initApp`.
7. Implement random text rendering.
8. Implement start/restart/finish game.
9. Implement timer.
10. Implement input handling dan paste prevention.
11. Implement WPM, accuracy, progress, correct count, incorrect count.
12. Implement character highlighting.
13. Implement result summary.
14. Implement high score update.
15. Tambahkan responsive CSS.
16. Update README dengan cara menjalankan project.
17. Jalankan semua manual test plan.

## 18. Copy Requirements

Gunakan teks UI berikut agar konsisten:

- Title: `Henrique Rapido`
- Start button: `Start`
- Restart button: `Restart`
- Duration label: `Duration`
- Timer label: `Time`
- WPM label: `WPM`
- Accuracy label: `Accuracy`
- Progress label: `Progress`
- Result title: `Race Complete`
- Empty high score: `No score yet`
- New high score message: `New high score!`

## 19. Definition of Done

Selesai berarti:

- Semua acceptance criteria terpenuhi.
- Semua manual test scenario sudah dicoba.
- Code mudah dibaca oleh junior developer lain.
- Tidak ada dependency eksternal yang tidak perlu.
- Project tetap bisa dijalankan hanya dengan browser modern.
