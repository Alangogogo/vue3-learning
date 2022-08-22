import { isObject } from "./shared";

const enum ReactiveFlag {
  IS_REACTIVE = '_v_isReactive',
}

const reactiveMap: WeakMap<Record<any, any>, Record<any, any>> = new WeakMap(); 

/** 公共代理拦截 */
const mutabalHandler: ProxyHandler<Record<any, any>> = {
  get(target: Record<any, any>, key, receiver) : any {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return true;
    }
    const res = Reflect.get(target, key, receiver);
    return res;
  },
  set(target: Record<any, any>, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
}

/** 代理对象工厂 */
function createReactiveObject(target: Object): Object {
  if (!isObject(target)) {
    return target;
  }
  // reactive代理过的对象，直接return，避免重复代理
  if ((target as any)[ReactiveFlag.IS_REACTIVE]) {
    return target;
  }
  // 检查代理缓存，已代理过的对象直接返回代理对象，相同的Object共用代理对象节省资源？
  const isExistProxy = reactiveMap.get(target);
  if (isExistProxy) {
    return isExistProxy;
  }
  const proxy = new Proxy(target, mutabalHandler);
  // 对象被代理，放入缓存
  reactiveMap.set(target, proxy);
  return proxy;
}

/** 复杂类型响应式处理函数 */
export function reactive(target: Object) {
  return createReactiveObject(target);
}
