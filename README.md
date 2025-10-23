# 🚗 Bulut Filo Yönetimi - BPM Analiz Sunumu

## 📋 Proje Hakkında

Bu proje, **Bulut Filo Yönetimi** şirketinin kiralama modülü için hazırlanan kapsamlı bir İş Süreci Yönetimi (BPM) analiz sunumudur. Modern web teknolojileri kullanılarak geliştirilmiş, interaktif ve görsel olarak etkileyici bir sunum platformudur.

### 🎯 Proje Amacı

Araç kiralama sektöründe faaliyet gösteren Bulut Filo Yönetimi şirketinin mevcut durumunu analiz etmek, operasyonel verimsizlikleri tespit etmek ve iyileştirme önerileri sunmaktır.

## ✨ Özellikler

### 🎨 Görsel ve Animasyonlar
- **Parçacık Sistemi**: Canvas tabanlı dinamik arka plan animasyonları
- **Glassmorphism Tasarım**: Modern cam efekti kartlar
- **3D Kart Efektleri**: Mouse hareketine duyarlı 3D dönüşümler
- **Parallax Scrolling**: Derinlik hissi veren kaydırma efektleri
- **AOS Animasyonları**: Scroll tetiklemeli giriş animasyonları
- **Typing Efekti**: Yazı makinesi animasyonu
- **Sayaç Animasyonları**: Dinamik sayı sayma efektleri

### 📊 Analiz Bileşenleri

1. **SWOT Analizi**
   - Güçlü yönler
   - Zayıf yönler
   - Fırsatlar
   - Tehditler

2. **TOWS Stratejik Öneriler**
   - SO Stratejileri (Güçlü Yönler × Fırsatlar)
   - WO Stratejileri (Zayıf Yönler × Fırsatlar)
   - ST Stratejileri (Güçlü Yönler × Tehditler)
   - WT Stratejileri (Zayıf Yönler × Tehditler)

3. **RICE Skorlama**
   - Reach (Erişim)
   - Impact (Etki)
   - Confidence (Güven)
   - Effort (Efor)
   - İnteraktif yatay bar grafikleri

4. **MoSCoW Önceliklendirme**
   - Must Have (Olmazsa Olmaz)
   - Should Have (Olması Gereken)
   - Could Have (Olabilecek)
   - Won't Have (Olmayacak)

5. **SIPOC Diyagramı**
   - Tedarikçiler (Suppliers)
   - Girdiler (Inputs)
   - Süreç (Process)
   - Çıktılar (Outputs)
   - Müşteriler (Customers)

6. **Ishikawa (Balık Kılçığı) Diyagramı**
   - İnsan
   - Süreç
   - Teknoloji
   - Materyal
   - Çevre
   - Ölçüm
   - İnteraktif SVG diyagram

7. **5 Neden Analizi**
   - Kök neden tespiti için 5 aşamalı sorgulama

8. **Süreç Metrikleri Dashboard**
   - Custom Timeline grafiği (SVG)
   - AS-IS vs TO-BE karşılaştırma grafiği (ApexCharts Bar)
   - Radial Progress Chart - İyileştirme hedefleri (ApexCharts RadialBar)
   - 6 Aylık performans trendi (ApexCharts Area)
   - Haftalık süreç yoğunluk haritası (ApexCharts Heatmap)
   - Kombine metrik analizi (ApexCharts Mixed: Bar + Line)
   - Detaylı maliyet dağılımı (ApexCharts Treemap)
   - Performans kategorileri (ApexCharts PolarArea)
   - Maliyet dağılımı (Chart.js Doughnut)
   - Darboğaz noktaları

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **HTML5**: Semantik yapı
- **CSS3**: Modern stil ve animasyonlar
- **JavaScript (Vanilla)**: İnteraktif özellikler ve animasyonlar

