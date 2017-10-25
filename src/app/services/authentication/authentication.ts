export type userType = 'curri-CUSTOMER' | 'ADMIN';

export interface AuthenticationPayload {
  username: string;
  password: string;
}

interface ICompany {
  fedexAccountNumber: string;
  id: string;
  isOwnedByCurrentUser: boolean;
  name: string;
}

export interface AuthenticationResponse {
  defaultCompany: ICompany;
  id: string;
  permissions: string[];
  username: string;
  userType: userType;
}

export class InvalidUserTypeError implements Error {
  name: string;
  message: string;

  constructor(expectedUserType: userType, actualUserType: userType) {
    this.name = 'InvalidUserTypeError';
    this.message = `This application requires the ${expectedUserType} role. You have the ${actualUserType} role.`;
  }
}
