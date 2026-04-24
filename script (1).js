
// ===== STATE =====
let dataBerat = JSON.parse(localStorage.getItem("dataBerat")) || [];
let chart;

// ===== UTIL =====
function el(id){ return document.getElementById(id); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ===== HITUNG =====
function hitungKalori(b,t,u,g,a,target){
  let bmr = (g==="pria") ? 10*b+6.25*t-5*u+5 : 10*b+6.25*t-5*u-161;
  let faktor={rendah:1.2,sedang:1.55,tinggi:1.725};
  let tdee=bmr*faktor[a];
  if(target==="turun") tdee-=300;
  if(target==="naik") tdee+=300;
  return Math.round(tdee);
}

function hitungIdeal(t,g){
  let d=t-100;
  return g==="pria"?d-(0.1*d):d-(0.15*d);
}

// ===== MENU DATABASE =====
const menuDB = {
  turun: {
    sarapan:[
      "Telur rebus + pisang",
      "Oatmeal + susu rendah lemak",
      "Ubi rebus + teh",
      "Roti gandum + selai",
      "Bubur kacang hijau",
      "Omelet sayur",
      "Tahu + brokoli"
    ],
    siang:[
      "½ nasi + ayam + sayur",
      "½ nasi + kangkung + tahu tempe",
      "Kentang + pepes tahu + telur",
      "Gado-gado",
      "½ nasi + lele bakar",
      "½ nasi + sup ayam",
      "Nasi merah + buncis + telur"
    ],
    malam:[
      "Buah + susu kedelai",
      "Sup ayam",
      "Salad + telur",
      "Dada ayam + sayur",
      "Tahu tempe + sayur",
      "Ikan + bayam",
      "Telur + tomat"
    ]
  },
  naik: {
    sarapan:[
      "Nasi kuning + telur",
      "Roti + selai + telur",
      "Bubur ayam",
      "Lontong sayur",
      "Nasi uduk",
      "Mie + telur",
      "Nasi soto"
    ],
    siang:[
      "Nasi padang",
      "Nasi + ayam geprek",
      "Nasi rames",
      "Nasi goreng",
      "Mie ayam",
      "Nasi + lele",
      "Nasi + tongkol"
    ],
    malam:[
      "Nasi goreng",
      "Pecel lele",
      "Sate ayam",
      "Martabak",
      "Nasi + ayam",
      "Kwetiau",
      "Soto santan"
    ]
  }
};

// ===== RULE =====
const rules = {
  pria:{
    turun:{sarapan:[0,1,5],siang:[0,4,6],malam:[3,5],mod:"Extra protein"},
    naik:{sarapan:[0,4,6],siang:[0,1,5],malam:[1,4],mod:"Extra karbo + protein"}
  },
  wanita:{
    turun:{sarapan:[2,3,6],siang:[1,2,5],malam:[0,4,6],mod:"Porsi normal"},
    naik:{sarapan:[1,2,3],siang:[2,3,6],malam:[2,3,5],mod:"Surplus kalori"}
  }
};

// ===== GENERATE =====
function generateMenu(g,target,a){

  let r = rules[g][target];

  let sarapan = menuDB[target].sarapan[rand(r.sarapan)];
  let siang   = menuDB[target].siang[rand(r.siang)];
  let malam   = menuDB[target].malam[rand(r.malam)];

  let aktivitas="Normal";
  if(a==="rendah") aktivitas="Ringan";
  if(a==="tinggi") aktivitas="Berat (tambah porsi)";

  return {sarapan,siang,malam,mod:r.mod,aktivitas};
}

// ===== PROSES =====
function proses(){

  let b=+el("berat").value;
  let t=+el("tinggi").value;
  let u=+el("umur").value;

  if(!b||!t||!u){
    tampil("Isi semua data!");
    return;
  }

  el("loading").classList.remove("hidden");

  requestAnimationFrame(()=>{

    let g=el("gender").value;
    let a=el("aktivitas").value;
    let target=el("target").value;

    let ideal=hitungIdeal(t,g);

    if(b<ideal && target==="turun"){
      tampil("Tidak bisa turun (di bawah ideal)");
      return;
    }

    if(b>ideal && target==="naik"){
      tampil("Tidak bisa naik (di atas ideal)");
      return;
    }

    let kal=hitungKalori(b,t,u,g,a,target);
    let menu=generateMenu(g,target,a);

    dataBerat.push(b);
    localStorage.setItem("dataBerat",JSON.stringify(dataBerat));

    updateChart();

    tampil(`
      <div class="fade">
        <h3>${kal} kkal / hari</h3>

        <div class="meal-box">
          <p>🌅 ${menu.sarapan}</p>
          <p>🌞 ${menu.siang}</p>
          <p>🌙 ${menu.malam}</p>
        </div>

        <p><b>Modifikasi:</b> ${menu.mod}</p>
        <p><b>Aktivitas:</b> ${menu.aktivitas}</p>
        <p><b>Berat Ideal:</b> ${ideal.toFixed(1)} kg</p>
      </div>
    `);

  });
}

// ===== OUTPUT =====
function tampil(msg){
  el("loading").classList.add("hidden");
  el("hasil").innerHTML = msg;
}

// ===== CHART =====
function updateChart(){
  let ctx = el("chart");
  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:dataBerat.map((_,i)=>`Hari ${i+1}`),
      datasets:[{label:"Berat",data:dataBerat}]
    }
  });
}

updateChart();