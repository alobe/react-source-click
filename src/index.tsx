import * as React from 'react'
import { getReactFibers, getDisplayName, getDetail } from './utils/react-analysis'
export * from './utils/react-analysis'
export * from './constant'

export const Analysis = () => {
  const [target, setTarget] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const cb = (e: MouseEvent) => {
      e.preventDefault();
      if (e.target instanceof HTMLElement) setTarget(e.target)
    }
    document.addEventListener('contextmenu', cb)
    return () => document.removeEventListener('contextmenu', cb)
  }, [])

  const fibers = getReactFibers(target).filter(f => f._debugSource)
  const position = target?.getBoundingClientRect()
  return target && fibers.length ? (
    <div onContextMenu={e => (e.stopPropagation(), e.preventDefault())} style={{top: position!.top, left: position!.left, zIndex: 99999, border: '1px solid gray', position: 'fixed', borderRadius: 4, padding: 10, display: 'flex', backgroundColor: 'white', flexDirection: 'column'}}>
      <div className=""><span style={{cursor: 'default'}} onClick={() => setTarget(null)}>Close</span></div>
      {fibers.map(f => {
        const detail = getDetail(f)
        return (
          <div style={{cursor: 'pointer', marginBottom: 4}} key={f._debugID} onClick={(e) => (e.preventDefault(), window.open(detail.url))}>
            <div style={{marginRight: 6, color: 'rgba(51, 112, 255, 1)', fontSize: 16, fontWeight: 500}}>{getDisplayName(f)}: </div>
            <div className="">{detail.fileName.split('src/')?.[1]}:{detail.lineNumber}</div>
          </div>
        )
      })}
    </div>
  ) : null
}
