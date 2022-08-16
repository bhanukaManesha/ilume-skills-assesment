import Dog from '../model/dog';

export const findDog = async (name: string, user: any) => {
    return Dog.findOne({ "name" : name, "owner" : user })
}

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

export const createDog = async (name: string, dob: Date, breed: any, owner : any) => {
    
    const dog: any = await Dog.create({
        name: name,
        dob: dob,
        breed: breed,
        owner: owner
    });

    return dog

}

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



