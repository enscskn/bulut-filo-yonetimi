## **11\. UML Use Case Diyagramı Analizi**

Aşağıdaki analiz, modülün temel aktörlerini ve işlevsel sınırlarını belirlemektedir.

### **11.1. Aktörler (Actors)**

* **Operasyon Sorumlusu:** Kiralama süreçlerini başlatan, sözleşme üreten ve araç atamalarını yapan ana aktördür.  
* **Şirket Yetkili Personeli:** Kurumsal kiralamalarda sürücü ataması ve talep yönetimi yapan aktördür.  
* **Müşteri (Bireysel/Kurumsal):** Sisteme veri girişi yapan ve çıktıları (sözleşme, fatura) alan dış aktördür.  
* **Dış Veri Sistemleri (Secondary Actor):** Risk skorlaması ve ceza takibi için veri sağlayan API servisleridir (E-devlet, Tramer vb.).

### **11.2. Kullanım Durumları (Use Cases)**

Dokümanındaki "Must-Have" listesi ve RICE skorlamasını temel alan ana kullanım durumları:

* **UC.01: Sözleşme Yönetimi:** Dijital sözleşme üretme ve saklama süreci.  
* **UC.02: Risk Analizi Sorgulama:** Müşteri verileriyle risk puanı hesaplama etkileşimi.  
* **UC.03: Ceza ve Hasar İşleme:** Gelen verilerin otomatik olarak kiralama kaydıyla eşleştirilmesi.  
* **UC.04: Araç/Sürücü Atama:** Filo ve sürücü verilerinin kiralama ile ilişkilendirilmesi.  
* **UC.05: Finansal Raporlama:** Fatura ve kârlılık verilerinin görüntülenmesi.

### **11.3. İlişkiler ve Sistem Sınırı**

* **Sistem Sınırı:** Tüm bu işlemler **"Kiralama Yönetim Modülü"** sınırları içerisinde gerçekleşir.  
* **\<\<include\>\> (Dahil Etme):** "Risk Analizi Sorgulama" işlemi, her zaman "Müşteri Verisi Doğrulama" alt sürecini dahil eder.  
* **\<\<extend\>\> (Genişletme):** "Sözleşme Yönetimi", kiralama tipine göre (bireysel veya kurumsal) farklılaşan şablonlarla genişletilebilir.
