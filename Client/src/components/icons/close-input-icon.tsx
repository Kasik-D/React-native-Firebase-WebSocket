import { Icon } from 'native-base';
import React from 'react';
import { Path } from 'react-native-svg';

export const CloseInput = (props: any) => {
  return (
    <Icon width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
      <Path
        d='M19 5L5 19'
        stroke='#B2BAD6'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M5 5L19 19'
        stroke='#B2BAD6'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Icon>
  );
};
