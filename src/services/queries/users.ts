import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usersKey(id))

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    // generate unique IDs for each user
    const id = genId()

    // make the key & serialize attrs
    await client.hSet(usersKey(id), serialize(attrs))

    return id

};

// format object before redis storage
const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    }
}

const deserialize = (id: string, user: { [key: string]: string }) => {
    return {
        id: id,
        username: user.username,
        password: user.password
    }
}