import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, },
  dob: { type: Date},
  breed: {type: mongoose.Schema.Types.ObjectId, ref: 'Breed'},
});

const Dog = mongoose.model('Dog', DogSchema);
export default Dog;