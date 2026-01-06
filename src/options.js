'use strict';

// const -------------
const INSTEAD_OF_EMPTY = {
};
const TIMERS = {};
const NOP = () => {};
const CSS_TEMPLATE = `
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">{bgshape}{fgshape}</svg>');
  filter: drop-shadow(0 0 5px {shcolor});
  background-size: 48px 48px;
  height: 48px;
  width: 48px;
  transition: 300ms;
  display: inline-block;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  z-index: 2147483647;
`;
const SHAPES = {
  fg: [
    { name: 'default', svg: '<path stroke="{fg}" fill="none" stroke-linecap="round" d="M15 14.5a4 4 0 1 1 1-2m-1.5-1l1.5 1.5 1.5-1.5"/>' },
    { name: 'plus', svg: '<path stroke="{fg}" fill="none" d="M12 8v8m-4-4h8"/>' },
    { name: 'cross', svg: '<path stroke="{fg}" fill="none" d="M9 9l6 6m0-6l-6 6"/>' },
    { name: 'heart', svg: '<path stroke="{fg}" fill="none" d="M12 16c0 0 0 0 3-2.5s-1-6-3-2c-2-4-6-0.5-3 2c3 2.5 3 2.5 3 2.5z"/>' },
    { name: 'flower', svg: '<path stroke="{fg}" fill="none" stroke-width="0.4" d="M12 12a2 2 0 1 0 0.01 0za2 2 0 1 0-0.01 0.2za2 2 0 1 0 0-0.01za2 2 0 1 0-0.6-0.1z"/>' },
    { name: 'star', svg: '<path stroke="{fg}" fill="none" d="M12 7.5 13.06 10.54 16.28 10.61 13.71 12.56 14.65 15.64 12 13.8 9.35 15.64 10.29 12.56 7.72 10.61 10.94 10.54z"/>' },
    { name: 'sakura', svg: '<path fill="{fg}" d="M12 8l0.5-1q1.2 1.4 1.1 2.8q1 -0.6 3 0.2l-0.8 0.7 1.1 0.2q-1 1.7-2.3 2q1 1 0.7 2.9l-0.9-0.6 0.1 1.1q-1.3-0.1-2.5-1.5q-1 1.3-2.5 1.5l0.1-1-0.9 0.4q-0.3-1.2 0.6-2.8q-1.3-0.5-2.2-2l1-0.1-0.7-0.8q1.6-0.8 3-0.2q-0.3-1 1.1-2.8z"/>' },
    { name: 'fox', svg: '<path fill="{fg}" d="M12 10l2-1.7 0.7 2.7 1.3 2-4 2.3-4-2.3 1.3-2 0.7-2.7z"/>' },
    { name: 'rabbit', svg: '<path fill="{fg}" transform="scale(0.5)" d="M14 28q0 5 10 5 10 0 10-5 0-3-3-5c4-12-7-11-5-1.5q-2-0.5-4 0c1-10-9-10-5 1.5q-3 1.5-3 5"/>' },
    { name: 'bear', svg: '<path fill="{fg}" transform="scale(0.5)" d="M14 28q1 5 10 5 9.5 0 10-5 0.5-4-2-6c5-6-7-9 -6-2q-2-0.5-4 0c1-7-11-4-6 2q-2.5 2-2 6"/>' },
    { name: 'umbrella', svg: '<g fill="{fg}" transform="rotate(-30 12 12) translate(7 7) scale(0.4)"><path d="M1.5 15c-4-18 25-18 21 0q-3.5-2-7 0-3.5-2-7 0-3.5-2-7 0"/><circle cx="12" cy="1" r="1"/><path d="M11 13v7q0 4 4 4 4 0 4-4h-2q0 2-2 2-2 0-2-2v-7"/></g>' },
    { name: 'spiral', svg: '<path stroke="{fg}" fill="none" d="M12 12 c1.8 0 1.8 2.16 0 2.4 c-3 0-3-4.2 0-4.44 c4.56-0.6 5.04 6.6 0 6.72 c-6-0.24-6-8.4 0-8.88 c3.6-0.24 6 2.4 5.76 6 "/>' },
    { name: 'face', svg: '<path stroke="{fg}" fill="none" d="M 9 13q1.5 2 3 0q1.5 2 3 0m2-3v2m-10 0v-2"/>' },
    { name: 'empty', svg: '' },
  ],
  bg: [
    { name: 'circle', svg: '<circle fill="{bg}" cx="12" cy="12" r="12"/>' },
    { name: 'hex', svg: '<path fill="{bg}" d="M24 12 18 22.4 6 22.4 0 12 6 1.6 18 1.6z"/>' },
    { name: 'heart', svg: '<path fill="{bg}" d="M12 22c0 0 0 0 8.5-8s-3-18-8.5-8c-6-10-17 0.5-8.5 8c8.5 8 8.5 8 8.5 8z"/>' },
    { name: 'squre', svg: '<path fill="{bg}" d="M12 0l12 12-12 12-12-12z"/>' },
    { name: 'star', svg: '<path fill="{bg}" d="M12 0l3.9 6.39 7.1 1.61-4.7 5.56 0.5 7.37-6.8-2.7-6.8 2.7 0.4-7.57-4.6-5.36 7-1.7z"/>', y: 2 },
    { name: 'sakura', svg: '<path fill="{bg}" d="M12 2.5l1.045 -2.299q3.553 3.553 2.404 6.479q2.195 -1.359 6.897 0.418l-1.881 1.568l2.508 0.418q-2.299 3.971 -4.9 4.703q2.299 2.299 1.568 6.688l-2.09 -1.359l0.209 2.508q-3.031 -0.209 -5.8 -3.449q-2.717 3.24 -5.748 3.449l0.209 -2.404l-2.09 1.045q-1.254 -3.135 1.6 -6.479q-3.553 -0.836 -5.121 -4.703l2.299 -0.209l-1.568 -1.881q3.658 -1.881 6.897 -0.418q-0.627 -2.613 2.508 -6.479z"/>' },
    { name: 'fox', svg: '<path fill="{bg}" d="M12 5l6-5 2 8 4 6-12 7-12-7 4-6 2-8z"/>', y: 3 },
    { name: 'rabbit', svg: '<path fill="{bg}" d="M2 14q0 5 10 5 10 0 10-5 0-3-3-5c4-12-7-11-5-1.5q-2-0.5-4 0c1-10-9-10-5 1.5q-3 1.5-3 5"/>', y: 4 },
    { name: 'bear', svg: '<path fill="{bg}" d="M2 14q1 5 10 5 9.5 0 10-5 0.5-4-2-6c5-6-7-9 -6-2q-2-0.5-4 0c1-7-11-4-6 2q-2.5 2-2 6"/>', y: 4 },
    { name: 'umbrella', svg: '<g fill="{bg}" transform="rotate(-30 12 12) translate(0 3.5)"><path d="M1.5 15c-4-18 25-18 21 0q-3.5-2-7 0-3.5-2-7 0-3.5-2-7 0"/><circle cx="12" cy="1" r="1"/><path d="M11 11.5v7q0 4 4 4 4 0 4-4h-2q0 2-2 2-2 0-2-2v-7"/></g>', y: -2 },
    { name: 'fish', svg: '<path fill="{bg}" d="M2 11.7l-1-0.7q8-4 19 1l3-2q-1 2.5 0 5l-3-2q-8 4-18.9-0.8z"/>' },
    { name: 'empty', svg: '' },
  ],
};

