import React from 'react';
import {connect} from 'react-redux';

import {
  defaultAction
} from '../actions';

import HomeScreen from '../components/HomeScreen';

const mapStateToProps = (state, ownProps) => {
  return {
    state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    defaultContainerAction : (value) => {
      dispatch(defaultAction(value));
    }
  }
}

const HomeScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

export default HomeScreenContainer;
