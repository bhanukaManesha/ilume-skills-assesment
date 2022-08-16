import Breed from '../model/breed'

export const getBreeds = async () => {
    return Breed.find().select("name")
}