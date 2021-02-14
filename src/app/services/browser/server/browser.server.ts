import type { Server } from '../../interfaces/server/server.service';

export const ServerURL: string = '//localhost:3001';

export const BrowserServer: Server & { [name: string]: any; } = {
  start() { },
  async delete<T = any>(url: string, body?: any) {
    return fetch(ServerURL + '/' + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: 'delete',
    }).then(resp => resp.json());
  },
  async get<T = any>(url: string) {
    return fetch(ServerURL + '/' + url, {
      method: 'get',
    }).then(resp => resp.json());
  },
  async patch<T = any>(url: string, body?: any) {
    return fetch(ServerURL + '/' + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: 'patch',
    }).then(resp => resp.json());
  },
  async post<T = any>(url: string, body?: any) {
    return fetch(ServerURL + '/' + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: 'post',
    }).then(resp => resp.json());
  },
  async put<T = any>(url: string, body?: any) {
    return fetch(ServerURL + '/' + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: 'put',
    }).then(resp => resp.json());
  },
  async request<T = any>(url: string, options: RequestInit) {
    return fetch(ServerURL + '/' + url, options).then(resp => resp.json());
  }
};