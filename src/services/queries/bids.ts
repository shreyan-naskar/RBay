import { bidHistoryKey, itemsByPriceKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon';
import { getItem } from './items';
import { attr } from 'svelte/internal';

export const createBid = async (attrs: CreateBidAttrs) => {
	return client.executeIsolated(async (isolatedClient)=> {
		// watch for concurrency
		await isolatedClient.watch(itemsKey(attrs.itemId))


		const item = await getItem(attrs.itemId)

		// validation checks
		// only allow bid on existing item
		if(!item){
			throw new Error("Item does not exist!")
		}
		if(item.endingAt.diff(DateTime.now()).toMillis() < 0){
			throw new Error("Item closed to bidding!")
		}
		// higher bid is valid
		if(item.price >= attrs.amount){
			throw new Error("Bid too low!")
		}

		const serialized = serializeHistory(
			attrs.amount,
			attrs.createdAt.toMillis()
		)
		// add bids to the list
		return isolatedClient
			.multi()
			.rPush(bidHistoryKey(attrs.itemId), serialized)
			.hSet(itemsKey(item.id), {
				bids: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			})
			.zAdd(itemsByPriceKey(), {
				value: item.id,
				score: attrs.amount
			})
			.exec()
	})
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const st = -1*offset - count
	const end = -1 - offset

	const range = await client.lRange(bidHistoryKey(itemId), st, end)

	return range.map(bid => deserializeHistory(bid))
};

const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`
}

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':')
	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	}
}