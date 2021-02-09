import type { Server } from '../../interfaces/server/server.service';

export const BrowserServer : Server & {[name : string] : any} = {
  start() {},
  async delete<T=any>(url : string) {
    return {} as T;
  },
  async get<T= any>(url : string) {
    return {} as T;
  },
  async patch<T = any>() {
    return {} as T;
  },
  async post<T = any>() {
    return {} as T;
  },
  async put<T = any>() {
    return {} as T;
  },
  async request<T = any>(url : string, options : {}) {
    return {} as T;
  }
}