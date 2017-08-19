import { Router, Request, Response, NextFunction } from 'express';
import * as GalleryService from './../services/gallery.service';
import * as I from './../interfaces';

class Gallery {

	public async images(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let input = req.body
		console.log(input);

		let images:I.IImage[] = [];
		try {
			images = await GalleryService.getImages(input.search);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
		resp.json({ status: I.ResultStatus.SUCCESS, payload: images} as I.IResults);
	}

}

const gallery = new Gallery();

export const GalleryRouter = Router();
GalleryRouter.post('/images', gallery.images);