// fields ------------
let initialized = false;
let openedDlg;
const dlgs = {};

// utils -------------
const byId = id => document.getElementById(id);

const byClass = (elm, clazz) => elm.getElementsByClassName(clazz)[0];

const allByClass = (elm, clazz) => !clazz ? document.getElementsByClassName(elm) : elm.getElementsByClassName(clazz);

const parentByClass = (elm, clazz) => {
  for (let e = elm; e?.classList; e = e.parentNode) {
    if (e.classList.contains(clazz)) return e;
  }
};

const toggleClass = (b, clazz, ...elms) => {
  for (const elm of elms) {
    b ? elm.classList.add(clazz) : elm.classList.remove(clazz);
  }
};

const editStart = (...elms) => {
  for (const elm of elms) {
    elm.classList.add('editing');
    elm.removeAttribute('data-editEnd');
  }
};

const editEnd = (...elms) => {
  for (const elm of elms) {
    elm.setAttribute('data-editEnd', 1);
  }
  setTimeout(() => {
    for (const elm of elms) {
      if (elm.getAttribute('data-editEnd')) {
        elm.classList.remove('editing');
        elm.removeAttribute('data-editEnd');
      }
    }
  }, 1000);
};

const resetTimer = (name, f, msec) => {
  clearTimeout(TIMERS[name]);
  TIMERS[name] = setTimeout(f, msec);
};

