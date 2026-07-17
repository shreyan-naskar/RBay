import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => {
    return {
        id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        highestBidUserId: item.highestBidUserId,
        ownerId: item.ownerId,
        // change millisecond to date time
        createdAt: DateTime.fromMillis(parseInt(item.createdAt)),
        endingAt: DateTime.fromMillis(parseInt(item.endingAt)),
        // string -> int
        views: parseInt(item.views),
        likes: parseInt(item.likes),
        bids: parseInt(item.bids),
        price: parseFloat(item.price)
    }
};
