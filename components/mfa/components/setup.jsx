// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router';

import {activateMfa, generateMfaSecret} from 'actions/user_actions.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';

export default class Setup extends React.Component {
    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);

        this.state = {secret: '', qrCode: ''};
    }

    componentDidMount() {
        const user = UserStore.getCurrentUser();
        if (!user || user.mfa_active) {
            browserHistory.push('/');
            return;
        }

        generateMfaSecret(
            (data) => this.setState({secret: data.secret, qrCode: data.qr_code}),
            (err) => this.setState({serverError: err.message})
        );
    }

    submit(e) {
        e.preventDefault();
        const code = this.refs.code.value.replace(/\s/g, '');
        if (!code || code.length === 0) {
            this.setState({error: Utils.localizeMessage('mfa.setup.codeError', 'Please enter the code from Google Authenticator.')});
            return;
        }

        this.setState({error: null});

        activateMfa(
            code,
            () => {
                browserHistory.push('/mfa/confirm');
            },
            (err) => {
                if (err.id === 'ent.mfa.activate.authenticate.app_error') {
                    this.setState({error: Utils.localizeMessage('mfa.setup.badCode', 'Invalid code. If this issue persists, contact your System Administrator.')});
                    return;
                }
                this.setState({error: err.message});
            }
        );
    }

    render() {
        let formClass = 'form-group';
        let errorContent;
        if (this.state.error) {
            errorContent = <div className='form-group has-error'><label className='control-label'>{this.state.error}</label></div>;
            formClass += ' has-error';
        }

        let mfaRequired;
        if (global.window.mm_config.EnforceMultifactorAuthentication === 'true') {
            mfaRequired = (
                <p>
                    <FormattedHTMLMessage
                        id='mfa.setup.required'
                        defaultMessage='<strong>Multi-factor authentication is required on {siteName}.</strong>'
                        values={{
                            siteName: global.window.mm_config.SiteName
                        }}
                    />
                </p>
            );
        }

        return (
            <div>
                <form
                    onSubmit={this.submit}
                    className={formClass}
                >
                    {mfaRequired}
                    <p>
                        <FormattedHTMLMessage
                            id='mfa.setup.step1'
                            defaultMessage="<strong>Step 1: </strong>On your phone, download Google Authenticator from <a target='_blank' href='https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8'>iTunes</a> or <a target='_blank' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en'>Google Play</a>"
                        />
                    </p>
                    <p>
                        <FormattedHTMLMessage
                            id='mfa.setup.step2'
                            defaultMessage='<strong>Step 2: </strong>Use Google Authenticator to scan this QR code, or manually type in the secret key'
                        />
                    </p>
                    <div className='form-group'>
                        <div className='col-sm-12'>
                            <img
                                style={{maxHeight: 170}}
                                src={'data:image/png;base64,' + this.state.qrCode}
                            />
                        </div>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <p className='col-sm-12'>
                            <FormattedMessage
                                id='mfa.setup.secret'
                                defaultMessage='Secret: {secret}'
                                values={{
                                    secret: this.state.secret
                                }}
                            />
                        </p>
                    </div>
                    <p>
                        <FormattedHTMLMessage
                            id='mfa.setup.step3'
                            defaultMessage='<strong>Step 3: </strong>Enter the code generated by Google Authenticator'
                        />
                    </p>
                    <p>
                        <input
                            ref='code'
                            className='form-control'
                            placeholder={Utils.localizeMessage('mfa.setup.code', 'MFA Code')}
                            autoFocus={true}
                        />
                    </p>
                    {errorContent}
                    <button
                        type='submit'
                        className='btn btn-primary'
                    >
                        <FormattedMessage
                            id='mfa.setup.save'
                            defaultMessage='Save'
                        />
                    </button>
                </form>
            </div>
        );
    }
}

Setup.defaultProps = {
};
Setup.propTypes = {
};
