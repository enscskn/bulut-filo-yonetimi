# 🚗 Bulut Filo Yönetimi - BPM Analiz Sunumu

## 📋 Proje Hakkında

Bu proje, **Bulut Filo Yönetimi** şirketinin kiralama modülü için hazırlanan kapsamlı bir İş Süreci Yönetimi (BPM) analiz sunumudur. Modern web teknolojileri kullanılarak geliştirilmiş, interaktif ve görsel olarak etkileyici bir sunum platformudur.

**BANÜ İş Süreçleri Analizi Dersi Kapsamında Hazırlanmıştır.**

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

### Yerel Olarak Çalıştırma

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/enscskn/bulut-filo-yonetimi.git
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

   **VEYA**
   
   - IDE Eklentilerinden Live Server kullanabilirsiniz.

3. **Tarayıcıda Görüntüleyin**
   - Sunucu kullanıyorsanız: `http://localhost:8000`

## 🎯 Navigasyon

### Klavye Kısayolları
- **↓ (Aşağı Ok)**: Sonraki bölüme git
- **↑ (Yukarı Ok)**: Önceki bölüme git

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

## 🙏 Teşekkürler