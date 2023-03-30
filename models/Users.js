import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  profileImg: {
    type: String,
    default: function () {
      return `https://robohash.org/${this.firstName}`;
    },
  },
  role: {
    type: String,
    default: "user", 
    enum: ["user", "admin"],
  }
}, {
    timestamps: true,
    versionKey: false,
});

//set email as index
UserSchema.indexes({ email: 1 });
const User = mongoose.model("users", UserSchema);

export default User;
