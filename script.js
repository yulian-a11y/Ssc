// ===== GANTI 2 BARIS INI DENGAN PUNYA ANDA =====
const USERNAME = 'yulian-a';      // username GitHub Anda
const REPO = 'website-ku';         // nama repo
// ================================================

let semuaKonten = [];
let filterAktif = 'semua';

async function ambilKonten() {
  try {
    const res = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/issues?state=open&per_page=50`);
    const data = await res.json();
    semuaKonten = data.filter(i => !i.pull_request).map(i => ({
      judul: i.title,
      deskripsi: (i.body || '').split('\n')[0].slice(0, 120),
      gambar: ambilGambar(i.body || ''),
      tanggal: new Date(i.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      label: i.labels.map(l => l.name),
      url: i.html_url
    }));
    render();
  } catch (err) {
    document.getElementById('feed').innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#7A8A68;">Belum ada konten. Upload pertama Anda lewat GitHub Issues!</p>';
  }
}

function ambilGambar(text) {
  const md = text.match(/!\[.*?\]\((.*?)\)/);
  if (md) return md[1];
  const html = text.match(/<img[^>]+src="([^"]+)"/);
  if (html) return html[1];
  return null;
}

function render() {
  const feed = document.getElementById('feed');
  const data = filterAktif === 'semua' ? semuaKonten : semuaKonten.filter(k => k.label.includes(filterAktif));
  
  if (data.length === 0) {
    feed.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#7A8A68;padding:40px 20px;">Belum ada konten di kategori ini.</p>';
    return;
  }
  
  feed.innerHTML = data.map(k => `
    <a href="${k.url}" target="_blank" class="kartu">
      ${k.gambar ? `<img src="${k.gambar}" alt="${k.judul}" loading="lazy">` : ''}
      <div class="kartu-body">
        <h3>${k.judul}</h3>
        <p>${k.deskripsi}...</p>
        <div class="meta">
          ${k.label.map(l => `<span class="tag ${l === 'AI' ? 'ai' : ''}">${l}</span>`).join('')}
          <span>📅 ${k.tanggal}</span>
        </div>
      </div>
    </a>
  `).join('');
}

document.querySelectorAll('.chip').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(x => x.classList.remove('aktif'));
    c.classList.add('aktif');
    filterAktif = c.dataset.filter;
    render();
  });
});

function bagikan() {
  if (navigator.share) navigator.share({ title: document.title, url: location.href });
  else { navigator.clipboard.writeText(location.href); alert('Link dicopy!'); }
}

ambilKonten();
