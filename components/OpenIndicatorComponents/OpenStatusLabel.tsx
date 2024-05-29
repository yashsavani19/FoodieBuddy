import { Restaurant } from "@/model/Restaurant";
import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type OpenStatusLabelProps = {
    restaurant: Restaurant;
    listLabel: boolean;
  };

const OpenStatusLabel: React.FC<OpenStatusLabelProps> = ({restaurant, listLabel}) => {
        
    if (restaurant.currentOpeningHours)
    {
        const labelContent = {
            text: restaurant.currentOpeningHours.openNow === true ? 'Open' : 'Closed',
            color: restaurant.currentOpeningHours.openNow === true ? '#319F43' : '#E33629',
        }

        if (listLabel) {
            return (
                <View style={styles.labelBackground} testID={labelContent.text}>
                    <Text style={{ 
                        color: '#363232', 
                        fontWeight: 'bold',
                        marginRight: 5
                    }}>
                    {labelContent.text}
                    </Text>
                    <MaterialCommunityIcons name="clock" size={26} color={labelContent.color} />
                </View>
            )
        }

        else {
            return (
                <View style={styles.labelNoBackground} testID={labelContent.text}>
                    <MaterialCommunityIcons name="clock" size={24} color='#363232' />
                    <Text style={{ 
                        color: '#363232', 
                        marginLeft: 6
                    }}>
                    {labelContent.text}
                    </Text>
                </View>
            )
        }
    }
  }

  const styles = StyleSheet.create({
    labelBackground: {
        position: 'absolute', 
        right: 20, 
        top: 20, 
        backgroundColor: '#ffffff', 
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 6,
      },
    
    labelNoBackground: {
        flexDirection: 'row',
        alignItems: 'center',
      }
  });

export default OpenStatusLabel;


