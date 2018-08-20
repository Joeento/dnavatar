import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Panel, Grid, Row, Col, Glyphicon} from 'react-bootstrap';
import { Button, Modal} from 'react-bootstrap';
import logo from './logo.svg';
import libmoji from 'libmoji';
import changeCase from 'change-case';
import reactCSS from 'reactcss'
import { BlockPicker } from 'react-color';
import {getParameterByName} from './utilities'


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap-social/bootstrap-social.css';
import './App.css';
class NavigationBar extends Component {
    render() {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home"><img src="images/logo.png" />DNAvatar</a>
                    </Navbar.Brand>
                </Navbar.Header>
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
                <Panel.Body>
                    <Image width="300" src={this.state.preview_url} />
                </Panel.Body>
            </Panel>
        )
    }
}

class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overrides: {
                beard_tone: 'color',
                blush_tone: 'color',
                brow_tone: 'color',
                eyeshadow_tone: 'color',
                hair_tone: 'color',
                lipstick_tone: 'color',
                pupil_tone: 'color',
                skin_tone: 'color'
            }
        }
    }
    render() {
        const traits_list = this.props.all_traits.map((trait, index) => {
            let type = this.state.overrides.hasOwnProperty(trait.key) ? this.state.overrides[trait.key] : 'arrows';
            return (
                <TraitSelector 
                    key={index}
                    trait_name={trait.key}
                    type={type}
                    incrementSetting={this.props.incrementSetting}
                    decrementSetting={this.props.decrementSetting} />
            );
        });
        return (
            <Panel>
                <Panel.Body>
                    <ul>
                        {traits_list}
                    </ul>
                </Panel.Body>
            </Panel>
        )
    }
}

class TraitSelector extends Component {
    render() {
        let selector = null;
        switch(this.props.type) {
            case 'color':
                selector = (
                    <ColorSelector />
                );
                break;
            default:
                selector = (
                    <div>
                        <button onClick={() => this.props.decrementSetting(this.props.trait_name)}><Glyphicon glyph="chevron-left" /></button>
                        <button onClick={() => this.props.incrementSetting(this.props.trait_name)}><Glyphicon glyph="chevron-right" /></button>
                    </div>
                );
                break;
        }
        return (
            <li>
                {changeCase.titleCase(this.props.trait_name)}
                {selector}
            </li>
        );
    }
}

class ColorSelector extends React.Component {
    state = {
        displayColorPicker: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
    };

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    width: '160px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <BlockPicker color={ this.state.color } onChange={ this.handleChange } />
            </div> : null }

      </div>
    )
  }
}
class AuthModal extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div>
                <Modal show={this.props.show}>
                    <Modal.Header>
                        <Modal.Title>Welcome!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Thanks for visiting DNAvatar</h4>
                        <p>
                            {"We're here to make you an avatar based entirely on what your DNA says you look like! Before we being though, we'll need you to sign into Genomelink so we can get a sense of your physical makeup."}
                        </p>
                        <p>
                            <a className="btn btn-block btn-social btn-openid" href={this.props.authorize_url}>
                                <span className="glyphicon glyphicon-log-in"></span>
                                    Sign in with Genomelink
                            </a>
                        </p>
                    </Modal.Body>
                </Modal>
            </div>
        );
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
            trait_settings: [],

            authorize_url: '',
            showModal: true
        };
        this.incrementSetting = this.incrementSetting.bind(this);
        this.decrementSetting = this.decrementSetting.bind(this);
    }
    componentDidMount() {
        const self = this;
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

        //Show modal
        this.checkAuth()
            .then(function(res) {

                if (!res.is_authed && !getParameterByName('code')) {
                    console.log('1');
                    self.setState({ authorize_url: res.authorize_url, showModal: true })    
                } else if (getParameterByName('code')) {
                    console.log('2');
                    let code = getParameterByName('code');
                    self.checkCode(code)
                        .then(function(res) {
                            if (res.is_authed) {
                                self.setState({showModal: false});
                            }
                            console.log('done');
                        });
                } else {
                    console.log('3');
                    self.setState({showModal: false});
                }
                
            })
            .catch(err => console.log(err));
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
    checkAuth = async () => {
        const response = await fetch('/api/auth');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };
    checkCode = async (code) => {
        const response = await fetch('/api/code?code=' + code);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };
    render() {
        return (
            <div className="app">
                <NavigationBar />
                <AuthModal show={this.state.showModal} authorize_url={this.state.authorize_url}  />
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
