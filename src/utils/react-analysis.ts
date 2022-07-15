import { Fiber } from 'react-reconciler'
import { Platform } from '../constant'

const get = (source: any, path: string, defaultValue = undefined) => {
  // translate array case to dot case, then split witth .
  // a[0].b -> a.0.b -> ['a', '0', 'b']
  const keyList = path.replace(/\[(\d+)\]/g, '.$1').split('.')

  const result = keyList.reduce((obj, key) => {
      return Object(obj)[key]; // null undefined get attribute will throwError, Object() can return a object
  }, source)
  return result === undefined ? defaultValue : result;
}

export const getReactFiber = (e: HTMLElement): Fiber | null => {
  const reactRenders = get(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers') as Map<string, any>
  if (reactRenders) {
    for (const r of reactRenders.values()) {
      try {
        const fiber = r.findFiberByHostInstance(e)
        if (fiber) return fiber
      } catch (e) {
        console.error('find fiber element error')
      }
    }
  }

  if ('_reactRootContainer' in e) return get(e, '_reactRootContainer._internalRoot.current.child')

  for (const key in e) {
    if (['__reactInternalInstance$', '__reactFiber'].some(k => key.startsWith(k))) return (e as any)[key]
  }
  return null
}

export const getReactFibers = (e?: HTMLElement | null): Fiber[] => {
  if (!e) return []
  let instance = getReactFiber(e);
  const instances: Fiber[] = []
  while (instance) {
    instances.push(instance)
    instance = instance._debugOwner!
  }
  return instances;
}


export const getDetail = (fiber: Fiber, platform = 'vscode') => {
  if (!fiber._debugSource) return null
  const { fileName, lineNumber = 1 } = fiber._debugSource
  let url = `vscode://file/${fileName}:${lineNumber}`
  if (platform === Platform.sublime) url = `subl://open?url=file://${fileName}&line=${lineNumber}`
  else if (platform === Platform.phpstorm) url = `phpstorm://open?file=${fileName}&line=${lineNumber}`
  else if (platform === Platform.atom) url = `atom://core/open/file?filename=${fileName}&line=${lineNumber}`
  else if (platform === Platform.vscodeInsiders) url = `vscode-insiders://file/${fileName}:${lineNumber}`
  return {url, fileName, lineNumber}
}

export const getDisplayName = (f: Fiber) => {
  const { elementType, tag, type } = f;
  switch (tag) {
    case 0: // FunctionComponent
    case 1: // ClassComponent
      return (
        elementType.displayName || elementType.name || type.name || 'Anonymous Component'
      )

    case 5: // HostComponent:
      return elementType

    case 6: // HostText:
      return 'String'

    case 7: // Fragment
      return 'React.Fragment'

    case 9: // ContextConsumer
      return 'Context.Consumer'

    case 10: // ContextProvider
      return 'Context.Provider'

    case 11: // ForwardRef
      return 'React.forwardRef'

    case 15: // MemoComponent
      // Attempt to get name from wrapped component
      return elementType.type?.name || 'React.memo'

    case 16: // LazyComponent
      return 'React.lazy'

    default:
      // eslint-disable-next-line no-console
      console.warn(`Unrecognized React Fiber tag: ${tag}`)
      return 'Unknown Component'
  }
}
