/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useRef } from 'react';
import { uid } from '@swiftcarrot/utils';
import ResizeBoxControl from './resize-box-control';
import { RESIZE_DIRECTIONS } from './utils';

const ResizeBox = ({
  box,
  children,
  onResizeEnd,
  onDragEnd,
  onBoxChange,
  ...props
}) => {
  const { top, left, width, height } = box;
  const boxId = useRef(uid('ResizeBox')).current;
  const active = useRef(false);
  const raf = useRef(null);
  const pos1 = useRef({ x: 0, y: 0 });
  const pos2 = useRef({ x: 0, y: 0 });

  function _onDragEnd(top, left) {
    if (onDragEnd) {
      onDragEnd(top, left);
    }
    if (onBoxChange) {
      onBoxChange({ top, left, width, height });
    }
  }

  function _onResizeEnd(top, left, width, height) {
    if (onResizeEnd) {
      onResizeEnd(top, left, width, height);
    }
    if (onBoxChange) {
      onBoxChange({ top, left, width, height });
    }
  }

  function start(e) {
    if (active.current) {
      end();
    }

    active.current = true;
    pos1.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseup', handleMouseUp, true);
  }

  function end() {
    if (!active.current) return;

    active.current = false;
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseup', handleMouseUp, true);

    raf.current && cancelAnimationFrame(raf.current);
    raf.current = null;
  }

  function sync() {
    const dx = pos2.current.x - pos1.current.x;
    const dy = pos2.current.y - pos1.current.y;

    _onDragEnd(top + dy, left + dx);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    end();
    start(e);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    pos2.current = { x: e.clientX, y: e.clientY };
    raf.current = requestAnimationFrame(sync);
  }

  function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    end();

    const dx = pos2.current.x - pos1.current.x;
    const dy = pos2.current.y - pos1.current.y;
    _onDragEnd(top + dy, left + dx);
  }

  return (
    <div
      css={css`
        position: relative;
        // overflow: hidden;
      `}
      {...props}
    >
      {children}
      <div
        id={boxId}
        css={css`
          position: absolute;
          box-sizing: border-box;
          box-shadow: 0 0 1px 1px rgba(152, 204, 253, 0.8);
        `}
        style={{
          top,
          left,
          width,
          height
        }}
      >
        {Object.keys(RESIZE_DIRECTIONS).map(key => (
          <ResizeBoxControl
            key={key}
            boxId={boxId}
            direction={key}
            top={top}
            left={left}
            width={width}
            height={height}
            onResizeEnd={_onResizeEnd}
          />
        ))}
        {/*<div
          onMouseDown={handleMouseDown}
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            outline: 600px solid rgba(0, 0, 0, 0.7);
            cursor: move;
          `}
        />*/}
      </div>
    </div>
  );
};

ResizeBox.defaultProps = {
  box: {}
};

export default ResizeBox;
