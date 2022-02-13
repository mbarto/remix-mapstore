import PropTypes from 'prop-types';
import React from 'react';
import { Col, Grid, Nav, NavItem, Row } from 'react-bootstrap';
import Message from '../MapStore2/web/client/components/I18N/Message';
import ToolsContainer from './ToolsContainer';

const DefaultTitle = ({ item = {}, index }) => <span><Message msgId={item.title || `Tab ${index}` } msgParams={{ count: (item.total ?? "-") + "" }}/></span>;

class ContentTabs extends React.Component {
    static propTypes = {
        selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        className: PropTypes.string,
        style: PropTypes.object,
        items: PropTypes.array,
        hiddenTabs: PropTypes.object,
        id: PropTypes.string,
        onSelect: PropTypes.func

    };
    static defaultProps = {
        selected: 0,
        items: [],
        hiddenTabs: {},
        className: "content-tabs",
        style: {},
        id: "content-tabs",
        onSelect: () => {}
    };
    render() {
        return (
            <Grid id={this.props.id}>
                <Row>
                    <Col>
                        <h2><Message msgId="resources.contents.title" /></h2>
                        <ToolsContainer
                            id="content-tabs-container"
                            style={this.props.style}
                            className={this.props.className}
                            toolCfg={{title: ""}}
                            container={(props) => <div {...props}>
                                <div style={{marginTop: "10px"}}>
                                    <Nav bsStyle="tabs" activeKey="1" onSelect={k => this.props.onSelect(k)}>
                                        {[...this.props.items].filter(item => !this.props.hiddenTabs[item.name])
                                            .sort((a, b) => a.position - b.position).map(
                                                ({ TitleComponent = DefaultTitle, ...item }, idx) =>
                                                    (<NavItem
                                                        key={item.key || idx}
                                                        active={(item.key || idx) === this.props.selected}
                                                        eventKey={item.key || idx} >
                                                        <TitleComponent index={idx} item={item} />
                                                    </NavItem>)
                                            )}
                                    </Nav>
                                </div>
                                {props.children}
                            </div>}
                            toolStyle="primary"
                            stateSelector="contentTabs"
                            activeStyle="default"
                            tools={[...this.props.items].sort((a, b) => a.position - b.position).filter( ({key}, i) => (key || i) === this.props.selected)}
                            panels={[]}
                        /></Col>
                </Row>
            </Grid>
        );
    }
    handleSelect = () => {}
}

export default ContentTabs