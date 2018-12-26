const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    rolename: String,
    description: String,
}, {
    versionKey: false
});

const UserInRoleSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'register'
        //default: 0
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
        //default: 0
    }
}, {
    versionKey: false
});

module.exports = {
    Role: mongoose.model('role', RoleSchema, 'role'),
    UserInRole: mongoose.model('userinrole', UserInRoleSchema, 'userinrole')
};