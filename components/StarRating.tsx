import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define an interface for component props
interface StarRatingProps {
  rating: number;  // Define the type for `rating` as number
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5 ? 1 : 0; // Determine if there is a half star
  const noStars = 5 - fullStars - halfStar; // Calculate remaining empty stars

  return (
    <View style={{ flexDirection: 'row' }}>
      {Array(fullStars).fill(null).map((_, index) => (
        <Icon key={`full-${index}`} name="star" size={14} color="#ffd700" />
      ))}
      {halfStar > 0 && (
        <Icon key="half-1" name="star-half-o" size={14} color="#ffd700" />
      )}
      {Array(noStars).fill(null).map((_, index) => (
        <Icon key={`empty-${index + fullStars}`} name="star-o" size={14} color="#ffd700" />
      ))}
    </View>
  );
};

export default StarRating;
