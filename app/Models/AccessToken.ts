import { Document, Schema } from "@ioc:Mongoose";
import Mongoose from "@ioc:Mongoose";

// user interface
export interface AccessToken extends Document {
  token: string;
  user_id: string;
  expiration: number;
}

// user schema
const AccessTokenSchema = new Schema<AccessToken>(
  {
    token: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    expiration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// create and export access_tokens model
export default Mongoose.model<AccessToken>("AccessToken", AccessTokenSchema);
