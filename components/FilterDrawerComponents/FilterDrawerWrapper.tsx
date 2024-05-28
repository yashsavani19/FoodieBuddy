// DrawerWrapper.tsx
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import DrawerContext from "@/context/DrawerContext"; 
import { Drawer } from 'react-native-drawer-layout';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerContent from './FilterDrawerContent';
import { Category } from '@/model/Category';
import { AppContext } from '@/context/AppContext';

const DrawerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [scrollViewRef, setScrollViewRef] = useState<React.RefObject<ScrollView>>(() => React.createRef<ScrollView>());
  const { selectedFilters, setSelectedFilters, filterRestaurants } = useContext(AppContext);

  useEffect(() => {
    filterRestaurants();
  }, [selectedFilters]);

  const handleApplyFilters = (filters: Category[], distance: number) => {
    handleClose();
    console.log(filters, distance);
    setSelectedFilters(filters);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { // Scroll back to top with a 0.5s delay
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 500);
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
            handleClose();
        }}
        drawerPosition='right'
        swipeEnabled={false}
        renderDrawerContent={() => {
            return <DrawerContent onApplyFilters={handleApplyFilters} setScrollViewRef={setScrollViewRef} />;
        }}
      >
        {children}
      </Drawer>
    </DrawerContext.Provider>
  );
};

export default DrawerWrapper;