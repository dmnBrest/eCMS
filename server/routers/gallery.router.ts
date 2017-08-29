import { Router, Request, Response, NextFunction } from 'express';
import * as GalleryService from './../services/gallery.service';
import * as I from './../interfaces';

var multer  = require('multer')
var upload = multer({ dest: './uploads/' })

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

	public async upload(req: Request, resp: Response, next?: NextFunction) {
		console.log(req['file']);
		resp.send('OK!');
	}

}

const gallery = new Gallery();

export const GalleryRouter = Router();
GalleryRouter.post('/images', gallery.images);
GalleryRouter.post('/upload', upload.single('file'), gallery.upload);