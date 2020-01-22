import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from '../vendor/errors';
import ChartJsWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import { getIssues } from './query';

class GithubGraph extends Component {
  state = {
    data: null,
    isLoading: true,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const { timeDomain } = this.props;

    this.setState({ isLoading: true });

    try {
      this.setState({
        standardOptions: {
          ...(await getIssues({ timeDomain })),
          'axis.y.label': 'Number of issues',
        },
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { title } = this.props;

    return <ChartJsWrapper title={title} {...this.state} />;
  }
}

GithubGraph.propTypes = {
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      parameters: PropTypes.shape({
        include_fields: PropTypes.string,
        component: PropTypes.string,
        resolution: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.string,
        ]),
        priority: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  ),
  startDate: PropTypes.string,
  title: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
};

export default withErrorBoundary(GithubGraph);
