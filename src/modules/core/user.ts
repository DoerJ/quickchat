import { APIConnector } from "./api-connector";
import { Session, UserSessionType } from '../utils/session';

export class UserModel {
  constructor() { }

  public static validateMemberNameForRoom(parameters: any, cb: Function) {
    UserModel._call('/client/addMemberName', cb, parameters);
  }

  public static retrieveMemberNameForRoom(parameters: any, cb: Function) {
    UserModel._call('/client/getMemberName', cb, parameters);
  }

  private static _call(url: string, cb: Function, parameters?: any): void {
    var session: UserSessionType = Session.getUserSession();
    var params = parameters ? {...session, ...parameters} : {...session};
    
    APIConnector('POST', url, (response: any) => {
      cb(response);
    }, params);
  }
}