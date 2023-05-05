import { Document, PaginateModel, Schema } from "@ioc:Mongoose";
import Mongoose from "@ioc:Mongoose";
import Hash from "@ioc:Adonis/Core/Hash";
import paginate from "mongoose-paginate-v2";

// user interface
export interface User {
  // _id: string
  email: string;
  password?: string;
  avatar: string;
  totalBattle: number;
  totalWon: number;
  niffi: number;
  walletId: string;
  name: string;
  username: string;
  rememberToken: string;
  active: boolean;
  socailId: string;
  accessToken: any;
  totalMedals: number;
  currentMedals: number;
  firebaseToken: string;
  level: number;
  exp: number;
  expRequired: number;
  adallium: number;
  rank: string;
  tutorialStep: string;
  deviceId: string;
  userType: number;
}

// user schema
const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://nft-images-wagmi.s3.amazonaws.com/prcuxuel3l2hpzb3i1651072573422.png",
    },
    totalBattle: {
      type: Number,
      required: true,
      default: 0,
    },
    totalWon: {
      type: Number,
      required: true,
      default: 0,
    },
    tutorialStep: {
      type: String,
      default: "0",
    },
    niffi: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      select: false,
    },
    walletId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
    },
    rememberToken: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    socailId: {
      type: String,
      index: true,
    },
    currentMedals: {
      type: Number,
      default: 0,
    },
    firebaseToken: { type: String, default: null },
    totalMedals: {
      type: Number,
      default: 0,
    },
    adallium: {
      type: Number,
      default: 0,
    },
    exp: {
      type: Number,
      default: 0,
    },
    deviceId: { type: String },
    expRequired: {
      type: Number,
    },
    level: { type: Number, default: 0 },
    rank: Schema.Types.ObjectId,
    userType: {
      type: Number,
      default: 1,
    },
    username: {
      type: String,
      default: null,
      index: {
        unique: true,
        partialFilterExpression: {
          username: { $exists: true, $gt: "" },
        },
      },
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await Hash.make(this.password);
  }

  next();
});

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.plugin(paginate);

// create and export user model
export default Mongoose.model<User & Document, PaginateModel<User & Document>>(
  "User",
  UserSchema
);
