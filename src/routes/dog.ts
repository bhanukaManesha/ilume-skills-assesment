import { Request, Response, Router } from 'express';
import Breed from '../model/breed';
import verifyToken from '../middleware/auth';
import { findUser } from '../services/auth';
import { createDog, findDog, findDogById, getDogsByOwnerID } from '../services/dog';
const router = Router();

router.get("", verifyToken, async (req: any, res: any) => {
    const owner = await findUser(req.user.email)
    const dogs = await getDogsByOwnerID(owner.id)
    return res.status(200).json(dogs)
})

router.get("/id/:dogid", verifyToken, async (req: any, res: any) => {
    
    const dogid = req.params.dogid
    try {
        const dog = await findDogById(dogid)    

        if (dog) {
            return res.status(200).json(dog)
        } else {
            return res.status(400).send("Dog not found");
        }

    } catch {
        return res.status(400).send("Dog not found");
    }
    
})


// Register
router.post("/", verifyToken, async (req: any, res) => {
    try {

        // Get user input
        const { name, dob, breed } = req.body;
        console.log(name, dob, breed)
        // validate user input
        if (!(name && dob && breed)) {
            return res.status(400).send("All input is required");
        }

        // validate date
        const dateOfBirth = new Date(dob);

        // validate breed
        const dogBreed = await Breed.findById(breed)
        if (!dogBreed) {
            return res.status(400).send("Incorect breed");
        }

        // validate owner
        const owner = await findUser(req.user.email)
        if (!owner) {
            return res.status(400).send("Owner not found.");
        }

        // check if already in db
        const oldDog = await findDog(name, owner)
        if (oldDog) {
            return res.status(409).send("Dog already exist");
        }

        const dog = await createDog(name, dateOfBirth, breed, owner)

        return res.status(201).json(dog)
        
        }
        catch (e) {
            console.log(e)
            return res.status(400).send("Unable to create dog. Please check logs.");
            // if (e instanceof ) {
            //     return res.status(400).send("Incorect dob format: required format - yyyy-mm-dd");
            // } else {
            //     return res.status(400).send("Unable to create dog. Please check logs.");
            // }
        }
    });

export default router;