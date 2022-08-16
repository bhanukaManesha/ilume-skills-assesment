import Breed from '../model/breed'
import {connect} from 'mongoose';
import dotenv from "dotenv";

// initialize configuration
dotenv.config();
const MONGO_URI = process.env.MONGO_URI
connect(MONGO_URI)

const breeds = [
    new Breed({
        name: "Cavoodle",
    }),
    new Breed({
        name: "Labrador",
    }),
    new Breed({
        name: "Pug",
    }),
]

// save your data
breeds.map(async (breed, idx) => { 
    try {
        breed.save(); 
    } catch {
        console.log(`${breed.name} already exists`)
    }    
});