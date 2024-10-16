import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { generateResponse } from '../services/geminiService';
import { saveToMongoDB } from '../helpers/saveToMongoDB';

export interface ISearchData {
  title: string;
  content: string;
  score: number;
  createdAt: Date;
}

export const getSearch = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid query' });
  }

    const aiResponse = await generateResponse(q);
    
    const dataToSave: ISearchData = {
    title: q,
    content: aiResponse,
    score: 1,
    createdAt: new Date()
  };
    
    await saveToMongoDB(dataToSave);
    
   const results = [{ title: q, content: aiResponse, score: 1 }];

  res.status(200).json({ success: true, data: results });
});

