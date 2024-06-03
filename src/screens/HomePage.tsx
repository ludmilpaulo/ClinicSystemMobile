import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import DrugCard from '../components/DrugCard';
import { Drug } from '../utils/types';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import { fetchDrugs, fetchCategories } from '../services/apiService';

const HomePage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const drugsData = await fetchDrugs();
        setDrugs(drugsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    loadData();
    loadCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const filteredDrugs = drugs.filter(drug => {
    const matchesCategory = selectedCategory === 'All' || drug.category_name === selectedCategory;
    const matchesSearchQuery = drug.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      {loading && (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!loading && (
        <>
          {error && <Text style={tw`text-red-500 mb-4`}>Error: {error}</Text>}
          <View style={tw`mb-4`}>
            <Text style={tw`font-semibold text-lg mb-2 text-gray-700`}>Filter by Category:</Text>
            <View style={tw`border border-gray-300 rounded-lg p-2 bg-white`}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => handleCategoryChange(itemValue)}
              >
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>
          <TextInput
            style={tw`h-10 border-2 border-transparent bg-blue-500 rounded-lg mb-4 px-2 text-white placeholder-white focus:outline-none`}
            placeholder="Search..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <ScrollView contentContainerStyle={tw`flex-row flex-wrap justify-between`}>
            {filteredDrugs.map((drug) => (
              <View key={drug.id} style={tw`w-full md:w-5/12 lg:w-3/12 mb-4`}>
                <DrugCard drug={drug} />
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default HomePage;
