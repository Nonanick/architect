export interface Server {
  get<T = any>(url: string): Promise<T>;
  post<T = any>(url: string, body? : any): Promise<T>;
  put<T = any>(url: string,  body? : any): Promise<T>;
  patch<T = any>(url: string, body? : any): Promise<T>;
  delete<T = any>(url: string, body? : any): Promise<T>;
  start(): void;
}