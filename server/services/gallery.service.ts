import { Image } from './db.service';
import * as I from './../interfaces';

export async function getImages(id: string): Promise<I.ImageInstance[]> {
	let images:I.ImageInstance[];
	try {
		images = await Image.findAll();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return images;
}
