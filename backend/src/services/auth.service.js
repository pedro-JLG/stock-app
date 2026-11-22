import { User } from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';
import { generateToken } from '../utils/generateToken.js';

export function toPublicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export async function registerUser({ name, email, password }) {
    const exists = await User.exists({ email: email.toLowerCase() });
    if (exists) {
        throw new HttpError(409, 'Correo ya registrado');
    }

    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    return { user: toPublicUser(user), token: generateToken(user) };
}

export async function loginUser({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user || !(await user.comparePassword(password))) {
        throw new HttpError(401, 'Datos de acceso inválidos');
    }

    return { user: toPublicUser(user), token: generateToken(user) };
}

export async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        throw new HttpError(404, 'Usuario no encontrado');
    }
    return toPublicUser(user);
}