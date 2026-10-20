# IRONPULSE ⚡️🥊

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## English

**IRONPULSE** is an offline-first fitness and boxing mobile application combining bodybuilding, strength training, boxing round timers, personal records (PRs), and gamified athletic progression into one cohesive product.

### 🌟 Key Principles
- **100% Offline-First:** Runs anywhere without an internet connection or remote backend.
- **Local Data Ownership:** All workouts, personal records, boxing rounds, and athlete metrics are stored locally on-device in a relational SQLite database.
- **No Cloud Account Required:** Launch and train instantly with full privacy.
- **Data Portability:** Validated JSON export and import for seamless backup and restore across devices.
- **Athletic Dark Aesthetics:** High-performance design inspired by athletic gear with near-black charcoal surfaces, electric lime accents, and restrained gold highlights.

### 🛠 Tech Stack
- **Framework:** [Expo SDK 57](https://expo.dev) + [React Native 0.86](https://reactnative.dev)
- **Language:** TypeScript
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS utility classes)
- **Database:** Local SQLite via `expo-sqlite` with versioned migrations (`PRAGMA user_version`)
- **Sensors & Feedback:** `expo-haptics` for tactile timer intervals and set completion feedback

### 📱 Application Structure
1. **Home (`/`)**: Overview of the day's training split, real-time weekly performance counters, and quick launchers.
2. **Train (`/train`)**: 7-day customizable weekly split calendar, workout execution with set logging, and prebuilt editable templates (Upper/Lower, PPL, Full Body).
3. **Boxing (`/boxing`)**: Configurable boxing round timer, curated punch arsenal, defensive systems, and custom combination builder.
4. **PR Arena (`/arena`)**: Personal record tracking with Brzycki 1RM estimation, and gamified deterministic tier progression (Bronze → Challenger).
5. **Profile (`/profile`)**: Athlete biometric tracking (Height, Weight, Age, Sex, BMI index & category), measurement logs, and JSON data backup/restore.

### 🚀 Getting Started
```bash
# 1. Install dependencies
npm install

# 2. Run the application
npx expo start

# 3. Type check & Lint
npx tsc --noEmit
npx expo-doctor
```

---

<a name="türkçe"></a>
## Türkçe

**IRONPULSE**, vücut geliştirme, kuvvet antrenmanları, boks raunt sayaçları, kişisel rekorlar (PR) ve oyunlaştırılmış atlet kademe sistemini tek bir çatı altında birleştiren, **tamamen çevrimdışı (offline-first)** çalışan bir sporcu mobil uygulamasıdır.

### 🌟 Temel İlkeler
- **%100 Çevrimdışı (Offline-First):** İnternet bağlantısı, harici sunucu veya bulut hesabı gerektirmeden uçak modunda bile eksiksiz çalışır.
- **Kişisel Veri Mahremiyeti:** Tüm antrenman kayıtları, setler, kişisel rekorlar ve vücut ölçüleri cihazınızdaki yerel SQLite veritabanında saklanır.
- **Zorunlu Kayıt Yok:** Hesap açmadan, e-posta vermeden anında kullanmaya başlayın.
- **Veri Taşınabilirliği (Yedekleme):** Veritabanınızı tek dokunuşla doğrulanmış JSON yedeği olarak dışa aktarabilir ve istediğiniz cihaza geri yükleyebilirsiniz.
- **Özel Sporcu Tasarımı:** Kömür grisi mat yüzeyler, elektrik yeşili (electric lime) aksanlar ve kupa/PR sarısı (gold) detaylarla zenginleştirilmiş modern sporcu estetiği.

### 🛠 Kullanılan Teknolojiler
- **Altyapı:** [Expo SDK 57](https://expo.dev) + [React Native 0.86](https://reactnative.dev)
- **Programlama Dili:** TypeScript
- **Navigasyon:** [Expo Router](https://docs.expo.dev/router/introduction/) (Dosya tabanlı yönlendirme)
- **Tasarım:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS sınıf sistemi)
- **Veritabanı:** `expo-sqlite` (Sürüm takipli migration mimarisi, WAL modu ve Foreign Key desteği)
- **Geri Bildirim:** Raunt geçişleri ve set onayları için `expo-haptics` titreşim motoru

### 📱 Modüller ve Özellikler
1. **Ana Sayfa (`/`)**: Günün antrenman spliti, SQLite'tan çekilen gerçek haftalık performans metrikleri ve hızlı başlatma araçları.
2. **Antrenman (`/train`)**: 7 günlük takvim planlayıcı, aktif set ve tekrar kayıt ekranı, hazır şablonlar (Upper/Lower, PPL, Full Body).
3. **Boks Laboratuvarı (`/boxing`)**: Hazırlık, raunt ve dinlenme aralıklı dijital boks sayacı, yumruk ve savunma teknik kütüphanesi, kombinasyon oluşturucu.
4. **PR Arena (`/arena`)**: Temel bileşik hareket rekorları, Brzycki formülüyle otomatik 1RM tahmini ve antrenman hacmine dayalı lig derecesi (Bronz → Meydan Okuyan).
5. **Profil (`/profile`)**: Sporcu biyometrikleri (Boy, Kilo, Yaş, Cinsiyet, otomatik hesaplanan BMI ve vücut kitle kategorisi), vücut çevre ölçüleri takibi ve JSON yedek alma/yükleme.

### 🚀 Kurulum ve Çalıştırma
```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npx expo start

# 3. Tip kontrolü ve sağlık testi
npx tsc --noEmit
npx expo-doctor
```

---
*IRONPULSE — Built for relentless performance.*
