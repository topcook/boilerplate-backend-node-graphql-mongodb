import mongoose from 'mongoose';

import { StudentsSchema } from './schemas/index.js';

export default {
	Students: mongoose.model('students', StudentsSchema),
};