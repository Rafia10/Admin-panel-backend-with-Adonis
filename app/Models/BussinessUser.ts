import { Document, PaginateModel, Schema } from "mongoose";
import Mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import Hash from "@ioc:Adonis/Core/Hash";

// Card interface
export interface BusinessUser extends Document {
  email: string;
  password: string;
  avatar?: string;
  name: string;
  status: string;
  accessToken: object;
  rememberMeToken?: string;
  otp: number;
}

// Card schema
const BusinessUserSchema = new Schema<BusinessUser>(
  {
    email: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
    },

    status: {
      type: String,
    },

    avatar: {
      type: String,
      default:
        "https://nft-images-wagmi.s3.amazonaws.com/prcuxuel3l2hpzb3i1651072573422.png",
    },
    password: {
      type: String,
      select: false,
    },
    accessToken: {
      type: Object,
    },
    otp: {
      type: Number,
    },
  },

  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

BusinessUserSchema.plugin(paginate);

BusinessUserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BusinessUserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await Hash.make(this.password);
  }

  next();
});

BusinessUserSchema.set("toJSON", {
  virtuals: true,
});

// create and export Card model
export default Mongoose.model<BusinessUser, PaginateModel<BusinessUser>>(
  "BusinessUser",
  BusinessUserSchema
);
