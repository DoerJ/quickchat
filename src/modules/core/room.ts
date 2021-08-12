import { APIConnector } from "./api-connector";
import { Session, UserSessionType } from '../utils/session';

export class RoomModel {
  constructor() { }

  public static joinExistingRoom(parameters: any, cb: Function): void {
    RoomModel._call('/room/join', parameters, cb);
  }

  public static createNewRoom(parameters: any, cb: Function): void {
    RoomModel._call('/room/new', parameters, cb);
  }

  public static getRoomMembers(parameters: any, cb: Function): void {
    RoomModel._call('/room/members', parameters, cb);
  }

  private static _call(url: string, parameters: any, cb: Function): void {
    var session: UserSessionType = Session.getUserSession();
    var params = {...session, ...parameters};
    
    APIConnector('POST', url, (response: any) => {
      cb(response);
    }, params);
  }
}