import { itemsKey, userLikesKey } from "$services/keys";
import { client } from "$services/redis";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {
    // return if user likes given item
    const liked = await client.sIsMember(userLikesKey(userId), itemId)
    return liked
};

export const likedItems = async (userId: string) => {
    // fetch all itemids liked by user
    const ids = await client.sMembers(userLikesKey(userId))

    // get all items liked by the user 
    return getItems(ids)
};

export const likeItem = async (itemId: string, userId: string) => {
    // add item to user's list of liked items
    const inserted = await  client.sAdd(userLikesKey(userId), itemId)
    // add the like to the item's attribute
    if(inserted){
        await client.hIncrBy(itemsKey(itemId), 'likes', 1)
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
    // add item to user's list of unliked items
    const removed = await  client.sRem(userLikesKey(userId), itemId)
    // decr the like to the item's attribute
    if(removed){
        await client.hIncrBy(itemsKey(itemId), 'likes', -1)
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    // get intersection of the two sets of itemIds
    const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)])

    return getItems(ids)
};
