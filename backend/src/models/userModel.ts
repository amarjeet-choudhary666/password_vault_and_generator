import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Model } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    encryptionSalt: string; // ✅ for client-side encryption
    createdAt?: Date;
    updatedAt?: Date;
    refreshToken?: string

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            default: null
        },
        encryptionSalt: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)


userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next()
    } catch (error: any) {
        next(error)
    }
})


userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
}

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);