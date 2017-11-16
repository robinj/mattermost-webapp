// Copyright (c) 2015-present Robin Janssens. All Rights Reserved.

import PropTypes from 'prop-types';
import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class CalendarScheduler extends React.PureComponent {
    static propTypes = {
        onDateSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        rightOffset: 0,
        topOffset: 0
    };

    render() {
        // For the purpose of this exercise I haven't implemented events
        const events = [];

        return (
            <div
                className='calendar-scheduler'
            >
                <BigCalendar
                    events={events}
                    selectable={true}
                    defaultView='week'
                    step={15}
                    timeslots={8}
                    scrollToTime={new Date()}
                    defaultDate={new Date()}
                    onSelectSlot={this.props.onDateSelect}
                />
            </div>
        );
    }
}