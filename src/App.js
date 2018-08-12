import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Panel, Grid, Row, Col} from 'react-bootstrap';
import logo from './logo.svg';
import libmoji from 'libmoji';

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
    render() {
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Preview</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Image width="300" src="https://preview.bitmoji.com/avatar-builder-v3/preview/body?scale=3&gender=2&style=1&rotation=0&brow=109&cheek_details=241&ear=246&earring=511&eye=147&eyelash=-1&eye_details=634&face_lines=250&glasses=561&hair=321&hat=27&jaw=285&mouth=196&nose=625&pupil=226&blush_tone=-1&brow_tone=3415562&eyeshadow_tone=12098752&hair_tone=8637550&lipstick_tone=2565927&pupil_tone=6064564&skin_tone=12434877&body=2&breast=1&face_proportion=1&outfit=889202" />
                </Panel.Body>
            </Panel>
        )
    }
}

class ControlPanel extends Component {
    render() {
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Options</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Image width="500" src="https://preview.bitmoji.com/avatar-builder-v3/preview/body?scale=3&gender=2&style=1&rotation=0&brow=109&cheek_details=241&ear=246&earring=511&eye=147&eyelash=-1&eye_details=634&face_lines=250&glasses=561&hair=321&hat=27&jaw=285&mouth=196&nose=625&pupil=226&blush_tone=-1&brow_tone=3415562&eyeshadow_tone=12098752&hair_tone=8637550&lipstick_tone=2565927&pupil_tone=6064564&skin_tone=12434877&body=2&breast=1&face_proportion=1&outfit=889202" />
                </Panel.Body>
            </Panel>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div>
                <NavigationBar />
                <div className="container">
                    <Grid>
                        <Row>
                            <Col md={4}>
                                <PreviewPanel />
                            </Col>
                            <Col md={8}>
                                <ControlPanel />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default App;
