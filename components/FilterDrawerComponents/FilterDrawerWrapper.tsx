// DrawerWrapper.tsx
import * as React from 'react';
import { useEffect, useState } from 'react';
import DrawerContext from "@/context/DrawerContext"; 
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../Themed';
import CategoryContainer from './CategoryContainer';
import { StyleSheet } from 'react-native';
import { categories } from "@/assets/data/categories-options";
import CategoryButton from './CategoryButton';
import { Category } from '@/model/Category';

const DrawerContent = () => {
    const [filters, setFilters] = useState<Category[]>([]);

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    return (
        <SafeAreaView style = {{marginHorizontal: 10}}>
            <ScrollView>
                <View>
                    <CategoryContainer title="Cuisine Types">
                        {categories.filter(categories => categories.type === "Cuisine Type").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category}
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Food Categories">
                        {categories.filter(categories => categories.type === "Food Category").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Eating Spot Types">
                        {categories.filter(categories => categories.type === "Eating Spot Type").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Dietary Preferences">
                        {categories.filter(categories => categories.type === "Dietary Preference").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Price Range">
                        {categories.filter(categories => categories.type === "Price").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Minimum Rating">
                        {categories.filter(categories => categories.type === "Price").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const DrawerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerPosition='right'
        swipeEnabled={false}
        renderDrawerContent={() => {
          return DrawerContent();
        }}
      >
        {children}
      </Drawer>
    </DrawerContext.Provider>
  );
};

export default DrawerWrapper;