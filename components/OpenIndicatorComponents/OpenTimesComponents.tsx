import { Restaurant } from "@/model/Restaurant";
import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type OpenTimesCardProps = {
    restaurant: Restaurant;
    openTime?: any;
  };

  export const openTimesContent = (restaurant: Restaurant) => {
    if (restaurant.currentOpeningHours) {
      const openTimes = restaurant.currentOpeningHours.weekdayDescriptions.map((openTime: string) => {
        const [day, times] = openTime.split(': ');
        const timeArray = times.includes(',') ? times.split(',').map(time => time.trim()) : [times];
        return { day, time: timeArray };
      });
  
      return {
        openTimes,
        todayOpenTimes: openTimes[new Date().getDay() - 1],
      };
    }
  };

  export const OpenTimesCard: React.FC<OpenTimesCardProps> = ({restaurant, openTime}) => {
    if (restaurant.currentOpeningHours)
    {
        return (
            <View style={{margin: wp("0.8%"), marginVertical: wp("2.5%")}}>
                <View style={styles.labelBackground}>
                    {openTime?.time[0] === "Closed" ? (
                        <FontAwesome6 name="calendar-xmark" size={24} color={"#363232"} />
                        ) : (
                        <FontAwesome6 name="calendar-check" size={24} color={"#363232"} />
                    )}
                    <View style={{ flexDirection: "column", marginLeft: 3 }}>
                        <Text style={ styles.boldText }>
                            { openTime?.day }
                        </Text>
                        <Text style={ styles.text }>
                            { openTime?.time.join('\n') }
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export const OpenTimesLabel: React.FC<OpenTimesCardProps> = ({restaurant}) => {

    if (restaurant.currentOpeningHours)
    {
        const labelContent = openTimesContent(restaurant);

        return (
            <View style={styles.labelNoBackground}>
                <MaterialCommunityIcons name="clock" size={21} color='#363232' />
                <View style={{ flexDirection: "column" }}>
                    <Text style={ styles.boldText }>
                        { labelContent?.todayOpenTimes.day }
                    </Text>
                    <Text style={ styles.text }>
                        { labelContent?.todayOpenTimes.time.join('\n') }
                    </Text>
                </View>
            </View>
        )
    }
  }

const styles = StyleSheet.create({
    labelBackground: {
        backgroundColor: '#ffffff', 
        flexBasis: wp('20%'),
        flexGrow: 1,
        borderRadius: 5,
        padding: 12,
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2.5,
        borderWidth: 2,
        borderColor: '#353232',
    },

    labelNoBackground: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    boldText: {
        color: '#363232', 
        fontWeight: 'bold', 
        marginHorizontal: 5,
        fontSize: 12.5,
    },

    text: {
        color: '#363232', 
        marginHorizontal: 5,
        fontSize: 12.5,
    }
});