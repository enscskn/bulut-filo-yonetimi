**7\. Çözüm Gereksinimleri (Fonksiyonel & Non-Fonksiyonel)**

### **7.1. Fonksiyonel Gereksinimler (Sistem Ne Yapacak?)**

* **FG1 \- Otomatik Sözleşme ve Belge Üretimi:** Sistem; araç, müşteri ve tarih bilgileri girildikten sonra yasal mevzuata uygun dijital kiralama sözleşmesini 1 saniye içinde PDF formatında oluşturabilmelidir.  
* **FG2 \- Algoritmik Risk Skorlaması:** Sistem, bireysel müşterilerin ehliyet ve geçmiş kiralama verilerini kullanarak 0-100 arasında bir risk puanı hesaplamalı ve bu puanı operasyon sorumlusuna anlık olarak raporlamalıdır.  
* **FG3 \- Ceza ve Hasar Entegrasyonu:** Sistem, e-devlet veya ilgili veri sağlayıcılar üzerinden gelen trafik cezası ve hasar kayıtlarını otomatik olarak tespit etmeli ve ilgili kiracı hesabına %100 doğrulukla yansıtmalıdır.

### **7.2. Fonksiyonel Olmayan Gereksinimler (Sistem Nasıl Çalışacak?)**

* **FOG1 \- Performans ve Tepki Süresi:** Müşteri risk sorgulama ve raporlama motoru, kullanıcı talebi gönderdikten sonra en geç 3 saniye içinde sonuç döndürmelidir.  
* **FOG2 \- Güvenlik ve KVKK Uyumluluğu:** Sistem, sürücülerin biyometrik (ehliyet fotoğrafı vb.) ve kişisel verilerini KVKK (6698 Sayılı Kanun) standartlarına %100 uyumlu şekilde AES-256 şifreleme yöntemiyle saklamalıdır.  
* **FOG3 \- Kullanılabilirlik ve Erişilebilirlik:** Bulut tabanlı platform, 7/24 operasyonel sürekliliği sağlamak amacıyla yıllık %99.9 oranında çalışma süresi (uptime) garantisi sunmalıdır.