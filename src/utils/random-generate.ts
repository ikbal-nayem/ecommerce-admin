import { v4 as uuidv4 } from 'uuid';

export const generateId = () => Math.floor(100000 + Math.random() * 900000);
export const generateUUID = () => uuidv4();
