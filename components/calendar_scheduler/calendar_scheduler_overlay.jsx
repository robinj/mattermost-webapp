// Copyright (c) 2015-present Robin Janssens. All Rights Reserved.

import PropTypes from 'prop-types';
import React from 'react';
import {Overlay} from 'react-bootstrap';

import CalendarScheduler from './calendar_scheduler.jsx';

export default class CalendarSchedulerOverlay extends React.PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        container: PropTypes.func,
        target: PropTypes.func.isRequired,
        onDateSelect: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        rightOffset: PropTypes.number,
        topOffset: PropTypes.number,
        spaceRequiredAbove: PropTypes.number,
        spaceRequiredBelow: PropTypes.number
    }

    // Reasonable defaults calculated from from the center channel
    static defaultProps = {
        spaceRequiredAbove: 422,
        spaceRequiredBelow: 436
    }

    constructor(props) {
        super(props);

        this.state = {
            placement: 'top'
        };
    }

    componentWillUpdate(nextProps) {
        if (nextProps.show && !this.props.show) {
            const targetBounds = nextProps.target().getBoundingClientRect();

            let placement;
            if (targetBounds.top > nextProps.spaceRequiredAbove) {
                placement = 'top';
            } else if (window.innerHeight - targetBounds.bottom > nextProps.spaceRequiredBelow) {
                placement = 'bottom';
            } else {
                placement = 'left';
            }

            this.setState({placement});
        }
    }

    render() {
        return (
            <Overlay
                show={this.props.show}
                placement={this.state.placement}
                rootClose={true}
                container={this.props.container}
                onHide={this.props.onHide}
                target={this.props.target}
                animation={false}
            >
                <CalendarScheduler
                    onDateSelect={this.props.onDateSelect}
                />
            </Overlay>
        );
    }
}
