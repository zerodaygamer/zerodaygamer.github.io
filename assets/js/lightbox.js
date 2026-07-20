/* Self-contained image lightbox for .prose images. No dependencies. */
(function () {
  var imgs = document.querySelectorAll('.prose img');
  if (!imgs.length) return;

  var box, boxImg, boxCap;

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');

    var hint = document.createElement('div');
    hint.className = 'lightbox__hint';
    hint.innerHTML = '<b>esc</b> / click to close';

    boxImg = document.createElement('img');
    boxCap = document.createElement('div');
    boxCap.className = 'lightbox__cap';

    box.appendChild(hint);
    box.appendChild(boxImg);
    box.appendChild(boxCap);
    document.body.appendChild(box);
    box.addEventListener('click', close);
  }

  function open(src, alt) {
    if (!box) build();
    boxImg.src = src;
    boxImg.alt = alt || '';
    boxCap.textContent = alt || '';
    boxCap.style.display = alt ? '' : 'none';
    document.body.classList.add('lb-open');
    box.style.display = 'flex';
    requestAnimationFrame(function () { box.classList.add('open'); });
  }

  function close() {
    if (!box) return;
    box.classList.remove('open');
    document.body.classList.remove('lb-open');
    setTimeout(function () { box.style.display = 'none'; boxImg.src = ''; }, 180);
  }

  imgs.forEach(function (img) {
    if (img.closest('a')) return;            // leave already-linked images alone
    img.addEventListener('click', function () {
      open(img.currentSrc || img.src, img.alt);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
