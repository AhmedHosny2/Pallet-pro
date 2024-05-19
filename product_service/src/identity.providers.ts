import { Connection } from "mongoose";
import { ProductSchema } from "./schemas/product.schema/product.schema";

export const identityProviders = [
  {
    provide: '  PRODUCT_MODEL',
    useFactory: (connection: Connection) => connection.model('Product', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
