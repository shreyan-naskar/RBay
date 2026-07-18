import { itemsByViewsKey, itemsKey, itemsViewsKey } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {
    // use the hyperloglog structure to insert
    const inserted = await client.pfAdd(itemsViewsKey(itemId), userId)
    // if new insert
    if(inserted){
        return Promise.all([
            client.hIncrBy(itemsKey(itemId), 'views', 1),
            client.zIncrBy(itemsByViewsKey(), 1, itemId)
        ])
    }
};
