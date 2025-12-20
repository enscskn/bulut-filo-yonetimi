## **10\. Kabul Kriterleri (Gherkin/BDD)**

Dokümanındaki "Must-Have" özellikler ve belirlenen iş hedefleri doğrultusunda , en kritik 3 senaryoyu şu şekilde tanımladık:

### **Senaryo 1: Otomatik Sözleşme Üretimi (US.01)**

* **Given (Durum):** Operasyon personeli, sistemdeki "Yeni Kiralama" ekranındadır.  
* **When (Olay):** Geçerli müşteri, araç ve tarih bilgileri girilip "Sözleşme Oluştur" butonuna tıklandığında.  
* **Then (Sonuç):** Sistem, yasal mevzuata uygun dijital sözleşmeyi 1 saniye içinde PDF formatında üretmeli ve ekranda önizleme olarak göstermelidir.

### **Senaryo 2: Müşteri Risk Skorlaması (US.02)**

* **Given (Durum):** Yeni bir bireysel müşterinin ehliyet ve kimlik bilgileri sisteme tanımlanmıştır.  
* **When (Olay):** "Risk Analizi Yap" komutu verildiğinde.  
* **Then (Sonuç):** Sistem, dış veri kaynaklarını kullanarak 3 saniye içinde 0 ile 100 arasında bir risk puanı döndürmeli ve Ahmet Bey'e "Kiralanabilir" veya "Riskli" uyarısını göstermelidir.

### **Senaryo 3: Otomatik Trafik Cezası Yansıtma (US.03)**

* **Given (Durum):** Sisteme entegre veri sağlayıcıdan (e-devlet vb.) belirli bir plakaya ait yeni bir trafik cezası bilgisi gelmiştir.  
* **When (Olay):** Sistem, ceza tarihindeki aktif kiralama kaydını ve ilgili müşteriyi otomatik olarak tespit ettiğinde.  
* **Then (Sonuç):** Ceza tutarı, manuel müdahaleye gerek kalmadan müşterinin cari hesabına borç olarak kaydedilmeli ve firmaya anlık bildirim gönderilmelidir.

---

### **Analiz Özeti**

* **Ölçülebilirlik:** Süreler (1sn, 3sn) ve puanlama aralıkları (0-100) kesin olarak tanımlanmıştır.  
* **Yoruma Kapalılık:** "Sistem üretmeli", "Gösterilmeli" gibi ifadelerle beklenen sonuçlar netleştirilmiştir.  
* **Stratejik Uyum:** Bu kriterlerin sağlanması, projenin %80 gelir kaybını önleme ve %30 verimlilik artışı hedeflerine ulaşıldığının kanıtı olacaktır.
