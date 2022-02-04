/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import {Grid, Row, Col} from "react-bootstrap";
import ResourceCard from './ResourceCard';
/* import Spinner from 'react-spinkit';
import DetailsSheet from './modals/fragments/DetailsSheet';*/

/*
const renderMetadataModal = ({ Component, edit, resource, setEdit, errors, setErrors, onSaveSuccess, user,
    nameFieldFilter, enableDetails, category, onResourceLoad }) => {
    if (Component) {
        let MetadataModal = Component;
        return (<MetadataModal
            key="metadataModal"
            user={user}
            setEdit={setEdit}
            show={edit}
            setErrors={setErrors}
            errors={errors}
            onSaveSuccess={onSaveSuccess}
            nameFieldFilter={nameFieldFilter}
            resource={resource}
            category={category}
            enableDetails={enableDetails}
            onResourceLoad={onResourceLoad}/>);
    }
    return null;
};
*/

export default ({
    fluid = true,
    className = "",
    colProps,
    loading,
    category = 'MAP',
    resources = [],
    resource,
    detailsText,
    id,
    style,
    bottom,
    title,
    metadataModal,
    viewerUrl,
    edit,
    errors,
    user,
    editDataEnabled,
    shareToolEnabled,
    cardTooltips,
    showDetailsSheet,
    onEdit = () => {},
    onEditData = () => {},
    setEdit = () => {},
    setErrors = () => {},
    onSaveSuccess = () => {},
    onDelete = () => {},
    onShare = () => {},
    onUpdateAttribute = () => {},
    onShowDetailsSheet = () => {},
    onHideDetailsSheet = () => {},
    onResourceLoad = () => {},
    nameFieldFilter = () => {}
}) => {
    return (
        <Grid id={id} fluid={fluid} className={'ms-grid-container ' + className} style={style}>
            {title && <Row>
                {title}
            </Row>}
            <Row className="ms-grid">
                {resources.map(
                        res => (<Col key={res.id} {...colProps}>
                            <ResourceCard
                                viewerUrl={viewerUrl}
                                resource={res}
                                editDataEnabled={editDataEnabled}
                                shareToolEnabled={shareToolEnabled}
                                onEdit={onEdit}
                                onEditData={onEditData}
                                onDelete={onDelete}
                                onShare={onShare}
                                tooltips={cardTooltips}
                                onShowDetailsSheet={onShowDetailsSheet}
                                onUpdateAttribute={onUpdateAttribute} />
                        </Col>))
                }
            </Row>
            {bottom}
        </Grid>
    );
};
