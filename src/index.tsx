import * as React from 'react';
import { getReactFibers, getDisplayName, getDetail } from './utils/react-analysis';
export * from './utils/react-analysis';
export * from './constant';

const { useState, useEffect, useRef } = React;

export const Analysis = () => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

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

  const fibers = getReactFibers(target).filter(f => f._debugSource);
  return target && fibers.length ? (
    <div
      ref={ref}
      onContextMenu={e => (e.stopPropagation(), e.preventDefault())}
      style={{
        bottom: 20,
        right: 20,
        zIndex: 99999,
        border: '1px solid rgba(153, 51, 255)',
        boxShadow: '3px 3px 5px rgba(153, 51, 255, 0.5)',
        position: 'fixed',
        borderRadius: 4,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
      {fibers.map(f => {
        const detail = getDetail(f);
        const name = getDisplayName(f);
        return (
          <div
            style={{
              cursor: 'pointer',
              borderRadius: 4,
              padding: '0 4px',
            }}
            key={f._debugID}
            // eslint-disable-next-line no-console
            onMouseOver={() => console.info(`Component (${name}) pendingProps =>>>> `, f.pendingProps)}
            onClick={e => (e.preventDefault(), window.open(detail.url))}>
            <div style={{color: 'rgba(153, 51, 255)', fontWeight: 500, fontSize: 16}}>{name}: </div>
            <div style={{fontSize: 12, color: '#8f959e'}}>
              {detail.fileName.split('src/')?.[1]}:{detail.lineNumber}
            </div>
          </div>
        );
      })}
    </div>
  ) : null;
};
