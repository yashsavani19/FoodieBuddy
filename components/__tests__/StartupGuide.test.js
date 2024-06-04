// StartupGuide.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StartupGuide from '@/components/modals/StartupGuide.tsx';

describe('StartupGuide', () => {
  it('calls onClose when the close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(<StartupGuide onClose={onCloseMock} />);

    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
