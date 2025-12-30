---
description: Kişi bazlı AI analizleri ve önerileri geliştirme iş akışı
---

# Kişi Bazlı AI Analizleri ve Önerileri

Bu iş akışı, deneysel sekmedeki AI analizlerinin (Kişilik Analizi, Dürtüsel Harcama, Tasarruf Meydan Okumaları vb.) seçili kullanıcı filtresine (Barış, Şengül, Fatih vb.) göre dinamik olarak hesaplanmasını sağlamak içindir.

## Hedep

- "Deneysel" sekmesindeki tüm analizlerin, üst taraftaki kullanıcı/bayrak filtresine (selectedFlag) duyarlı hale getirilmesi.
- Örneğin: Barış seçiliyken "Hafta Sonu Savaşçısı" analizi sadece Barış'ın harcamalarına göre yapılmalı.

## Adımlar

1.  **Veri Akışını Kontrol Et:**
    - `DeneyselTab` bileşenine `selectedFlag` veya halihazırda filtrelenmiş `ReportData`nın doğru şekilde ulaştığından emin ol.
    - Şu an `App.tsx` içerisinde `generateReport` fonksiyonu zaten filtreleme yapıyor gibi görünüyor, ancak `DeneyselTab`'a giden verinin (reportData) bu filtrelenmiş veri olduğundan ve analizlerin bu veriyi kullandığından emin olmalıyız.

2.  **Bileşenleri Güncelle (`DeneyselTab.tsx`):**
    - `FinancialPersonalitySection`: `reportData` içindeki işlemlerin seçili kişiye ait olup olmadığını kontrol et (Eğer `reportData` zaten filtrelenmişse ekstra işleme gerek kalmayabilir, doğrula).
    - `ImpulseBuySection`: Seçili filtreye göre dürtüsel harcama analizini daralt.
    - `SavingsChallengeSection`: Seçili kişinin harcama alışkanlıklarına göre meydan okuma öner.

3.  **Test Senaryoları:**
    - "Barış" filtresini seç -> Analizlerin değiştiğini gözlemle.
    - "Tümü" filtresini seç -> Genel analizi gör.
    - Farklı harcama profilleri olan (örn. biri çok yemek harcıyor, diğeri teknoloji) iki filtre arasında geçiş yaparak kişilik analizinin değiştiğini doğrula.

4.  **İyileştirmeler:**
    - Eğer veri seti çok küçükse (tek kişi için) analizlerin "Yetersiz Veri" veya benzeri bir durum gösterip göstermediğini kontrol et.

## Notlar
- `categories` ve `transactions` verilerinin `App.tsx` seviyesinde zaten `selectedFlag`'e göre filtrelendiği varsayılıyor. Eğer öyleyse, `DeneyselTab` zaten doğru çalışıyor olabilir, sadece doğrulama ve ince ayar gerekebilir.
- Eğer `ReportData` filtrelenmiş değil de ham veri ise, filtreleme mantığını `DeneyselTab` içine veya hook seviyesine taşı.
