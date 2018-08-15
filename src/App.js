import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Panel, Grid, Row, Col, Glyphicon} from 'react-bootstrap';
import logo from './logo.svg';
import libmoji from 'libmoji';
import changeCase from 'change-case'; 

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class NavigationBar extends Component {
    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home">React-Bootstrap</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">
                        Link
                    </NavItem>
                    <NavItem eventKey={2} href="#">
                        Link
                    </NavItem>
                    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Action</MenuItem>
                        <MenuItem eventKey={3.2}>Another action</MenuItem>
                        <MenuItem eventKey={3.3}>Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={3.4}>Separated link</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
}

class PreviewPanel extends Component {
    constructor(props) {
        super(props);
        let outfit = libmoji.randOutfit(libmoji.getOutfits(libmoji.randBrand(libmoji.getBrands(this.props.gender[0]))));
        this.state = {
            outfit: outfit,
            preview_url: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        
        let traits = [];
        for (let trait_name in nextProps.trait_settings) {
            traits.push([trait_name, nextProps.all_traits_hash[trait_name][nextProps.trait_settings[trait_name]].value]);
        }

        this.setState({
            preview_url: libmoji.buildPreviewUrl("body", 3, nextProps.gender[1], nextProps.style[1], 0, traits, this.state.outfit)
        });

    }
    render() {
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Preview</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Image width="300" src={this.state.preview_url} />
                </Panel.Body>
            </Panel>
        )
    }
}

class ControlPanel extends Component {
    render() {
        const traits_list = this.props.all_traits.map((trait, index) => {
            return (
                <li key={index}>
                    {changeCase.titleCase(trait.key)}
                    <button onClick={() => this.props.decrementSetting(trait.key)}><Glyphicon glyph="chevron-left" /></button>
                    <button onClick={() => this.props.incrementSetting(trait.key)}><Glyphicon glyph="chevron-right" /></button>
                </li>
            );
        });
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Options</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <ul>
                        {traits_list}
                    </ul>
                </Panel.Body>
            </Panel>
        )
    }
}

class App extends Component {
    constructor(props) {
        super()
        this.state = {
            gender: libmoji.genders[0],
            style: libmoji.styles[1],
            all_traits: [],
            all_traits_hash: [],
            trait_settings: []
        };
        this.incrementSetting = this.incrementSetting.bind(this);
        this.decrementSetting = this.decrementSetting.bind(this);
    }
    componentDidMount() {
        let all_traits = libmoji.getTraits(this.state.gender[0], this.state.style[0]);
        let trait_settings = [];
        let all_traits_hash = [];
        for (let trait of all_traits) {
            trait_settings[trait.key] = 0,
            all_traits_hash[trait.key] = trait.options
        }
        this.setState({
            trait_settings: trait_settings,
            all_traits: all_traits,
            all_traits_hash: all_traits_hash
        });
    }
    incrementSetting(trait) {
        let new_trait_settings = this.state.trait_settings;
        new_trait_settings[trait] += 1;
        this.setState({ trait_settings: new_trait_settings });
    }
    decrementSetting(trait) {
        let new_trait_settings = this.state.trait_settings;
        new_trait_settings[trait] -= 1;
        this.setState({ trait_settings: new_trait_settings });
    }
    render() {
        return (
            <div>
                <NavigationBar />
                <div className="container">
                    <Grid>
                        <Row>
                            <Col md={4}>
                                <PreviewPanel gender={this.state.gender} style={this.state.style} trait_settings={this.state.trait_settings} all_traits_hash={this.state.all_traits_hash} />
                            </Col>
                            <Col md={8}>
                                <ControlPanel gender={this.state.gender} style={this.state.style} all_traits={this.state.all_traits} decrementSetting={this.decrementSetting} incrementSetting={this.incrementSetting} />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default App;
