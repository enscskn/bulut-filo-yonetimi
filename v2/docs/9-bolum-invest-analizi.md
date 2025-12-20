*9\. Kullanıcı Hikayeleri (User Stories)**  
Aşağıdaki tabloda, Ahmet Bey'in en büyük sancı noktalarını hedefleyen 3 ana kullanıcı hikayesi ve bunların analizi yer almaktadır:

| ID | Kullanıcı Hikayesi (User Story) | Önem / Değer |
| :---- | :---- | :---- |
| **US.01** | Bir **Araç Kiralama İşletmecisi** olarak, sisteme müşteri bilgilerini girdiğimde **otomatik sözleşme üretilmesini** istiyorum; böylece manuel evrak işlerinden kurtulup operasyonumu hızlandırabilirim. | **Yüksek:** Manuel iş yükünü (Muda) doğrudan azaltır. |
| **US.02** | Bir **Araç Kiralama İşletmecisi** olarak, kiralama öncesi müşterinin **risk skorunu** görmek istiyorum; böylece riskli kiralamalardan kaçınarak finansal güvenliğimi sağlayabilirim . | **Kritik:** Doğrudan kârlılığı korur ve kayıpları önler. |
| **US.03** | Bir **Araç Kiralama İşletmecisi** olarak, araçlarıma gelen **trafik cezalarını** sistemde otomatik görmek istiyorum; böylece bu cezaları müşteriye anında yansıtıp gelir kaybımı önleyebilirim. | **Yüksek:** %80 oranında gelir kaybı iyileşmesi hedefine hizmet eder. |

---

### **9.1. INVEST Analizi**

Hazırladığımız bu hikayelerin neden kaliteli ve çevik (agile) süreçlere uygun olduğunu şu şekilde doğrulayabiliriz:

* **Independent (Bağımsız):** Örneğin; otomatik sözleşme üretimi (US.01), trafik cezası takibi (US.03) özelliğinden bağımsız olarak geliştirilebilir ve test edilebilir.  
* **Negotiable (Pazarlık Edilebilir):** Sözleşmenin hangi formatta (PDF/HTML) olacağı veya risk skorunun hangi verileri (ehliyet/finans) kullanacağı yazılım ekibiyle tartışılabilir.  
* **Valuable (Değerli):** Her üç hikaye de Ahmet Bey'in en büyük operasyonel ve finansal sorunlarını doğrudan çözer .  
* **Estimable (Tahmin Edilebilir):** RICE skorlamasında belirtilen "çaba" (kişi-ay) değerleri, bu hikayelerin teknik büyüklüğünün öngörülebilir olduğunu kanıtlar .  
* **Small (Küçük):** Her bir hikaye, bir Scrum sprinti (genellikle 2 hafta) içerisinde tamamlanabilecek kadar odaklanmış ve küçüktür .  
* **Testable (Test Edilebilir):** "Sistem PDF sözleşme üretiyor mu?", "Risk puanı 0-100 arasında dönüyor mu?" gibi sorularla başarıları kolayca ölçülebilir.
