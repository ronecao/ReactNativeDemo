import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import TransListView from '../src/TransListView';

it('renders correctly', () => {
    renderer.create(<TransListView />);
});
