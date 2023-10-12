import { TrainInterface } from 'interfaces/train';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TicketInterface {
  id?: string;
  train_id: string;
  user_id: string;
  booking_date?: any;
  journey_date?: any;
  seat_number?: number;
  status?: string;
  created_at?: any;
  updated_at?: any;

  train?: TrainInterface;
  user?: UserInterface;
  _count?: {};
}

export interface TicketGetQueryInterface extends GetQueryInterface {
  id?: string;
  train_id?: string;
  user_id?: string;
  status?: string;
}
