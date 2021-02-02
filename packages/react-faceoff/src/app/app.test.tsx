import { render } from '@testing-library/react';
import React from 'react';
import { App } from '.';

describe('App', () => {
  it('should work', function () {
    const { getByText } = render(<App/>);
    getByText('Welcome to FaceOff...');
  });
});
