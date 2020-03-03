export clamp from 'lodash/clamp';

export function setWidth(el, width) {
  el.style.width = width + 'px';
}

export function setRight(el, width) {
  el.style.width = width + 'px';
}

export function setTop(el, width, height) {
  const d = height - parseFloat(el.style.height);
  el.style.top = parseFloat(el.style.top) - d + 'px';
  el.style.height = height + 'px';
}

export function setTopLeft(el, width, height) {
  setLeft(el, width, height);
  setTop(el, width, height);
}

export function setTopRight(el, width, height) {
  setTop(el, width, height);
  setRight(el, width);
}

export function setLeft(el, width) {
  el.style.left =
    parseFloat(el.style.left) - width + parseFloat(el.style.width) + 'px';
  el.style.width = width + 'px';
}

export function setBottomLeft(el, width, height) {
  setLeft(el, width, height);
  setBottom(el, width, height);
}

export function setBottom(el, width, height) {
  el.style.height = height + 'px';
}

export function setBottomRight(el, width, height) {
  setBottom(el, width, height);
  setRight(el, width, height);
}

export const RESIZE_DIRECTIONS = {
  // top: setTop,
  // top_right: setTopRight,
  // right: setRight,
  bottom_right: setBottomRight
  // bottom: setBottom,
  // bottom_left: setBottomLeft,
  // left: setLeft,
  // top_left: setTopLeft
};
