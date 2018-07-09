import 'react-native';
import renderer from 'react-test-renderer';
import React from 'react';
import CMSTextField from '../src/CMSTextField';
// Note: test renderer must be required after react-native.

it('renders correctly', () => {
    const tree = renderer.create(<CMSTextField />);
});