### Kütüphaneler
- **[Chart.js](https://www.chartjs.org/)** (v4.4.0): Veri görselleştirme grafikleri
- **[ApexCharts](https://apexcharts.com/)** (v3.44.0): İleri seviye interaktif grafikler
- **[AOS](https://michalsnik.github.io/aos/)** (v2.3.4): Scroll animasyonları

### Tasarım Yaklaşımı
- **Responsive Design**: Tüm cihazlarda uyumlu görünüm
- **Glassmorphism**: Modern cam efekti tasarım
- **Dark Theme**: Göz yormayan koyu tema
- **CSS Custom Properties**: Kolay renk ve tema yönetimi

## 📁 Proje Yapısı

```
bulut-filo-yonetimi/
│
├── index.html              # Ana HTML dosyası
├── style.css               # Stil dosyası
├── index.js                # JavaScript mantık dosyası
├── README.md               # Proje dokümantasyonu
│
├── images/                 # Görseller klasörü
│
└── docs/                   # Dokümantasyon
```

## 🚀 Kurulum ve Kullanım

### Gereksinimler
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (CDN kütüphaneleri için)

### Yerel Olarak Çalıştırma

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/kullaniciadi/bulut-filo-yonetimi.git
   cd bulut-filo-yonetimi
   ```

2. **Tarayıcıda Açın**
   - `index.html` dosyasını çift tıklayarak doğrudan tarayıcıda açabilirsiniz
   
   **VEYA**
   
   - Basit bir HTTP sunucusu kullanın:
   ```bash
   # Python 3 ile
   python -m http.server 8000
   
   # Node.js ile (http-server kurulu ise)
   npx http-server
   
   # PHP ile
   php -S localhost:8000
   ```

3. **Tarayıcıda Görüntüleyin**
   - Sunucu kullanıyorsanız: `http://localhost:8000`

## 📊 Grafik ve Veri Görselleştirme Özellikleri

### İnteraktif Grafikler (ApexCharts)

Proje, ApexCharts kütüphanesi kullanılarak gelişmiş ve interaktif veri görselleştirmeleri sunar:

#### 1. **AS-IS vs TO-BE Karşılaştırma Grafiği**
- Bar chart ile mevcut ve hedef durum karşılaştırması
- Export özellikleri (PNG, SVG, CSV)
- Zoom ve pan desteği
- Gradient renkler ve animasyonlar

#### 2. **Radial Progress Chart**
- İyileştirme hedeflerinin yüzdelik gösterimi
- 4 farklı kategori (Otomasyon, Entegrasyon, Eğitim, Analitik)
- Ortalama hesaplama
- İnteraktif legend

#### 3. **Performans Trend Analizi**
- 6 aylık area chart
- 3 farklı metrik (İşlem süresi, Müşteri memnuniyeti, Hata oranı)
- Smooth curve geçişleri
- Gradient fill efektleri

#### 4. **Süreç Yoğunluk Haritası (Heatmap)**
- Haftalık ve saatlik işlem yoğunluğu
- Renk skalası ile yoğunluk gösterimi
- İnteraktif tooltip'ler

#### 5. **Kombine Metrik Analizi**
- Bar + Line kombinasyonu
- Çoklu Y ekseni
- İşlem hacmi, verimlilik ve tasarruf metrikleri
- Shared tooltip

#### 6. **Detaylı Maliyet Dağılımı (Treemap)**
- Hiyerarşik maliyet gösterimi
- Tıklanabilir alanlar
- 8 farklı maliyet kategorisi
- Boyut bazlı görselleştirme

#### 7. **Performans Kategorileri (Polar Area)**
- 5 kategori karşılaştırması (Hız, Doğruluk, Verimlilik, Maliyet, Memnuniyet)
- Dairesel görselleştirme
- Puan bazlı değerlendirme

### Grafik Özellikleri
- ✅ **Responsive**: Tüm ekran boyutlarına uyumlu
- ✅ **Export**: PNG, SVG, CSV formatlarında indirme
- ✅ **Zoom/Pan**: Grafikleri yakınlaştırma ve kaydırma
- ✅ **Tooltip**: Detaylı veri gösterimi
- ✅ **Animation**: Smooth giriş animasyonları
- ✅ **Dark/Light Mode**: Tema desteği
- ✅ **Accessibility**: Ekran okuyucu desteği

## 🎯 Navigasyon

### Klavye Kısayolları
- **↓ (Aşağı Ok)**: Sonraki bölüme git
- **↑ (Yukarı Ok)**: Önceki bölüme git

### Navigasyon Noktaları
Sağ taraftaki navigasyon noktalarına tıklayarak bölümler arasında hızlıca gezinebilirsiniz:
- Kapak
- Ekip
- Şirket
- Problem
- SWOT
- SIPOC
- Mevcut Durum
- Kök Neden
- İyileştirmeler
- İletişim

## 📊 Proje Verileri

### Şirket İstatistikleri
- **5.000** Aktif Araç
- **250** Çalışan
- **15.000** Aylık İşlem
- **%98** Müşteri Memnuniyeti

### Tespit Edilen Sorunlar
- ⏱️ Ortalama işlem süresi: **45 dakika** (Hedef: 15 dakika)
- ❌ Hata oranı: **%12**
- 🔄 Tekrar işlemler: **4x**
- 💸 Yıllık ek maliyet: **500.000 TL**

### İyileştirme Önerileri
1. **Süreç Otomasyonu** (Yüksek Öncelik)
2. **Sistem Entegrasyonu** (Yüksek Öncelik)
3. **Mobil Uygulama** (Yüksek Öncelik)
4. **Analitik Dashboard** (Orta Öncelik)
5. **Personel Eğitimi** (Orta Öncelik)
6. **CRM Entegrasyonu** (Düşük Öncelik)

## 👥 Proje Ekibi

- **Enes Balcı** - Kıdemli İş Analisti
- **Enes Coşkun** - Kıdemli İş Geliştirme Uzmanı

## 🔧 Özelleştirme

### Renk Teması Değiştirme

`style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #7c3aed;
    --text-light: rgba(255, 255, 255, 0.9);
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Animasyon Sürelerini Ayarlama

`index.js` dosyasında animasyon yapılandırmalarını değiştirebilirsiniz:

```javascript
AOS.init({
    duration: 800,
    once: false,
    offset: 100
});
```

## 🌐 Tarayıcı Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Tasarım

Proje, aşağıdaki ekran boyutlarında optimize edilmiştir:
- 📱 Mobil: 320px - 768px
- 📱 Tablet: 768px - 1024px
- 💻 Masaüstü: 1024px+

## ⚡ Performans Optimizasyonları

- **Debounced Scroll Events**: Scroll olayları optimize edilmiştir
- **Intersection Observer API**: Lazy loading ve animasyon tetiklemeleri için
- **RequestAnimationFrame**: Smooth animasyonlar için
- **CSS Will-Change**: GPU hızlandırmalı animasyonlar
- **Prefers-Reduced-Motion**: Hareket hassasiyeti olan kullanıcılar için

## 📄 Lisans

Bu proje eğitim amaçlı hazırlanmıştır.

## 🔮 Gelecek Geliştirmeler

- [ ] Çoklu dil desteği (TR/EN)
- [ ] PDF export özelliği
- [ ] Print-friendly görünüm
- [ ] Interaktif veri düzenleme
- [ ] Backend entegrasyonu
- [ ] Gerçek zamanlı veri güncellemeleri
- [ ] Kullanıcı yorum sistemi

## 🙏 Teşekkürler