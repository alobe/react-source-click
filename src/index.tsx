/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import * as React from 'react';
import { getReactFibers, getDisplayName, getDetail } from './utils/react-analysis';
export * from './utils/react-analysis';
export * from './constant';

const { useState, useEffect, useRef } = React;

export const Analysis = () => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [enable, setEnable] = useState(true)

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      e.preventDefault();
      if (!(e.target instanceof HTMLElement)) return;
      if (ref.current?.contains(e.target as HTMLElement)) return;
      setTarget(e.target);
    };
    document.addEventListener('contextmenu', cb);
    return () => document.removeEventListener('contextmenu', cb);
  }, []);

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) setTarget(null);
    };
    document.addEventListener('click', cb);
    return () => document.removeEventListener('click', cb);
  }, []);

  const fibers = getReactFibers(target).filter(f => typeof f.type === 'function')
  return (
    <div>
      {
        enable && target && fibers.length ? (
          <div
            ref={ref}
            onContextMenu={e => (e.stopPropagation(), e.preventDefault())}
            css={css`
              display: flex;
              position: fixed;
              padding: 10px;
              flex-direction: column;
              border-radius: 4px;
              background-color: white;
              max-height: 500px;
              overflow-y: auto;
              right: 20px;
              bottom: 20px;
              z-index: 99999;
              border: 1px solid rgba(153, 51, 255);
              box-shadow: 3px 3px 5px rgba(153, 51, 255, 0.5);
            `}>
            {fibers.map(f => {
              const detail = getDetail(f);
              const name = getDisplayName(f);
              const logProps = (logType = false) => {
                // eslint-disable-next-line no-console
                console.info(`%c[${name}] Component pendingProps =>>>> `, 'color: yellow', f.pendingProps)
                // eslint-disable-next-line no-console
                logType && console.info(`%cClick detail to [${name}] Component Source =>>>> `, 'color: rgba(153, 51, 255)', f.type)
              }
              return (
                <div
                  css={css`
                    cursor: pointer;
                    border-radius: 4px;
                    padding: 0 2px;
                    &:hover {
                      background-color: rgba(153, 51, 255, 0.1);
                    }
                  `}
                  key={f._debugID}
                  onClick={e => (e.preventDefault(), !!detail && window.open(detail.url), logProps(!detail))}>
                  <div css={css`
                    color: rgba(153, 51, 255);
                    font-weight: 500;
                    font-size: 16px;
                  `}>{name}: {!detail && (
                    <span css={css`
                      font-size: 14px;
                      font-weight: normal;
                    `}>No source address!</span>
                  )}</div>
                  {!!detail && (
                    <div css={css`
                      color: #646a73;
                      font-size: 12px;
                    `}>
                      {detail.fileName.split('src/')?.[1] + ':' + detail.lineNumber}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null
      }
      <div css={css`display: none;`} id="react_source_click" onClick={() => setEnable(v => !v)} />
    </div>
  )
};

module.exports = Analysis
