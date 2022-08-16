import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, },
  dob: { type: Date},
  breed: {type: mongoose.Schema.Types.ObjectId, ref: 'Breed'},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

DogSchema.index({ name: 1, owner: 1 }, { unique: true });

const Dog = mongoose.model('Dog', DogSchema);
export default Dog;