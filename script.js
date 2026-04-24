// ... (Bagian atas script tidak perlu berubah)

// Update fungsi tampil()
function tampil(msg) {
  el("loading").classList.add("hidden");

  // Jika pesan adalah hasil perhitungan (bukan error string)
  // kita bungkus dengan class 'result-card' agar stylingnya konsisten
  if (msg.includes("kkal")) {
    el("hasil").innerHTML = `<div class="card result-card fade">${msg}</div>`;
  } else {
    el("hasil").innerHTML =
      `<div class="card" style="border: 1px solid #ef4444">${msg}</div>`;
  }
}
