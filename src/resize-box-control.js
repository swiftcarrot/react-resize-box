/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useEffect, useRef } from 'react';
import { clamp, RESIZE_DIRECTIONS } from './utils';

export const MIN_SIZE = 20;
export const MAX_SIZE = 10000;

const ResizeBoxControl = ({
  direction,
  onResizeEnd,
  boxId,
  top,
  left,
  width,
  height
}) => {
  const resize = useRef({
    active: false,
    el: null,
    w: '',
    h: '',
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    ww: 0,
    hh: 0,
    raf: null
  }).current;

  useEffect(() => {
    return () => end();
  }, [direction]);

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    end();
    start(e);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    resize.x2 = e.clientX;
    resize.y2 = e.clientY;
    resize.raf = requestAnimationFrame(sync);
  }

  function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    resize.x2 = e.clientX;
    resize.y2 = e.clientY;

    end();
    if (onResizeEnd) {
      onResizeEnd(top, left, resize.ww, resize.hh);
    }
  }

  function start(e) {
    if (resize.active) end();

    const el = document.getElementById(boxId);

    resize.active = true;
    resize.el = el;
    resize.x1 = e.clientX;
    resize.y1 = e.clientY;
    resize.x2 = resize.x1;
    resize.y2 = resize.y1;
    resize.w = resize.el.style.width;
    resize.h = resize.el.style.height;
    resize.ww = width;
    resize.hh = height;

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseup', handleMouseUp, true);
  }

  function end() {
    if (!resize.active) return;

    resize.active = false;
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseup', handleMouseUp, true);

    const el = resize.el;
    el.style.width = resize.w;
    el.style.height = resize.h;
    resize.el = null;

    resize.raf && cancelAnimationFrame(resize.raf);
    resize.raf = null;
  }

  function sync() {
    if (!resize.active) return;

    const dx = (resize.x2 - resize.x1) * (/left/.test(direction) ? -1 : 1);
    const dy = (resize.y2 - resize.y1) * (/top/.test(direction) ? -1 : 1);

    const el = resize.el;
    const fn = RESIZE_DIRECTIONS[direction];
    let ww = clamp(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
    let hh = clamp(MIN_SIZE, height + Math.round(dy), MAX_SIZE);

    const aspect = width / height;
    hh = Math.max(ww / aspect, MIN_SIZE);
    ww = hh * aspect;

    // todo: fix size round
    // if (fn === setSize) {
    //   hh = Math.max(ww / aspect, MIN_SIZE);
    //   ww = hh * aspect;
    // }

    fn(el, Math.round(ww), Math.round(hh));

    resize.ww = ww;
    resize.hh = hh;
  }

  return (
    <span
      onMouseDown={handleMouseDown}
      css={[styles.control, styles[direction]]}
    />
  );
};

const styles = {
  control: css`
    height: 20px;
    position: absolute;
    width: 20px;
    z-index: 2;

    &:after {
      background-color: rgba(152, 204, 253, 0.8);
      border: solid 1px #fff;
      box-sizing: border-box;
      content: '';
      height: 10px;
      left: 5px;
      position: absolute;
      top: 5px;
      width: 10px;
    }

    &:before {
      bottom: -10px;
      content: '';
      left: -10px;
      position: absolute;
      right: -10px;
      top: -10px;
    }
  `,

  top: css`
    cursor: n-resize;
    left: 50%;
    margin-left: -10px;
    top: -10px;
  `,

  top_right: css`
    cursor: ne-resize;
    right: -10px;
    top: -10px;
  `,

  right: css`
    cursor: e-resize;
    margin-top: -10px;
    right: -10px;
    top: 50%;
  `,

  bottom_right: css`
    cursor: se-resize;
    bottom: -10px;
    right: -10px;
  `,

  bottom: css`
    cursor: s-resize;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
  `,

  bottom_left: css`
    cursor: sw-resize;
    bottom: -10px;
    left: -10px;
  `,

  left: css`
    cursor: w-resize;
    left: -10px;
    margin-top: -10px;
    top: 50%;
  `,

  top_left: css`
    cursor: nw-resize;
    left: -10px;
    top: -10px;
  `
};

export default ResizeBoxControl;
