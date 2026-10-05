# Live Chat Kelas X RPL

Fitur:
- Live chat realtime dengan Firebase Firestore
- Nama peserta
- Notifikasi suara MP3 ketika pesan baru masuk
- Tampilan responsif HP/laptop
- Firebase Anonymous Authentication
- Firestore Rules
- Siap di-hosting

## 1. Buat Firebase Project
Buka Firebase Console, buat project baru, lalu tambahkan Web App.

Salin konfigurasi Firebase ke `firebase-config.js`.

## 2. Aktifkan Anonymous Login
Firebase Console -> Authentication -> Sign-in method -> Anonymous -> Enable.

## 3. Buat Firestore Database
Firebase Console -> Firestore Database -> Create database.

Masukkan isi `firestore.rules` ke Rules.

## 4. Jalankan
Jangan membuka `index.html` langsung dengan `file://`.
Gunakan Live Server di VS Code atau hosting.

## 5. Audio
File `assets/notification.mp3` sudah disediakan.

Catatan:
Browser dapat memblokir audio otomatis pada kondisi tertentu. Peserta sebaiknya melakukan klik/masuk chat terlebih dahulu agar izin audio aktif.

## 6. Hosting Firebase
Install Firebase CLI lalu:
firebase login
firebase init
firebase deploy

Atau upload folder ini ke hosting statis/GitHub Pages setelah Firebase dikonfigurasi.

## 7. Target demo
Guru: 2 orang
Siswa: 8 orang
Total target peserta nyata: 10 orang.
