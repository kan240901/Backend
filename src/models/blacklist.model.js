const mongose = require('mongoose');

const blacklistTokenSchema = new mongose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
    },
    },{
        timestamps: true
    }
);

const tokenBlacklistModel = mongose.model('blacklistTokens', blacklistTokenSchema);

module.exports = tokenBlacklistModel;