let sepet = [];

// Sayfa yüklendiğinde sepet ve kullanıcı bilgilerini yükle
window.addEventListener('DOMContentLoaded', () => {
    const kayitliSepet = localStorage.getItem('sepet');
    if (kayitliSepet) {
        sepet = JSON.parse(kayitliSepet);
        // Eski sepet verilerine resim özelliği ekleyin (eğer yoksa)
        sepet = sepet.map(item => {
            if (!item.hasOwnProperty('resim')) {
                item.resim = '';
            }
            return item;
        });
        localStorage.setItem('sepet', JSON.stringify(sepet));
        guncelleSepetSayaci();
    }
    guncelleKullaniciBilgisi();
    sepeteEkleOlaylari();
    initFiltreleme();
});

// Sepet sayacını güncelle
function guncelleSepetSayaci() {
    const sayac = document.querySelector('.sepet-sayaci');
    if (sayac) sayac.textContent = sepet.length;
}

// Sepeti göster
function gosterSepet() {
    if (sepet.length === 0) return alert('Sepetiniz boş!');

    const toplam = sepet.reduce((t, u) => {
        const f = parseFloat(u.fiyat.replace(/[^0-9,.]/g, '').replace(',', '.'));
        return t + (isNaN(f) ? 0 : f);
    }, 0);

    let html = `
    <div id="sepet-popup" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;justify-content:center;align-items:center;">
        <div style="background:#fff;padding:20px;border-radius:10px;width:90%;max-width:700px;max-height:80vh;overflow-y:auto;position:relative;">
            <h2 style="margin-top:0;color:#163962;">Sepetiniz</h2>
            <button onclick="kapatSepet()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:20px;cursor:pointer;">×</button>`;

    sepet.forEach((u, i) => {
        html += `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            ${u.resim ? `<img src="${u.resim}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" alt="${u.ad}">` : ''}
                            <div>
                                <strong>${u.ad}</strong><br>
                                <span style="color:#163962;font-weight:bold;">${u.fiyat}</span>
                            </div>
                        </div>
                        <button onclick="urunuSil(${i})" style="background:#dc3545;color:#fff;border-radius:5px;cursor:pointer;width:50px; height:40px;margin-left:10px;">Sil</button>
                    </div>`;
    });

    html += `
            <div style="text-align:right;font-weight:bold;margin-top:20px;font-size:18px;">Toplam: <span style="color:#163962;">${toplam.toFixed(3)},00 TL</span></div>
            <div style="text-align:center;margin-top:20px;">
                <button onclick="kapatSepet()" style="background:#163962;color:#fff;border:none;padding:10px 20px;border-radius:5px;margin-right:10px;">Kapat</button>
                <button onclick="alisverisiTamamla()" style="background:#28a745;color:#fff;border:none;padding:10px 20px;border-radius:5px;">Alışverişi Tamamla</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
}

function kapatSepet() {
    const popup = document.getElementById('sepet-popup');
    if (popup) popup.remove();
}

function urunuSil(index) {
    sepet.splice(index, 1);
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelleSepetSayaci();
    kapatSepet();
    gosterSepet();
}

function alisverisiTamamla() {
    const kullanici = localStorage.getItem('kullanici');
    if (!kullanici) return gosterGirisPopup();

    const ad = JSON.parse(kullanici).ad;
    alert(`Teşekkürler ${ad}, ${sepet.length} ürün sipariş edildi.`);
    sepet = [];
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelleSepetSayaci();
    kapatSepet();
}

// Giriş popup'ı göster
function gosterGirisPopup() {
    if (document.getElementById('giris-popup')) return;

    // CSS ekle
    const style = document.createElement('style');
    style.textContent = `
        .input:focus-within {
            transform: scale(1.05);
        }
        .input{
            transition:all .6s;
        }
    `;
    document.head.appendChild(style);

    // HTML içeriği
    const html = `
    <div id="giris-popup" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;justify-content:center;align-items:center;">
        <div style="background:#fff;padding:30px;border-radius:10px;width:90%;max-width:400px;position:relative;">
            <button onclick="kapatGirisPopup()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:20px;cursor:pointer;">×</button>
            <h2 style="margin-top:0;color:#163962;">Giriş Yap</h2>
            <div class="input">
                <input type="text" id="kullanici-adi" placeholder="Adınızı girin" style="width:100%;padding:10px;margin-bottom:20px;border:1px solid #ccc;border-radius:5px;">
            </div>
            <div class="input">
                <input type="email" id="e-posta" placeholder="E-posta adresinizi girin" style="width:100%;padding:10px;margin-bottom:20px;border:1px solid #ccc;border-radius:5px;">
            </div>
            <div class="input">
                <input type="password" id="sifre" placeholder="Şifrenizi girin" style="width:100%;padding:10px;margin-bottom:20px;border:1px solid #ccc;border-radius:5px;">
            </div>
            <button onclick="kullaniciGirisi()" style="background:#28a745;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Giriş Yap</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
}

