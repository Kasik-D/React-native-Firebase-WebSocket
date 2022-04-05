import { Icon } from 'native-base';
import React from 'react';
import { Path } from 'react-native-svg';

export const UpDownArrow = (props: any) => {
  return (
    <Icon width='16' height='16' viewBox='0 0 16 16' fill='none' {...props}>
      <Path
        d='M7 10.25L4 14M4 14L0.999999 10.25M4 14L4 2'
        stroke='#FFF'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M15 5.75L12 2M12 2L9 5.75M12 2L12 14'
        stroke='#FFF'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Icon>
  );
};
