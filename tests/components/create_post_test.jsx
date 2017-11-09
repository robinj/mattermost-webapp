// Copyright (c) 2017-present Robin Janssens. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import CreatePost from 'components/create_post.jsx';

describe('components/create_post', () => {
    test('should set the post to the selected calendar date', () => {
        const selectedStartDate = new Date('2017-11-11T10:00:00Z');
        const selectedEndDate = new Date('2017-11-11T10:30:00Z');

        function fakeGetChannelView() {} //eslint-disable-line no-empty-function

        const wrapper = shallow(
            <CreatePost
                getChannelView={fakeGetChannelView}
            />
        );

        wrapper.handleCalendarSelection({
            start: selectedStartDate,
            end: selectedEndDate
        });

        expect(wrapper.state().message).toEqual('Your meeting is scheduled to start 11/11/2017, 10:00:00 and end at 11/11/2017, 10:30:00');
    });
});