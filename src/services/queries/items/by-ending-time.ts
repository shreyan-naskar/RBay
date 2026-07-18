import { itemsByEndingAtKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";


export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const recentIds = await client.zRange(
		itemsByEndingAtKey(),
		Date.now(),
		'+inf', 
		{
			BY: 'SCORE',
			LIMIT: {
				offset,
				count
			}
		}
	)
	const recentItems = await Promise.all(recentIds.map(id => client.hGetAll(itemsKey(id))))

	return recentItems.map( (item, i) => deserialize(recentIds[i], item))
};
