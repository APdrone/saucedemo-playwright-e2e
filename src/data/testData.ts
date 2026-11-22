export interface UserCredentials {
  username: string;
  password?: string;
}

export interface CheckoutCustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const USERS = {
  STANDARD: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  LOCKED_OUT: {
    username: process.env.LOCKED_OUT_USER || 'locked_out_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  PROBLEM: {
    username: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  PERFORMANCE_GLITCH: {
    username: process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  ERROR_USER: {
    username: process.env.ERROR_USER || 'error_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  VISUAL_USER: {
    username: process.env.VISUAL_USER || 'visual_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  INVALID_USER: {
    username: 'invalid_qa_user',
    password: 'wrong_password',
  },
};

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  CHECKOUT_FIRST_NAME_REQUIRED: 'Error: First Name is required',
  CHECKOUT_LAST_NAME_REQUIRED: 'Error: Last Name is required',
  CHECKOUT_POSTAL_CODE_REQUIRED: 'Error: Postal Code is required',
};

export const CHECKOUT_DATA: Record<string, CheckoutCustomerInfo> = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  MISSING_FIRST_NAME: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  },
  MISSING_LAST_NAME: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
  },
  MISSING_POSTAL_CODE: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
};

export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_T_SHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  RED_T_SHIRT: 'Test.allTheThings() T-Shirt (Red)',
};
