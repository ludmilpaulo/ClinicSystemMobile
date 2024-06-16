import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DrugCard from "../components/DrugCard";
import { Drug } from "../utils/types";
import { baseAPI } from "../utils/variables";
import tailwind from "tailwind-react-native-classnames";

const HomePage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${baseAPI}/pharmacy/pharmacy/drugs/`)
      .then((response) => {
        setDrugs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    axios
      .get(`${baseAPI}/pharmacy/pharmacy/categories/`)
      .then((response) => {
        setCategories([
          "All",
          ...response.data.map((category: { name: string }) => category.name),
        ]);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDrugs = drugs.filter((drug) => {
    const matchesCategory =
      selectedCategory === "All" || drug.category_name === selectedCategory;
    const matchesSearchQuery = drug.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <View style={[tailwind`flex-1 p-4 pt-12`]}>
      {loading ? (
        <View style={[tailwind`flex items-center justify-center h-full`]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {error && (
            <Text style={[tailwind`text-red-500 mb-4`]}>Error: {error}</Text>
          )}
          <View style={[tailwind`mb-4 flex-row justify-between items-center`]}>
            <View>
              <Text style={[tailwind`font-semibold text-lg mr-2`]}>
                Filter by Category:
              </Text>
              <View style={[tailwind`border rounded px-4 py-2`]}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  {categories.map((category, index) => (
                    <Picker.Item
                      key={index}
                      label={category}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <TextInput
            style={[tailwind`border rounded px-4 py-2 mb-4`]}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {filteredDrugs.map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%", // Adjust based on your desired column width
    marginBottom: 20,
  },
});

export default HomePage;
