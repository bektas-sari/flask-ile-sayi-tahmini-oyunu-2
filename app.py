from flask import Flask, render_template, request, redirect, url_for, session
import random

app = Flask(__name__)
app.secret_key = "sifreli_anahtar"  # Session için gerekli

# Ana sayfa
@app.route("/", methods=["GET", "POST"])
def index():
    if "hedef_sayi" not in session:
        session["hedef_sayi"] = random.randint(1, 100)  # 1-100 arası rastgele sayı
        session["deneme_sayisi"] = 0

    mesaj = ""
    if request.method == "POST":
        tahmin = int(request.form["tahmin"])
        session["deneme_sayisi"] += 1

        if tahmin < session["hedef_sayi"]:
            mesaj = f"{tahmin} sayısı, tuttuğum sayıdan daha düşük. Daha yüksek bir sayı deneyin!"
        elif tahmin > session["hedef_sayi"]:
            mesaj = f"{tahmin} sayısı, tuttuğum sayıdan daha yüksek. Daha düşük bir sayı deneyin!"
        else:
            mesaj = f"Tebrikler! {session['deneme_sayisi']} denemede doğru tahmin ettiniz. Tuttuğum sayı {session['hedef_sayi']} idi."
            session.pop("hedef_sayi")  # Oyunu sıfırla

    return render_template("index.html", mesaj=mesaj)

# Oyunu sıfırla
@app.route("/reset")
def reset():
    session.pop("hedef_sayi", None)
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)