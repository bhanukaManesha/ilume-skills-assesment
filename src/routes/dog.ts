import { Request, Response, Router } from 'express';
import Breed from '../model/breed';
import verifyToken from '../middleware/auth';
import { findUser } from '../services/auth';
import { createDog, findDog, findDogById, getDogsByOwnerID, patchDog, updateDog } from '../services/dog';
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

        // validate user input
        if (!(name && dob && breed)) {
            return res.status(400).send("All input is required");
        }

        // validate date
        const dateOfBirth = new Date(dob);
        if (!(dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf()))) {
            return res.status(400).send("Incorect dob format: required format - yyyy-mm-dd");
        }
        if (dateOfBirth.valueOf() > Date.now()) {
            return res.status(400).send("dob cannot be in the future");
        }

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

        // create dog
        const dog = await createDog(name, dateOfBirth, breed, owner)

        return res.status(201).json(dog)

        }
        catch (e) {
            console.log(e)
            return res.status(400).send("Unable to create dog. Please check logs.");
        }
    });


router.put("/id/:dogid", verifyToken, async (req: any, res: any) => {

    try {
        // get request data
        const owner = await findUser(req.user.email)
        const dogid = req.params.dogid

        const { name, dob, breed } = req.body;

        // validate user input
        if (!(name && dob && breed)) {
            return res.status(400).send("All input is required");
        }

        // validate date
        const dateOfBirth = new Date(dob);
        if (!(dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf()))) {
            return res.status(400).send("Incorect dob format: required format - yyyy-mm-dd");
        }
        if (dateOfBirth.valueOf() > Date.now()) {
            return res.status(400).send("dob cannot be in the future");
        }

        // validate breed
        const dogBreed = await Breed.findById(breed)
        if (!dogBreed) {
            return res.status(400).send("Incorect breed");
        }

        // check if already in db
        const oldDog = await findDogById(dogid)
        if (!oldDog) {
            return res.status(400).send("Dog id does not exist");
        }

        if (oldDog.owner.id !== owner.id) {
            return res.status(400).send("Dog does not exist");
        }

        // update dog
        const dog = await updateDog(name, dateOfBirth, breed, oldDog)

        return res.status(204).json(dog)
    }
    catch (e) {
        console.log(e)
        return res.status(400).send("Unable to update dog. Please check logs.");
    }
} )


router.patch("/id/:dogid", verifyToken, async (req: any, res: any) => {
    try {
        // get request info
        const owner = await findUser(req.user.email)
        const dogid = req.params.dogid

        const { name, dob, breed } = req.body;

        // check if already in db
        const oldDog = await findDogById(dogid)
        if (!oldDog) {
            return res.status(400).send("Dog id does not exist");
        }

        if (oldDog.owner.id !== owner.id) {
            return res.status(400).send("Dog does not exist");
        }

        let dog = oldDog;

        if (name) {
            dog = await patchDog(oldDog, "name", name)
        }

        if (dob) {
            // validate date
            const dateOfBirth = new Date(dob);
            if (!(dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf()))) {
                return res.status(400).send("Incorect dob format: required format - yyyy-mm-dd");
            }
            if (dateOfBirth.valueOf() > Date.now()) {
                return res.status(400).send("dob cannot be in the future");
            }
            dog = await patchDog(oldDog, "dob", dateOfBirth)
        }

        if (breed) {
            // validate breed
            const dogBreed = await Breed.findById(breed)
            if (!dogBreed) {
                return res.status(400).send("Incorect breed");
            }
            dog = await patchDog(oldDog, "breed", breed)
        }

        return res.status(204).json(dog)
    }
    catch (e) {
        console.log(e)
        return res.status(400).send("Unable to patch dog. Please check logs.");
    }
} )


router.delete("/id/:dogid", verifyToken, async (req: any, res: any) => {

    try {
        const owner = await findUser(req.user.email)
        const dogid = req.params.dogid

        // check if already in db
        const dog = await findDogById(dogid)
        if (!dog) {
            return res.status(400).send("Dog id does not exist");
        }

        if (dog.owner.id !== owner.id) {
            return res.status(400).send("Dog does not exist");
        }

        dog.delete()

        return res.status(204).json(dog)
    }
    catch (e) {
        console.log(e)
        return res.status(400).send("Unable to delete dog. Please check logs.");
    }
} )


export default router;