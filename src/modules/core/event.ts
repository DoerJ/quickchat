import { Subject } from 'rxjs';
import { MenuItem } from '../core/menu';

export class EventService {
  constructor() { }

  static newRoomAddedToList: Subject<MenuItem> = new Subject<MenuItem>();
}