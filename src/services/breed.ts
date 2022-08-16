import Breed from '../model/breed'

// get all the breeds
export const getBreeds = async () => {
    return Breed.find().select("name")
}