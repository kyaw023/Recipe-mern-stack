const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "chef", "admin"], // Add roles you want to support
      default: "user",
    },
    favoritesRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

UserSchema.statics.register = async function (name, email, password) {
  const isUserExisted = await this.findOne({ email });

  if (isUserExisted) {
    throw new Error("Email already existed");
  }
  const salt = await bcrypt.genSalt();

  const hashCode = await bcrypt.hash(password, salt);

  const user = this.create({
    name,
    email,
    password: hashCode,
  });
  return user;
};

UserSchema.statics.updateProfile = async function (
  id,
  name,
  email,
  bio,
  role,
  password
) {
  const user = await this.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    Object.assign(user, { name, email, bio, role });
    await user.save();
    return user;
  } else {
    throw new Error("password is incorret");
  }
};

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("email does not exist");
  }

  console.log();
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    return user;
  } else {
    throw new Error("password is incorret");
  }
};

module.exports = mongoose.model("User", UserSchema);
