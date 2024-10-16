import Search from '../models/searchModel';
import { ISearchData } from '../controllers/getSearch';
export const saveToMongoDB = async (data: ISearchData) => {
  try {
    const mongoResult = await Search.create(data);
    console.log('Saved to MongoDB:', mongoResult);
    return mongoResult;
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    throw new Error('Failed to save data to MongoDB');
  }
};