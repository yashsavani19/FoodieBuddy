import React, { ReactNode, Children } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CategoryContainer = ({ title, children }: { title: string, children: ReactNode }) => {
    const childrenArray = Children.toArray(children);
    const enoughChildrenForScroll = childrenArray.length > 4; 

    return (
        <View style={{paddingVertical: 5}}>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.row}>
                {enoughChildrenForScroll ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {children}
                    </ScrollView>
                ) : (
                    <View style={{flexDirection: 'row'}}>
                        {children}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#363232',
    marginVertical: 3,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  line: {
    height: 2,
    backgroundColor: '#A6A6A6',
    borderRadius: 20,  
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
});

export default CategoryContainer;