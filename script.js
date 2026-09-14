async function muatVideo() {
  try {
    const res = await fetch('data.json');
    const data = await res.json();
    render('video-terbaru', data.terbaru);
    render('video-populer', data.populer);
  } catch (err) {
    console.error('Gagal memuat data.json:', err);
  }
}

function render(targetId, daftar) {
  const target = document.getElementById(targetId);
  target.innerHTML = '';
  daftar.forEach(v => {
    const div = document.createElement('div');
    div.className = 'kartu-video';
    div.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${v.id}"
        title="${v.judul}"
        loading="lazy"
        allowfullscreen>
      </iframe>
      <div class="judul">${v.judul}</div>
    `;
    target.appendChild(div);
  });
}

function bagikan() {
  const data = {
    title: document.title,
    text: 'Cek channel YouTube saya!',
    url: window.location.href
  };
  if (navigator.share) {
    navigator.share(data).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link sudah dicopy!');
  }
}

(function() {
  const d = document;
  const s = d.createElement('script');
  s.src = 'https://nama-channel-anda.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();

muatVideo();
