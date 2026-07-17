import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car', {
        color: "red",
        year: 1950
    });
    //HSET car color red year 1950

    const car = await client.HGETALL('car');

    console.log(car);
};
run();
