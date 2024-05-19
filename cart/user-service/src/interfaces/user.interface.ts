import { Document } from 'mongoose';
export interface User extends Document {
    readonly email: string;
    password: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly role: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    resetCode?: string;
    refreshToken?: string;
    verificationCode?: string;
    verified: boolean;
}

/*
The interface and schema serve different purposes, but they are related and complement each other in a Mongoose-based application.
The schema (UserSchema) defines the structure of the MongoDB collection and includes validation rules, indexes, and other configuration options.
The interface (User) defines the structure of individual documents retrieved from the database and provides type information for TypeScript.
While the schema focuses on database-level concerns such as validation and indexing, the interface focuses on application-level concerns such as type safety and consistency.
In summary, the User interface ensures type safety and consistency when working with user data in a Nest.js application, complementing the schema definition provided by Mongoose. It helps catch errors at compile-time and serves as documentation for the expected structure of user documents.
*/