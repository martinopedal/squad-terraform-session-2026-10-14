(() => {
  'use strict';

  const dialog = document.querySelector('.navigation-dialog');
  const menuButton = document.querySelector('#open-navigation');
  const notesButton = document.querySelector('#open-notes');
  const liveMessage = document.querySelector('#navigation-status');
  const slideElements = [...document.querySelectorAll('.slides > section')];
  const objectURLs = new Map();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReceiver = new URLSearchParams(window.location.search).has('receiver');

  function reportError(message, error) {
    const banner = document.querySelector('#runtime-error');
    banner.textContent = message;
    banner.hidden = false;
    if (error) console.error(message, error);
  }

  function blocksPresentationKey(event) {
    const target = event.target;
    if (!(target instanceof Element)) return false;
    if (target.closest('input, select, textarea, video, dialog') ||
        (target instanceof HTMLElement && target.isContentEditable)) return true;
    return Boolean(target.closest('button, a')) &&
      ['Enter', ' ', 'Spacebar', 'Tab'].includes(event.key);
  }

  function updateNavigation() {
    const current = Reveal.getCurrentSlide();
    const overview = Reveal.isOverview();
    slideElements.forEach(slide => {
      // Overview surfaces select slides; their links and media controls stay inert.
      slide.inert = !overview && slide !== current;
      slide.querySelector('.slide-content').inert = overview;
    });
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.dataset.nav === current.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const label = current.querySelector('h1,h2')?.textContent || current.getAttribute('aria-label') || current.id;
    liveMessage.textContent = `${current.dataset.stageTime}: ${label}`;
  }

  function openMenu() {
    if (isReceiver || dialog.open) return;
    dialog.showModal();
    dialog.querySelector('[aria-current="page"], a, button').focus();
  }

  menuButton.addEventListener('click', openMenu);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => menuButton.focus());
  dialog.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = slideElements.findIndex(slide => slide.id === link.dataset.nav);
      dialog.close();
      Reveal.slide(target, 0, -1);
    });
  });

  notesButton.addEventListener('click', () => {
    if (window.location.protocol === 'file:') {
      reportError('Speaker notes need a local server. Run the documented serve command, then reopen this presentation.');
      return;
    }
    Reveal.getPlugin('notes').open();
  });

  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || typeof event.data !== 'string') return;
    if (!event.data.includes('"namespace":"reveal-notes"') || !event.data.includes('"type":"connected"')) return;
    const speakerDocument = event.source.document;
    if (speakerDocument.querySelector('#conference-notes-style')) return;
    const style = speakerDocument.createElement('style');
    style.id = 'conference-notes-style';
    style.textContent = `
      .speaker-controls-notes .value { font-family: 'Roboto', system-ui, sans-serif; color: #1A1B1B; }
      .speaker-controls-notes .value h2 { font-size: 21px; line-height: 1.25; margin: 0 0 14px; }
      .speaker-controls-notes .value p { font-size: 18px; line-height: 1.45; margin: 0 0 16px; }
      .speaker-controls-notes .value blockquote { font-size: 14px; margin: 0 0 18px; padding: 8px 12px; border-left: 3px solid #1A1B1B; background: #98F8FE; }
      .speaker-controls-notes .value blockquote p { font-size: 14px; line-height: 1.4; margin: 0; }
      .speaker-controls-notes .value details { margin: 0 0 16px; }
      .speaker-controls-notes .value summary { font-size: 14px; font-weight: 600; color: #1A1B1B; background: #98F8FE; padding: 8px 10px; cursor: pointer; }
      .speaker-controls-notes .value summary:focus-visible { outline: 3px solid #1A1B1B; outline-offset: 2px; }
      .speaker-controls-notes .value strong { color: #1A1B1B; }
    `;
    speakerDocument.head.append(style);
  });

  window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'n' && !blocksPresentationKey(event) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      openMenu();
    }
  });

  document.querySelectorAll('.attach-video').forEach(button => {
    const slide = button.closest('section');
    const input = slide.querySelector('.video-file');
    const video = slide.querySelector('video');
    const pending = slide.querySelector('.media-pending');
    const status = slide.querySelector('.media-status');
    const chapter = button.dataset.chapter;
    const expectedSeconds = window.presentationBuild.chapters.find(item => item.id === chapter).duration;
    let preview = false;

    button.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.mp4')) {
        status.textContent = 'Select an MP4 file. No file was loaded.';
        input.value = '';
        return;
      }
      video.pause();
      if (objectURLs.has(chapter)) URL.revokeObjectURL(objectURLs.get(chapter));
      const url = URL.createObjectURL(file);
      objectURLs.set(chapter, url);
      preview = true;
      video.src = url;
      video.hidden = false;
      pending.hidden = true;
      status.textContent = 'Local preview: review pending. Select Play when ready.';
      video.load();
      video.focus();
    });
    video.addEventListener('loadedmetadata', () => {
      if (!Number.isFinite(video.duration)) {
        status.textContent = 'Duration unavailable. Review this recording before delivery.';
        return;
      }
      const actual = Math.round(video.duration);
      const prefix = preview ? 'Local preview: review pending.' : 'Local recording loaded.';
      if (Math.abs(video.duration - expectedSeconds) > 1) {
        status.textContent = `${prefix} Duration ${actual}s; chapter target ${expectedSeconds}s.`;
      } else if (preview) {
        status.textContent = `${prefix} Duration matches; content still needs review.`;
      }
    });
    video.addEventListener('error', () => {
      video.pause();
      video.hidden = true;
      pending.hidden = false;
      status.textContent = 'Recording could not be loaded. Use the viewing guide or select another local MP4.';
    });
  });

  window.addEventListener('beforeunload', () => {
    for (const url of objectURLs.values()) URL.revokeObjectURL(url);
  });

  if (isReceiver) document.querySelector('.presentation-tools').hidden = true;

  Reveal.initialize({
    width: 1280,
    height: 720,
    margin: 0,
    minScale: 0.15,
    maxScale: 3,
    center: false,
    hash: true,
    history: true,
    controls: true,
    controlsTutorial: false,
    progress: true,
    slideNumber: 'c/t',
    showSlideNumber: 'all',
    transition: reducedMotion.matches ? 'none' : 'fade',
    transitionSpeed: 'fast',
    backgroundTransition: 'none',
    autoPlayMedia: false,
    autoSlide: 0,
    help: true,
    keyboardCondition: event => !dialog.open && !blocksPresentationKey(event),
    highlight: {
      beforeHighlight: hljs => {
        if (!hljs.getLanguage('hcl')) {
          hljs.registerLanguage('hcl', () => ({
            name: 'HCL',
            keywords: { literal: 'true false null', keyword: 'resource module variable output locals terraform provider assert' },
            contains: [hljs.HASH_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE, hljs.QUOTE_STRING_MODE, hljs.NUMBER_MODE]
          }));
        }
      }
    },
    plugins: [RevealHighlight, RevealNotes]
  }).then(() => {
    updateNavigation();
    Reveal.on('slidechanged', updateNavigation);
    Reveal.on('overviewshown', updateNavigation);
    Reveal.on('overviewhidden', updateNavigation);
    reducedMotion.addEventListener('change', event => Reveal.configure({ transition: event.matches ? 'none' : 'fade' }));
  }).catch(error => reportError('The presentation could not start. Check the local package and build output.', error));
})();