const storageValue = async name => {
  try {
    const v = await browser.storage.local.get(name);
    return v ? v[name] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getMessage = (s) => {
  if (!s) return s;
  const key = s.replace(/[^0-9a-zA-Z_]/g, '_');
  return browser.i18n.getMessage(key) || s;
};

const dataTargetId = e => e.target.getAttribute('data-targetId');

const ifById = id => (typeof id === 'string') ? byId(id): id;
const fadeout = elm => { ifById(elm).classList.add('transparent'); };
const fadein = elm => { ifById(elm).classList.remove('transparent'); };

// DOM objects --------------
const $templates = byId('templates');
const $bidingForms = allByClass('js-binding');

// Color dialog -------------
const hex = d => Number(d).toString(16).padStart(2, '0');
dlgs.colorDlg = {
  targetId: null,
  rgb: null,
  setRGB: rgb => {
    dlgs.colorDlg.rgb = rgb;
    byId('sliderA').style.background =
      `linear-gradient(to right, transparent, ${rgb})`;
    for (const c of allByClass(byId('colorDlg'), 'color-tile')) {
      toggleClass(
        c.getAttribute('data-c') === rgb,
        'color-tile-selected',
        c
      );
    }
  },
  onShow: id => {
    dlgs.colorDlg.targetId = id;
    const elm = byId(id);
    const a = byId('sliderA');
    a.style.color = elm.value;
    requestAnimationFrame(() => {
      const rgba = getComputedStyle(a).color.match(/[0-9.]+/g);
      a.value = rgba.length === 4 ? Math.round(Number(rgba[3]) * 255) : 255;
      const hexRGB = `#${hex(rgba[0])}${hex(rgba[1])}${hex(rgba[2])}`;
      dlgs.colorDlg.setRGB(hexRGB);
    });
  },
  onHide: NOP,
  onSubmit: () => {
    const a = Number(byId('sliderA').value) || 0;
    const t = byId(dlgs.colorDlg.targetId);
    t.value = dlgs.colorDlg.rgb + (a !== 255 ? hex(a) : '');
    onChangeColorText({ target: t });
  },
  init: () => {
    const f = document.createDocumentFragment();
    for (const c of [
      '#a4c639', // android green
      '#3fe1b0', // green
      '#00b3f4', // blue
      '#9059ff', // violet
      '#ff6bba', // pink
      '#e22850', // red
      '#ff8a50', // orange
      '#ffd567', // yellow
      '#f9f9fa', // white
      '#52525e', // dark theme face
      '#23222b', // black
    ]) {
      const t = document.createElement('div');
      t.className = 'color-tile';
      t.style.background = c;
      t.setAttribute('data-c', c);
      // only white and black have border.
      if (c === '#f9f9fa' || c === '#52525e' || c === '#23222b') {
        t.className += ' color-tile-with-border'
      }
      f.appendChild(t);
    }
    const p = byId('pallet');
    p.appendChild(f);
    p.addEventListener('click', e => {
      if (!e.target.classList.contains('color-tile')) return;
      const v = e.target.getAttribute('data-c');
      dlgs.colorDlg.setRGB(v);
    });
  },
};
const colorPreview = i => byClass(i.parentNode, 'color-preview');
const onChangeColorText = e => {
  const id = e.target.id;
  resetTimer(`onchangecolortext_${id}`, () => {
    const value = e.target.value || INSTEAD_OF_EMPTY[id];
    colorPreview(e.target).style.backgroundColor = value;
    saveBindingValues();
  }, initialized ? 250 : 0);
};

// Shapes -------------------
const setupShapes = () => {
  for (const fgbg of ['fg', 'bg']) {
    const f = document.createDocumentFragment();
    for (const s of SHAPES[fgbg]) {
      const item = document.createElement('DIV');
      item.className = `shape shape-${fgbg}`;
      item.setAttribute('data-shape-name', s.name);
      const svg = s.svg.replace(`{${fgbg}}`, 'black');
      if (svg) {
        item.style.maskImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${svg}</svg>')`;
        item.style.translate = `0 ${s.y || 0}px`;
      }
      f.appendChild(item);
    }
    byId(`${fgbg}shape`).appendChild(f);
  }
  highlightSelected();
  addEventListener('click', e => {
    const name = e.target.getAttribute('data-shape-name');
    if (name) {
      PrettyRefresh.ini[e.target.parentNode.id] = name;
      highlightSelected();
      saveBindingValues();
    }
  });
};

const highlightSelected = () => {
  for (const fgbg of ['fg', 'bg']) {
    const key = `${fgbg}shape`;
    for (const item of allByClass(byId(key), 'shape')) {
      toggleClass(
        item.getAttribute('data-shape-name') === PrettyRefresh.ini[key],
        'shape-selected',
        item
      );
    }
  }
};

// Save ---------------------
const saveBindingValues = async () => {
  clearTimeout(TIMERS.saveBindingValues);
  for (const elm of $bidingForms) {
    const ini = PrettyRefresh.ini;
    const t = elm.getAttribute('data-type') || elm.type;
    if (t === 'checkbox') {
      ini[elm.id] = elm.checked;
    } else if (t === 'radio') {
      if (elm.checked) {
        ini[elm.name] = elm.value;
      }
    } else if (elm.value === INSTEAD_OF_EMPTY[elm.id]) {
      ini[elm.id] = null;
    } else if (t === 'number') {
      if (elm.value.match(/^\d+$/)) {
        ini[elm.id] = Number(elm.value);
      }
    } else {
      ini[elm.id] = elm.value;
    }
  }
  PrettyRefresh.ini.css = CSS_TEMPLATE
    .replace('{bgshape}', getShapeCSS('bg'))
    .replace('{fgshape}', getShapeCSS('fg'))
    .replace('{shcolor}', PrettyRefresh.ini.shcolor)
  await saveIni();
  PrettyRefresh.loadIni();
};
const saveIni = async () => {
  await browser.storage.local.set({ 'pretty_refresh': PrettyRefresh.ini });
};
const saveBindingValuesDelay = () => {
  resetTimer('saveBindingValues', saveBindingValues, 3000);
};
const getShapeCSS = (fgbg) => {
  const s = SHAPES[fgbg].find(v => v.name === PrettyRefresh.ini[`${fgbg}shape`]);
  return s.svg.replace(`{${fgbg}}`, PrettyRefresh.ini[`${fgbg}color`].replace('#', '%23'));
};

// Import / Export ----------
const importSetting = async text => {
  try {
    const obj = JSON.parse(text);
    Object.assign(PrettyRefresh.ini, obj.ini);
    await saveIni();
    location.reload();
  } catch (e) {
    alert(e.message);
  }
};
const importSettingOnChange = e => {
  try {
    if (!e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => { importSetting(reader.result); };
    reader.readAsText(e.target.files[0]);
  } catch (error) {
    alert(error.message);
  }
};
const exportSetting = async () => {
  const data = {
    ini: PrettyRefresh.ini,
  };
  const href = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(data));
  const link = byId('exportSettingLink');
  link.setAttribute('href', href);
  link.click();
};

// Others ------------------
const setupContents = () => {
  for (const caption of allByClass('i18n')) {
    caption.textContent = getMessage(caption.textContent);
  }
  const ini = PrettyRefresh.ini;
  for (const elm of $bidingForms) {
    if (elm.type === 'checkbox') {
      elm.checked = !!ini[elm.id];
    } else if (elm.type === 'radio') {
      elm.checked = ini[elm.name] === elm.value;
    } else {
      elm.value = ini[elm.id] || INSTEAD_OF_EMPTY[elm.id] || (
        elm.type === 'number' ? 0 : ''
      );
    }
  }
  for (const elm of allByClass('color-text-input')) {
    elm.setAttribute('placeholder', INSTEAD_OF_EMPTY[elm.id]);
    onChangeColorText({ target: elm });
  }
};

const setupEventListeners = () => {
  for (const elm of $bidingForms) {
    elm.addEventListener('change', saveBindingValues);
    elm.addEventListener('input', saveBindingValuesDelay);
  }
  for (const elm of allByClass('color-text-input')) {
    elm.addEventListener('input', onChangeColorText);
    colorPreview(elm).addEventListener('click', e => {
      changeState({dlg: 'colorDlg', targetId: dataTargetId(e)});
    });
  }
  byId('importSetting').addEventListener('change', importSettingOnChange);
  byId('exportSetting').addEventListener('click', exportSetting);

  // common events
  addEventListener('click', e => {
    if (!e?.target.classList) return;
    if (
      e.target.classList.contains('js-history-back') ||
      e.target.classList.contains('dlg')
    ) {
      history.back();
      return;
    }
    if (e.target.classList.contains('js-submit')) {
      const f = dlgs[openedDlg.id].onSubmit;
      f && f();
      history.back();
    }
  });
};

// control Back button
const changeState = state => {
  if (!state.dlg) return;
  history.pushState(state, document.title);
  onPopState({ state: state });
};
let preventPopStateEvent = false;
const onPopState = e => {
  if (preventPopStateEvent) return;
  const state = e.state || history.state || { y: 0 };
  if (openedDlg && !state.dlg) {
    dlgs[openedDlg.id].onHide();
    fadeout(openedDlg);
    openedDlg = null;
    // enable touch scroll.
    document.body.style.overflow = null;
  } else if (state.dlg) {
    const d = dlgs[state.dlg];
    const i = d.init;
    if (i) {
      i();
      d.init = null;
    }
    d.onShow(state.targetId);
    openedDlg = byId(state.dlg);
    fadein(openedDlg);
    // prevent touch scroll.
    if (window.innerWidth === document.body.clientWidth) { // prevent blink scroll bar.
      document.body.style.overflow = 'hidden';
    }
  } else {
    setTimeout(() => { window.scrollTo(0, state.y); });
  }
};
const scrollIntoView = target => {
  onScrollEnd({ force: true }); // Save current position.
  try {
    target.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    target.scrollIntoView(); // For Firefox 54-58
  }
};
const onScrollEnd = e => {
  if (openedDlg) return;
  const hasOldY = history.state && 'y' in history.state;
  const newY = window.scrollY;
  if (newY || e?.force) {
    if (hasOldY) {
      history.replaceState({ y: newY }, document.title);
    } else {
      history.pushState({ y: newY }, document.title);
    }
  } else if (hasOldY) {
    // Prevent to stack histories.
    try {
      preventPopStateEvent = true;
      history.back();
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    } finally {
      preventPopStateEvent = false;
    }
  }
};
window.addEventListener('scroll', () => { resetTimer('onScrollEnd', onScrollEnd, 200); });
window.addEventListener('popstate', onPopState);

// setup options page
const removeCover = () => {
  const cover = byId('cover');
  if (!cover) return;
  setTimeout(() => { fadeout(cover); });
  setTimeout(() => { cover.remove(); }, 500);
  setTimeout(() => {
    document.body.classList.add('initialized');
    initialized = true;
  }, 500);
};

// START HERE ! ------
(async () => {
  PrettyRefresh.ini = (await storageValue('pretty_refresh')) || PrettyRefresh.ini;
  document.documentElement.lang = await browser.i18n.getUILanguage();
  setupContents();
  setupShapes();
  setupEventListeners();
  onPopState(history);
  PrettyRefresh.reload = () => {
    setTimeout(() => { location.reload(); }, 800);
  };
  removeCover();
})();

