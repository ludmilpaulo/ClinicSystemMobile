// navigation.d.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  DrugPage: { id: number }; // Change id to number
  CartPage: undefined;
};

export type DrugPageNavigationProp = StackNavigationProp<RootStackParamList, 'DrugPage'>;
export type DrugPageRouteProp = RouteProp<RootStackParamList, 'DrugPage'>;
