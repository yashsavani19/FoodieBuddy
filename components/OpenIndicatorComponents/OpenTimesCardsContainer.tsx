import React, { ReactNode, Children } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const OpenTimesCardsContainer = ({ children }: { children: ReactNode }) => {
    return (
      <View style={{paddingBottom: wp('3%')}}>
          <View style={styles.row}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {children}
            </ScrollView>
          </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row', 
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
});

export default OpenTimesCardsContainer;