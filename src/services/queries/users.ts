import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usersKey(id))

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {

    // check if unique username
    const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username)
    if (exists){
        throw new Error('Username is taken')
    }
    // generate unique IDs for each user
    const id = genId()

    // make the key & serialize attrs
    await client.hSet(usersKey(id), serialize(attrs))
    await client.sAdd(usernamesUniqueKey(), attrs.username)
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