function kapatGirisPopup() {
    const popup = document.getElementById('giris-popup');
    if (popup) popup.remove();
}

// Kullanıcı bilgilerini güncelle
function guncelleKullaniciBilgisi() {
    const kullanici = localStorage.getItem('kullanici');
    const kullaniciAdElement = document.getElementById('kullanici-ad');

    if (kullaniciAdElement) {
        if (kullanici) {
            const userData = JSON.parse(kullanici);
            kullaniciAdElement.textContent = userData.ad || userData.email || 'Kullanıcı';
        } else {
            kullaniciAdElement.textContent = 'Giriş Yap';
        }
    }
}

// "Sepete Ekle" butonlarına olay ekle
function sepeteEkleOlaylari() {
    // Tüm "Sepete Ekle" butonlarını seç
    const sepeteEkleButonlari = document.querySelectorAll('.sepeteekle');

    sepeteEkleButonlari.forEach((buton, index) => {
        // Buton zaten tıklanmışsa tekrar ekleme
        if (buton.hasAttribute('data-sepet-event')) return;

        // Olay dinleyiciyi ekle
        buton.addEventListener('click', function () {
            // Ürün bilgilerini al
            const urunKutusu = this.closest('.ekrankartları') || this.parentElement;
            const fiyatElement = urunKutusu.querySelector('b');

            // Ürün adını almak için HTML yapısını analiz et
            // img'den sonra gelen metni almak için clone yap ve içeriği filtrele
            const clone = urunKutusu.cloneNode(true);
            const imgElement = clone.querySelector('img');
            const fiyatClone = clone.querySelector('b');
            const sepeteEkleClone = clone.querySelector('.sepeteekle');

            if (imgElement) imgElement.remove();
            if (fiyatClone) fiyatClone.remove();
            if (sepeteEkleClone) sepeteEkleClone.remove();

            // Kalan metni al ve temizle
            let ad = clone.textContent.trim();

            // Metni satır sonlarına göre böl ve sadece ürün adını içeren kısmı al
            const lines = ad.split(/\r?\n/);
            let productName = '';

            for (let line of lines) {
                line = line.trim();
                // "Sepete Ekle" veya boş satırları atla
                if (line && !line.includes('Sepete Ekle') && line.length > 1) {
                    productName = line;
                    break;
                }
            }

            if (fiyatElement && productName) {
                const fiyat = fiyatElement.textContent;
                // Ürün resmini al
                const imgElement = urunKutusu.querySelector('img');
                const resimUrl = imgElement ? imgElement.src : '';

                // Ürünü sepete ekle
                sepet.push({
                    ad: productName,
                    fiyat: fiyat,
                    resim: resimUrl
                });

                // Sepeti localStorage'a kaydet
                localStorage.setItem('sepet', JSON.stringify(sepet));

                // Sepet sayacını güncelle
                guncelleSepetSayaci();

                // Kullanıcıya bildirim göster
                alert(`${productName} sepete eklendi!`);
            } else {
                console.error('Ürün bilgileri alınamadı', { fiyatElement, productName });
            }
        });

        // Butonun olay eklendiğini işaretle
        buton.setAttribute('data-sepet-event', 'true');
    });
}

