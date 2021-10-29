import uniqid from "uniqid"
import express from "express" 
import { readMedia , writeMedia } from "../../lib/fs-tools.js"
import multer from "multer"
import fetch from 'node-fetch'

//cloudinary
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"


const mediaRouter = express.Router()


const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "MoviesPosters"
	}
})



const fetchedData = async (query) => { 
    const response = await fetch(process.env.API_KEY + query);
    const data = await response.json();
    if(data.Search) return data
};


mediaRouter.get("/" , async(req, res, next) => {
    try {
        
        if(!req.query) {
            const media = await readMedia()

            res.status(200).send(media)
        } else {

            const media = await readMedia()

            const filteredMedia = media.filter((m) => m.Title.includes(req.query.title))

            

            if(filteredMedia.length === 0) {
                const data = await fetchedData(req.query.title)

                await writeMedia(data.Search)
                
                res.status(200).send(data)
                return
            }

            res.status(200).send(filteredMedia)
        }
    } catch (error) {
        next(error)
    }
})





mediaRouter.get("/:mediaId" , async(req, res, next) => {
    try {
        const media = await readMedia()

        
        const filteredMedia = media.filter((m) => m.imdbID === req.params.mediaId);
       

        if(media) {
            res.status(200).send(filteredMedia)
        }

        
    } catch (error) {
        next(error)
    }
})




mediaRouter.put("/:mediaId", async(req, res, next) => {
    const media = await readMedia()

    const indexMedia = media.findIndex((m) => m.imdbID === req.params.mediaId);

    const updatedMedia = {
        ...media[indexMedia],
        ...req.body,
        updatedAt: new Date()
    }

    media[indexMedia] = updatedMedia

    await writeMedia(media)

    res.status(200).send(updatedMedia)
})


mediaRouter.put("/:mediaId/poster", multer({storage: cloudinaryStorage}).single("Poster") , async(req, res, next) => {

    console.log(req.file)
    const media = await readMedia()

    const indexMedia = media.findIndex((m) => m.imdbID === req.params.mediaId);

    media[indexMedia].Poster = req.file.path

    await writeMedia(media)

    res.status(200).send(media[indexMedia])
})




mediaRouter.delete("/:mediaId", async(req, res, next) => {

    const media = await readMedia()

    const filteredMedia = media.filter((m) => m.imdbID !== req.params.mediaId);

    console.log(filteredMedia)

    await writeMedia(filteredMedia)

    res.status(204).send()
})





export default mediaRouter