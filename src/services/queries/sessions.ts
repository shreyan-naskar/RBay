import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';


export const getSession = async (id: string) => {
    const session = await client.hGetAll(sessionsKey(id))

    // redis returns {} for no existent keys, hence this check
    if (Object.keys(session).length == 0){
        return null
    }

    return desealize(id, session)
};

export const saveSession = async (session: Session) => {
    return client.hSet(
        sessionsKey(session.id),
        serialize(session)
    )
};


const desealize = (id: string, session: { [key: string]:string }) => {
    return {
        id, userId: session.userId,
        username: session.username
    }
}

const serialize = (session: Session) => {
    return {
        userId: session.userId ?? '',
        username: session.username
    }
}