// Kullanıcı girişi yap
function kullaniciGirisi() {
    const ad = document.getElementById('kullanici-adi').value;
    const email = document.getElementById('e-posta').value;
    const sifre = document.getElementById('sifre').value;

    if (!ad || !email || !sifre) {
        return alert('Lütfen tüm alanları doldurun!');
    }

    // Kullanıcı bilgilerini localStorage'a kaydet
    const kullanici = {
        ad: ad,
        email: email
    };

    localStorage.setItem('kullanici', JSON.stringify(kullanici));

    // Popup'ı kapat
    kapatGirisPopup();

    // Kullanıcı bilgilerini güncelle
    guncelleKullaniciBilgisi();

    alert('Giriş başarılı!');
}

// Kullanıcı çıkışı yap
function cikisYap() {
    localStorage.removeItem('kullanici');
    guncelleKullaniciBilgisi();
    alert('Çıkış yapıldı!');
}

// Hesap menüsü açılır
function hesapMenuAc() {
    const kullanici = localStorage.getItem('kullanici');

    if (kullanici) {
        // Kullanıcı giriş yapmışsa, çıkış yap veya kullanıcı bilgilerini göster
        const kullaniciData = JSON.parse(kullanici);
        const secim = confirm(`${kullaniciData.ad || kullaniciData.email} olarak giriş yapıldı. Çıkış yapmak ister misiniz?`);

        if (secim) {
            cikisYap();
        }
    } else {
        // Kullanıcı giriş yapmamışsa, giriş yap popup'ını göster
        gosterGirisPopup();
    }
}

// Kayıt ol fonksiyonu
function kayitOl() {
    const ad = document.getElementById('kullanici-adi').value;
    const email = document.getElementById('e-posta').value;
    const sifre = document.getElementById('sifre').value;

    if (!ad || !email || !sifre) {
        return alert('Lütfen tüm alanları doldurun!');
    }

    // Kullanıcı bilgilerini localStorage'a kaydet
    const kullanici = {
        ad: ad,
        email: email
    };

    localStorage.setItem('kullanici', JSON.stringify(kullanici));

    // Popup'ı kapat
    kapatGirisPopup();

    // Kullanıcı bilgilerini güncelle
    guncelleKullaniciBilgisi();

    alert('Kayıt başarılı!');
}

// Contact form submission function
function gonder() {
    console.log('Gonder function called'); // Debugging line

    // Get form elements
    const nameInput = document.querySelector('input[placeholder="Adınız"]');
    const emailInput = document.querySelector('input[placeholder="E-Posta Adresiniz"]');
    const messageTextarea = document.querySelector('textarea[placeholder="Mesajınızı Yazınız"]');

    // Clear previous validation messages
    clearValidationMessages();

    let isValid = true;

    // Validate required fields
    if (!nameInput.value.trim()) {
        showValidationMessage(nameInput, 'Lütfen Adınızı doldurun!');
        if (isValid) {
            nameInput.focus();
            isValid = false;
        }
    }

    if (!emailInput.value.trim()) {
        showValidationMessage(emailInput, 'Lütfen E-Posta Adresinizi doldurun!');
        if (isValid) {
            emailInput.focus();
            isValid = false;
        }
    }

    // Validate email format if email field is not empty
    if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        showValidationMessage(emailInput, 'Lütfen geçerli bir e-posta adresi girin!');
        if (isValid) {
            emailInput.focus();
            isValid = false;
        }
    }

    if (!messageTextarea.value.trim()) {
        showValidationMessage(messageTextarea, 'Lütfen Mesajınızı Yazınız!');
        if (isValid) {
            messageTextarea.focus();
            isValid = false;
        }
    }

    // If all validations pass, show success message and redirect
    if (isValid) {
        alert('Bildiriminiz Alındı En Kısa Zamanda e-posta Üzerinden Dönüş Yapılacaktır');
        window.location.href = 'index.html';
    }
}

// Function to show validation message next to input
function showValidationMessage(inputElement, message) {
    // Remove any existing validation message for this input
    const existingMessage = inputElement.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create validation message element
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'validation-message';
    messageElement.style.color = '#dc3545';
    messageElement.style.fontSize = '14px';
    messageElement.style.marginTop = '5px';
    messageElement.style.fontWeight = 'bold';

    // Add the message after the input
    inputElement.parentNode.appendChild(messageElement);
}

