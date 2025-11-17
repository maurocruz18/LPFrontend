const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    telefone: { type: Number, required: true },
    age: { type: Number },
    dateOfBirth: { type: Date },
    role: { type: String, enum: ['admin', 'client', 'owner'], required: true },
    isActive: { type: Boolean, default: true },
    settings: {
        showExplicitContent: { type: Boolean, default: false },
        newsletter: { type: Boolean, default: false }
    },
    library: [{
        gameId: { type: Number, required: true },
        gameName: String,
        purchaseDate: { type: Date, default: Date.now },
        purchasePrice: Number,
        hoursPlayed: { type: Number, default: 0 }
    }],
    wishlist: [{
        gameId: { type: Number, required: true },
        gameName: String,
        addedDate: { type: Date, default: Date.now }
    }],
    cart: [{
        gameId: { type: Number, required: true },
        gameName: String,
        price: Number,
        addedDate: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    timestamps: true 
}); 

module.exports = mongoose.models.User || mongoose.model('User', userSchema);