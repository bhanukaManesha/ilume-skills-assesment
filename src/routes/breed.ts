import { Router } from 'express';
import verifyToken from '../middleware/auth';
import { getBreeds } from '../services/breed';

const router = Router();

router.get("", verifyToken, async (req: any, res: any) => {
    const breeds = await getBreeds()
    return res.status(200).json(breeds)
})

export default router;