import React from 'react';
import {connect} from 'react-redux';

import {
  defaultAction
} from '../actions';

import HomePage from '../components/HomePage';

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

const HomePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default HomePageContainer;
