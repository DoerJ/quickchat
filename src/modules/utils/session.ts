function convertToString(value: any): string {
  let val: string;
  if (typeof value === 'number' || typeof value === 'boolean') {
    val = value.toString();
  }
  else if (value && typeof value === 'object') {
    val = JSON.stringify(value);
  }
  else {
    val = value;
  }
  return val;
}

export interface UserSessionType {
  userid: string | null,
  usertype: string | null
}

export class Session {
  constructor() { }

  static _sessionStorage = window.sessionStorage;

  static setSessionItem = (key: string, value: any): void => {
    Session._sessionStorage.setItem(key, convertToString(value));
  }

  static setMultipleSessionItems = (items: any): void => {
    Object.keys(items).forEach((key: string) => {
      Session._sessionStorage.setItem(key, convertToString(items[key]));
    });
  }

  static getUserSession = (): UserSessionType => {
    let id = Session.getSessionItem('auth_token');
    console.log('get id: ', id)
    let type = Session.getSessionItem('user_type');
    return {
      usertype: type,
      userid: id
    }
  }

  static getSessionItem = (key: string): string | null => {
    return Session._sessionStorage.getItem(key);
  }

  static removeSessionItem = (key: string): void => {
    Session._sessionStorage.removeItem(key);
  }

  static clearAllSessionItems = (): void => {
    Session._sessionStorage.clear();
  }

}
