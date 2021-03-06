/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root dir
 ectory of this source tree.
 */

import React from 'react';

import ConfigUtils from '../../utils/ConfigUtils';

const withContainer = (Component) => {
    return (props) => {
        return <Component {...props} container={(typeof document !== "undefined") ? (document.querySelector('.' + (ConfigUtils.getConfigProp('themePrefix') || 'ms2') + " > div") || document.body) : null}/>;
    };
};

export default withContainer;
