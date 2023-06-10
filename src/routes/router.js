import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.PRIVATE_KEY;

export default class MyRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    init() { }

    getRouter() {
        return this.router;
    }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.generateCustomResponses,
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    }
    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.generateCustomResponses,
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    }
    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.generateCustomResponses,
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.generateCustomResponses,
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).send(error);
            }
        });
    }

    generateCustomResponses(req, res, next) {
        res.sendSuccess = (payload) => res.send({ status: 'success', payload });
        res.sendServerError = (error) => res.status(500).send({ status: 'error', error });
        res.sendUserError = (error) => res.status(400).send({ status: 'error', error });
        res.sendNoAuthenticatedError = (error) => res.status(401).send({ status: 'error', error });
        res.sendNoAuthorizatedError = (error) => res.status(403).send({ status: 'error', error });
        next();
    }

    handlePolicies = (policies) => (req, res, next) => {
        if (policies.includes('public')) return next();
        if (policies.length > 0) {
            // Configuracion de headers
            const authHeaders = req.headers.authorization;

            if (!authHeaders) return res.sendNoAuthenticatedError('Unauthenticated');

            const tokenArray = authHeaders.split(' ');

            const token = req.cookies.token || tokenArray.length > 1 ? tokenArray[1] : tokenArray[0];;

            try {
                const user = jwt.verify(token, secret);

                if (!policies.includes(user.role.toLowerCase())) {
                    return res.sendNoAuthorizatedError('Unauthorized');
                }
            } catch (error) {
                return res.sendNoAuthenticatedError('Unauthenticated');
            }
        }
        next();
    };
}
