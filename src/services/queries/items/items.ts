import { itemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { deserialize } from './deserialize';
import { serialize } from './serialize';


export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemsKey(id))

    if (Object.keys(item).length == 0){
        return null
    }

    return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {
    // batch the fetching of all items
    const commands = ids.map((id) => {
        return client.hGetAll(itemsKey(id))
    })

    const items = await Promise.all(commands)

    return items.map((item, idx)=> {
        if(Object.keys(item).length == 0) {
            return null
        }
        return deserialize(ids[idx], item)
    })
    
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId()

    await client.hSet(
        itemsKey(id),
        serialize(attrs)
    )

    return id
};
