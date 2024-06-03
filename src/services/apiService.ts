import categoriesData from './categories.json';
import drugsData from './drugs.json';
import { Drug } from '../utils/types';

export const fetchDrugs = async (): Promise<Drug[]> => {
  return new Promise<Drug[]>((resolve) => {
    setTimeout(() => {
      resolve(drugsData);
    }, 500); // Simulating network delay
  });
};

export const fetchCategories = async (): Promise<string[]> => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(['All', ...categoriesData.map((category: { name: string }) => category.name)]);
    }, 500); // Simulating network delay
  });
};
