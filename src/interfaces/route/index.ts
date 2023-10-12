import { TrainInterface } from 'interfaces/train';
import { StationInterface } from 'interfaces/station';
import { GetQueryInterface } from 'interfaces';

export interface RouteInterface {
  id?: string;
  train_id: string;
  station_id: string;
  arrival_time?: any;
  departure_time?: any;
  stop_number?: number;
  created_at?: any;
  updated_at?: any;

  train?: TrainInterface;
  station?: StationInterface;
  _count?: {};
}

export interface RouteGetQueryInterface extends GetQueryInterface {
  id?: string;
  train_id?: string;
  station_id?: string;
}
