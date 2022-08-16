import mongoose from 'mongoose';

const BreedSchema = new mongoose.Schema({
    name: { type: String, unique:true },
});

const Breed = mongoose.model('Breed', BreedSchema);
export default Breed;