import fs from "fs-extra"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const { readJSON , writeJSON } = fs

const mediaPath = join(dirname(fileURLToPath(import.meta.url)) , "../data/media.json")

const reviewsPath = join(dirname(fileURLToPath(import.meta.url)) , "../data/reviews.json")


export const readMedia = () => readJSON(mediaPath)

export const writeMedia = (content) => writeJSON(mediaPath, content)

export const readReviews = () => readJSON(reviewsPath)

export const writeReviews = (content) => writeJSON(reviewsPath, content)