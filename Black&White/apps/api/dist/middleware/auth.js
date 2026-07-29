"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const config_1 = require("../config");
const jsonDb_1 = require("../services/jsonDb");
const verifyJwt = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const customers = (0, jsonDb_1.readCollection)('customers');
        req.user = customers[0] ?? { id: 'guest', email: 'guest@blackwhite.local' };
        return next();
    }
    if (!config_1.supabase) {
        const customers = (0, jsonDb_1.readCollection)('customers');
        const matchedCustomer = customers.find((customer) => customer.id === token || customer.email === token);
        if (!matchedCustomer)
            return res.status(401).json({ error: 'Invalid token' });
        req.user = matchedCustomer;
        return next();
    }
    const { data, error } = await config_1.supabase.auth.getUser(token);
    if (error)
        return res.status(401).json({ error: 'Invalid token' });
    req.user = data.user;
    next();
};
exports.verifyJwt = verifyJwt;
