(() => {
  const id = 'poble-language-select';
  const languages = [['en', 'English'], ['ko', '한국어'], ['zh', '简体中文']];
  const currentLanguage = () => window.location.pathname.match(/^\/(ko|zh)(?:\/|$)/)?.[1] || 'en';

  function mount() {
    if (!document.body) return;
    let select = document.getElementById(id);
    if (!select) {
      const label = document.createElement('label');
      label.id = 'poble-language-picker';
      const text = document.createElement('span');
      text.textContent = 'Language / 언어 / 语言';
      text.className = 'poble-language-label';
      select = document.createElement('select');
      select.id = id;
      select.setAttribute('aria-label', 'Language / 언어 / 语言');
      languages.forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        const language = select.value;
        let page = window.location.pathname.replace(/^\/(ko|zh)(?=\/|$)/, '');
        if (!page || page === '/') page = '/poble-manual/index';
        const destination = (language === 'en' ? '' : '/' + language) + page;
        // Heading anchors differ between translations, so start at the same page's top.
        window.location.assign(destination);
      });
      label.append(text, select);
      document.body.appendChild(label);
    }
    const picker = select.parentElement;
    const sidebar = document.getElementById('sidebar');
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (desktop && sidebar) {
      if (picker.parentElement !== sidebar) sidebar.prepend(picker);
      picker.dataset.placement = 'sidebar';
    } else {
      if (picker.parentElement !== document.body) document.body.appendChild(picker);
      picker.dataset.placement = 'mobile';
    }
    const language = currentLanguage();
    if (select.value !== language) select.value = language;
  }

  let queued = false;
  const refresh = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => { queued = false; mount(); });
  };
  function start() {
    mount();
    new MutationObserver(refresh).observe(document.body, {childList: true, subtree: true});
    window.addEventListener('popstate', refresh);
    window.addEventListener('resize', refresh);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
