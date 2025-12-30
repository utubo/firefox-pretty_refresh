// constraints -------
// Default settings
var PrettyRefresh = {};
PrettyRefresh.ini = {
  css: `
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle fill="%52525e" cx="12" cy="12" r="12"/><path stroke="%23f9f9fa" fill="none" stroke-linecap="round" d="M15 14.5a4 4 0 1 1 1-2m-1.5-1l1.5 1.5 1.5-1.5"/></svg>');
    filter: drop-shadow(0 0 5px #0003);
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
  `,
  bgshape: 'circle',
  bgcolor: '#52525e',
  fgcolor: '#f9f9fa',
  fgshape: 'default',
  shcolor: '#00000033',
  shsize: 5,
  size: 48,
  delay: 300,
  animation: 'flash',
  distance: '24',
  version: 0,
};
const MARGIN_HIDE = 16;
const VV = window.visualViewport;

// fields ------------
let icon = null;
let isActive = false;
let isReady = false;
let touchStartTime = 0;
let sx = 0; // start X
let sy = 0; // start Y
let ly = 0; // last Y
let strokeSize = 0;
let distance = 24;

// utilities ---------
const getXY = e => {
  const t = e.touches[0];
  return [t.pageX, t.pageY];
};

const isElementScrolled = e => {
  return e?.scrollTop || e && isElementScrolled(e.parentNode);
}


// icon --------------
const createIcon = () => {
  if (icon) return;
  icon = document.createElement('DIV');
  applyCss();
  hide();
  document.body.appendChild(icon);
};

const applyCss = () => {
  icon.style.cssText = PrettyRefresh.ini.css;
  hide();
};

const setTranslate = (top, deg, scale = 1, opacity = 1) => {
  if (!icon) return;
  icon.style.transform = `
    translate(
      ${VV.width / 2 + VV.offsetLeft - PrettyRefresh.ini.size / 2}px,
      ${top}px
    )
    rotateZ(${deg}deg)
    scale(${scale / VV.scale})
  `;
  if (opacity !== 1) {
    icon.style.opacity = opacity;
  }
};

const show = () => {
  createIcon();
  // icon.offsetHeight; // reflow for transition.
  setTranslate(distance / VV.scale, 0);
};

const hide = () => {
  setTranslate(- PrettyRefresh.ini.size - MARGIN_HIDE / VV.scale, -360);
};

const flash = () => {
  switch (PrettyRefresh.ini.animation) {
    case 'rotate':
      icon.animate(
        { transform: [
          icon.style.transform + ' rotateZ(0deg)',
          icon.style.transform + ' rotateZ(360deg)'
        ] },
        { iterations: Infinity, duration: 2000 }
      );
      break;
    case 'coin':
      icon.animate(
        { transform: [
          icon.style.transform + ' rotateY(0deg)',
          icon.style.transform + ' rotateY(360deg)'
        ] },
        { iterations: Infinity, duration: 1000 }
      );
      break;
    default:
      setTranslate(distance / VV.scale, 0, 1.5, 0);
  }
}

// touch-events ------
const onPointerDown = e => {
  isReady = false;
  isActive = isValid(e);
  if (!isActive) {
    cancel();
    return;
  }
  touchStartTime = Date.now();
  [sx, sy] = getXY(e);
  ly = sy;
  strokeSize = (distance + PrettyRefresh.ini.size) / VV.scale;
};

const onTouchStart = e => {
  if (e.touches.length === 1) {
    onPointerDown(e);
  } else {
    cancel();
  }
};

const onPointerMove = e => {
  if (!isActive) return;
  const [x, y] = getXY(e);
  if (y < ly) {
    cancel();
    return;
  }
  ly = y
  const dx = x - sx;
  if (dx < - strokeSize || strokeSize < dx) {
    cancel();
    return;
  }
  if (strokeSize < y - sy) {
    show();
    isReady = true;
  }
};

const onPointerUp = () => {
  if (!isReady) return;
  if (PrettyRefresh.ini.delay < Date.now() - touchStartTime) {
    flash();
    location.reload();
  } else {
    cancel();
  }
};

const onScroll = () => {
  cancel();
}

// control -----------
const isValid = e => {
  return !VV.offsetTop &&
    !document.documentElement.scrollTop &&
    !document.body.scrollTop &&
    !isElementScrolled(e.target)
};

const cancel = () => {
  isActive = false;
  isReady = false;
  hide();
};

PrettyRefresh.loadIni = async () => {
  const res = await browser.storage.local.get('pretty_refresh');
  if (res?.pretty_refresh) {
    Object.assign(PrettyRefresh.ini, res.pretty_refresh);
    distance = PrettyRefresh.ini.distance|0;
  }
  if (icon) {
    applyCss();
  }
};

// START HERE ! ------
// NOTE: pointermove does not work the scale is not 1.0.
addEventListener('touchstart', onTouchStart);
addEventListener('touchmove', onPointerMove);
addEventListener('touchend', onPointerUp);
addEventListener('scroll', onScroll);
VV.addEventListener('scroll', onScroll);
PrettyRefresh.loadIni();

