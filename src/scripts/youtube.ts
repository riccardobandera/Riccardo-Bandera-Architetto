// Video YouTube dei progetti: finché non si preme play c'è solo l'immagine del sito, nessuna richiesta a Google.
// Al clic il riquadro diventa il player di youtube-nocookie.com. Delegato sul documento, così funziona
// anche quando la pagina del progetto si apre in sovrapposizione dalla pagina Progetti.
document.addEventListener('click', (e) => {
  const play = (e.target as Element | null)?.closest<HTMLElement>('[data-yt-play]');
  const box = play?.closest<HTMLElement>('[data-yt]');
  const id = box?.dataset.yt;
  if (!box || !id || !/^[\w-]{11}$/.test(id)) return;
  e.preventDefault();
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  frame.title = box.dataset.ytTitle || 'Video del progetto';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.className = 'absolute inset-0 w-full h-full';
  box.replaceChildren(frame);
});
