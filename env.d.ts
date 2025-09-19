declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPWRITE_DB: string;
      APPWRITE_USER_COLLECTION: string
      APPWRITE_BANK_ACCOUNT_COLLECTION: string;
      APPWRITE_BANK_CONNECTION_COLLECTION: string;
      APPWRITE_TRANSACTION_COLLECTION: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {}