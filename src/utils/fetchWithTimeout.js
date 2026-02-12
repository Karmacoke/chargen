/**
 * fetchWithTimeout - 带超时控制的 fetch 封装
 * 解决原生 fetch 无超时机制的问题
 */

export const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};
