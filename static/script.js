// Sayfa yüklendiğinde input alanına odaklan
document.getElementById("tahminInput").focus();

// Form gönderimini dinle
document.getElementById("tahminForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Formun otomatik gönderilmesini engelle
    tahminGonder();
});

// Enter tuşunu dinle
document.getElementById("tahminInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        tahminGonder();
    }
});

// Input alanına bir şey yazıldığında mesajın görünmesini sağla
document.getElementById("tahminInput").addEventListener("input", function () {
    const mesajDiv = document.getElementById("mesaj");
    if (mesajDiv.textContent.trim() !== "") {
        mesajDiv.style.visibility = "visible"; // Mesajı ekranda tut
    }
});

// Tahmin gönderme işlemi
function tahminGonder() {
    const tahminInput = document.getElementById("tahminInput");
    const tahmin = tahminInput.value;

    // Mesaj alanını güncelle
    const mesajDiv = document.getElementById("mesaj");
    mesajDiv.textContent = "Tahmininiz işleniyor...";
    mesajDiv.style.visibility = "visible"; // Mesajın ekranda kalmasını sağla

    // Flask'a POST isteği gönder
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `tahmin=${tahmin}`,
    })
        .then((response) => response.text())
        .then((html) => {
            // Sayfayı yenilemeden mesajı güncelle
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newMesaj = doc.getElementById("mesaj").textContent;
            mesajDiv.textContent = newMesaj;

            // Eğer doğru tahmin edildiyse input'u devre dışı bırak
            if (newMesaj.includes("Tebrikler")) {
                tahminInput.disabled = true;
                document.querySelector("button").disabled = true;
            } else {
                // Yanlış tahmin durumunda input alanını temizle ve odakla
                tahminInput.value = "";
                tahminInput.focus();
            }
        })
        .catch((error) => {
            console.error("Hata:", error);
            mesajDiv.textContent = "Lütfen tekrar deneyin.";
        });
}
