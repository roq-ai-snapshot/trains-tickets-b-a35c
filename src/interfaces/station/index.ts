import { RouteInterface } from 'interfaces/route';
import { GetQueryInterface } from 'interfaces';

export interface StationInterface {
  id?: string;
  station_name?: string;
  station_code?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at?: any;
  updated_at?: any;
  route?: RouteInterface[];

  _count?: {
    route?: number;
  };
}

export interface StationGetQueryInterface extends GetQueryInterface {
  id?: string;
  station_name?: string;
  station_code?: string;
  city?: string;
  state?: string;
  country?: string;
}
