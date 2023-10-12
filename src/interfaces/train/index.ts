import { RouteInterface } from 'interfaces/route';
import { TicketInterface } from 'interfaces/ticket';
import { GetQueryInterface } from 'interfaces';

export interface TrainInterface {
  id?: string;
  train_number?: string;
  train_name?: string;
  origin?: string;
  destination?: string;
  departure_time?: any;
  arrival_time?: any;
  created_at?: any;
  updated_at?: any;
  route?: RouteInterface[];
  ticket?: TicketInterface[];

  _count?: {
    route?: number;
    ticket?: number;
  };
}

export interface TrainGetQueryInterface extends GetQueryInterface {
  id?: string;
  train_number?: string;
  train_name?: string;
  origin?: string;
  destination?: string;
}
