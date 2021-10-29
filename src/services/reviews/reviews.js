import uniqid from "uniqid"
import express from "express" 
import { readReviews , writeReviews } from "../../lib/fs-tools.js"
import multer from "multer"

const reviewsRouter = express.Router()


reviewsRouter.get("/" , async(req, res, next) => {
    const reviews = await readReviews()

    res.status(200).send(reviews)
})

reviewsRouter.post("/:mediaId" , async(req, res, next) => {
    const reviews = await readReviews()

    const newPost = {
        _id: uniqid(),
        ...req.body,
        elementId: req.params.mediaId,
        createdAt: new Date()
    }

    reviews.push(newPost)


    await writeReviews(reviews)

    res.status(200).send(newPost)
})



reviewsRouter.delete("/:mediaId" , async(req, res, next) => {
    const reviews = await readReviews()

    const reviewsArray = reviews.filter((r) => r._id !== req.params.mediaId)

    await writeReviews(reviewsArray)

    res.status(204).send()
})


export default reviewsRouter