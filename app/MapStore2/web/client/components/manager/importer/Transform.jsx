
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Button from '../../misc/Button';
import PropTypes from 'prop-types';
import { Panel, Glyphicon, Tooltip } from 'react-bootstrap';
import OverlayTrigger from '../../misc/OverlayTrigger';
import { Message } from '../../I18N/I18N';
import transforms from './transforms';

class Transform extends React.Component {
    static propTypes = {
        transform: PropTypes.object,
        editTransform: PropTypes.func,
        updateTransform: PropTypes.func
    };

    static defaultProps = {
        transform: {},
        editTransform: () => {},
        updateTransform: () => {}
    };

    renderTransformOptions = () => {
        if (transforms[this.props.transform.type]) {
            let TransformEl = transforms[this.props.transform.type];
            return (<TransformEl
                ref="transformForm"
                transform={this.props.transform}
                editTransform={this.props.editTransform}
                updateTransform={this.props.updateTransform} />);
        }
        return null;
    };

    renderSave = () => {
        return <Button bsStyle="primary" disabled={!this.isModified() || !this.isValid()} onClick={() => this.props.updateTransform(this.props.transform)} ><Message msgId="save" /></Button>;
    };

    renderHelpLink = () => {
        const tooltip =
          <Tooltip id="tooltip">See More information about this transformation</Tooltip>;
        if (transforms.help && transforms.help[this.props.transform.type]) {
            return <OverlayTrigger placement="left" overlay={tooltip}><a style={{"float": "right"}} href={transforms.help[this.props.transform.type]} target="_blank"><Glyphicon glyph="question-sign" /></a></OverlayTrigger>;
        }
        return null;
    };

    renderHeader = () => {
        return (<span>
            <Message msgId="importer.transform.panelTitle" msgParams={{id: this.props.transform.id}} />
            {this.renderHelpLink()}</span>);
    };

    render() {
        return (
            <Panel header={this.renderHeader()} >
                <h2>{this.props.transform.type}</h2>
                {this.renderTransformOptions()}
                {this.renderSave()}
            </Panel>
        );
    }

    isModified = () => {
        return this.props.transform && this.props.transform.status === "modified";
    };

    isValid = () => {
        return this.refs.transformForm && this.refs.transformForm.isValid(this.props.transform);
    };
}

export default Transform;