// Function to clear all validation messages
function clearValidationMessages() {
    const messages = document.querySelectorAll('.validation-message');
    messages.forEach(message => message.remove());
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Add input event listeners to clear validation messages when user starts typing
function setupValidationClearing() {
    const formInputs = document.querySelectorAll('form input, form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            const message = this.parentNode.querySelector('.validation-message');
            if (message) {
                message.remove();
            }
        });
    });
}

// Initialize validation clearing when DOM is loaded
window.addEventListener('DOMContentLoaded', setupValidationClearing);

// Sol menü filtreleme işlemleri
function initFiltreleme() {
    const filterContainer = document.querySelector('.dmenu');
    if (!filterContainer) return;

    // Checkboxları hr etiketlerine göre gruplara ayırıyoruz
    const groups = [];
    let currentGroup = [];

    Array.from(filterContainer.children).forEach(child => {
        if (child.tagName === 'HR') {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        } else if (child.tagName === 'INPUT' && child.type === 'checkbox') {
            let labelText = '';
            let nextNode = child.nextSibling;
            // Kardeş düğümleri gezip metinleri al (a etiketlerini de dahil et)
            while (nextNode && nextNode.tagName !== 'BR' && nextNode.tagName !== 'INPUT' && nextNode.tagName !== 'HR') {
                if (nextNode.nodeType === 3) {
                    labelText += nextNode.textContent;
                } else if (nextNode.tagName === 'A') {
                    labelText += nextNode.textContent;
                }
                nextNode = nextNode.nextSibling;
            }

            // Filtre kelimelerini güvenilir eşleşme için normalize et
            let val = labelText.trim().toLowerCase();
            val = val.replace(/rayzen/g, 'ryzen'); // rayzen yazım yanlışlarını düzelt
            val = val.replace(/core i/g, 'i');     // "core i5" ile "intel i5" eşleşsin diye
            val = val.replace(/\s+/g, '');         // boşlukları tamamen kaldır

            child.filterValue = val;
            currentGroup.push(child);
            child.addEventListener('change', calistirFiltreler);
        }
    });

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    filterContainer.filterGroups = groups;
}

function calistirFiltreler() {
    const filterContainer = document.querySelector('.dmenu');
    if (!filterContainer || !filterContainer.filterGroups) return;

    const groups = filterContainer.filterGroups;

    // Sadece seçili olan filtreleri gruplara göre al
    const activeGroups = [];
    groups.forEach(group => {
        const checked = group.filter(cb => cb.checked).map(cb => cb.filterValue);
        if (checked.length > 0) {
            activeGroups.push(checked);
        }
    });

    const products = document.querySelectorAll('.icerik .res > div.ekrankartları');

    products.forEach(product => {
        // Dummy/boş kutuları kontrol et
        if (product.style.zIndex === '-1' || !product.textContent.trim()) {
            product.style.display = activeGroups.length > 0 ? 'none' : '';
            return;
        }

        if (activeGroups.length === 0) {
            product.style.display = '';
            return;
        }

        let productText = product.textContent.toLowerCase();
        let productHTML = product.innerHTML.toLowerCase();

        // Klasör isimlerinde geçen değerleri de (örn: am5, 1tb) bulabilmek için html ve text birleştir
        let searchCari = productText + " " + productHTML;
        searchCari = searchCari.replace(/\s+/g, ''); // boşluksuz hali

        let matchesAllGroups = true;

        // Her bir filtre grubunda en az bir eşleşme olmak zorunda (AND mantığı)
        for (let conditionGroup of activeGroups) {
            let matchesThisGroup = false;
            // Grup içindeki şıklarda herhangi biri tutuyorsa o gruptan geçer (OR mantığı)
            for (let filterVal of conditionGroup) {
                if (searchCari.includes(filterVal)) {
                    matchesThisGroup = true;
                    break;
                }
            }
            if (!matchesThisGroup) {
                matchesAllGroups = false;
                break;
            }
        }

        if (matchesAllGroups) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}