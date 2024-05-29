import { Restaurant } from "@/model/Restaurant";
import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


type OpenStatusLabelProps = {
    restaurant: Restaurant;
  };

const OpenStatusLabel: React.FC<OpenStatusLabelProps> = ({restaurant}) => {
    
    if (restaurant.currentOpeningHours)
    {
      const labelContent = {
            text: restaurant.currentOpeningHours.openNow === true ? 'Open' : 'Closed',
            color: restaurant.currentOpeningHours.openNow === true ? '#319F43' : '#E33629',
        }

      return (
        <View style={{ 
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
          }} testID={labelContent.text}>
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
  }

export default OpenStatusLabel;


