export interface Route {
  title?: string;
  pattern: string;
  guard?: GuardRoute | GuardRoute[];
  onActivation: RouteActivation | RouteActivation[];
  onDeactivation?: RouteDeactivation;
}

export type GuardRoute = (
  url: string,
  urlParams: any,
  queryParams: any,
) => Promise<boolean>;

export type RouteActivation = (
  url: string,
  urlParams: any,
  queryParams: any,
) => Promise<void>;

export type RouteDeactivation = () => Promise<true | string>;
