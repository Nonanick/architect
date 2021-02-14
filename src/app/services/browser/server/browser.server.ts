import type { Server } from "../../interfaces/server/server.service";

export const ServerURL: string = "http://localhost:8005";

export const BrowserServer: Server & { [name: string]: any } = {
  start() {},
  async delete<T = any>(url: string, body?: any) {
    return fetch(ServerURL + "/" + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: "DELETE",
    }).then(async (resp) => {
      try {
        return await resp.json();
      } catch (err) {
        return await resp.text();
      }
    });
  },
  async get<T = any>(url: string) {
    return fetch(ServerURL + "/" + url, {
      method: "GET",
    }).then(async (resp) => {
      let response = await resp.text();
      try {
        return JSON.parse(response);
      } catch (err) {
        return response;
      }
    });
  },
  async patch<T = any>(url: string, body?: any) {
    return fetch(ServerURL + "/" + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: "PATCH",
    }).then(async (resp) => {
      let response = await resp.text();
      try {
        return JSON.parse(response);
      } catch (err) {
        return response;
      }
    });
  },
  async post<T = any>(url: string, body?: any) {
    return fetch(ServerURL + "/" + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: "POST",
    }).then(async (resp) => {
      let response = await resp.text();
      try {
        return JSON.parse(response);
      } catch (err) {
        return response;
      }
    });
  },
  async put<T = any>(url: string, body?: any) {
    return fetch(ServerURL + "/" + url, {
      body: body != null ? JSON.stringify(body) : body,
      method: "PUT",
    }).then(async (resp) => {
      let response = await resp.text();
      try {
        return JSON.parse(response);
      } catch (err) {
        return response;
      }
    });
  },
  async request<T = any>(url: string, options: RequestInit) {
    return fetch(ServerURL + "/" + url, options).then(
      async (resp) => {
        let response = await resp.text();
        try {
          return JSON.parse(response);
        } catch (err) {
          return response;
        }
      });
  },
};
