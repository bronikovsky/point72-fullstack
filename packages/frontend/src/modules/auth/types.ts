export type User = {
  id: string;
  email: string;
  is_admin: boolean;
  age: number;
  country: string;
  last_name: string;
  first_name: string;
}

export type LoginFormValues = {
  email: string;
  password: string;
}

export type RegisterFormValues = {
  email?: string;
  accountType?: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  country?: { label: string, value: string };
  password?: string;
  passwordConfirm?: string;
  [index: string]: any;
}
