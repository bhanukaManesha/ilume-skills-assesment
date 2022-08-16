import Dog from '../model/dog';

// Find dog given the name and owner
export const findDog = async (name: string, user: any) => {
    return Dog.findOne({ "name" : name, "owner" : user })
}

// Find a dog object given the id
export const findDogById = async (dogid:string) => {
    return Dog.findOne({ _id : dogid }).populate({
        path: 'breed',
        model: 'Breed',
        select: 'name'
    })    
    .populate({
        path: 'owner',
        model: 'User',
        select: 'email'
    })
}

// Create a dog
export const createDog = async (name: string, dob: Date, breed: any, owner : any) => {
    const dog: any = await Dog.create({
        name: name,
        dob: dob,
        breed: breed,
        owner: owner
    });

    return dog

}

// update Dog
export const updateDog = async (name: string, dob: Date, breed: any, dog:any) => {
    
    dog.name = name;
    dog.dob = dob;
    dog.breed = breed;

    return dog.save()

}

// patch dog
export const patchDog = async (dog : any, field : any, value : any) => {
    dog[field] = value
    return dog.save()

}

// get all the owners of the dog
export const getDogsByOwnerID = async (ownerid: any) => {
    return Dog.find({"owner" : ownerid})
        .populate({
            path: 'breed',
            model: 'Breed',
            select: 'name'
        })    
        .populate({
            path: 'owner',
            model: 'User',
            select: 'email'
        })
                
}



