import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  url?: string;
}

export type Response<T = unknown> = AxiosResponse<T>;

export type RequestError<T = unknown> = AxiosError<T>;

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: RequestError): boolean {
    return !!(error.response && error.response.status);
  }
}
