import { Router } from 'express';
import { validateSchema } from '@middlewares/ValidationMiddleware';
import * as crawlController from '@functions/ceps/controllers';
import { yupSchema } from '@libs/yup';

const router = Router();

router.get('/:id/results', crawlController.results);
router.get('/:id', crawlController.status);
router.post('/', validateSchema(yupSchema), crawlController.create);

export default router;
