import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVaultItem extends Document {
    userId: mongoose.Types.ObjectId;
    title: string,
    username: string,
    password: string,
    url?: string;
    notes?: string;
}

const vaultItemSchema: Schema<IVaultItem> = new Schema<IVaultItem>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    notes: {
        type: String
    }
})


export const VaultItem: Model<IVaultItem> = mongoose.model<IVaultItem>("VaultItem", vaultItemSchema);
