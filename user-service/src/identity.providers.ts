import { Connection } from "mongoose";
import { UserSchema } from "./schemas/user.schema";
import { AddressSchema } from "./schemas/address.schema";

export const identityProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ADDRESS_MODEL',
    useFactory: (connection: Connection) => connection.model('Address', AddressSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
