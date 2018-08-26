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
                        <a href="/"><img src="images/logo.png" />DNAvatar</a>
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
            preview_url: '',
            showModal: false
        }

        this.showInfoModal = this.showInfoModal.bind(this);
        this.hideInfoModal = this.hideInfoModal.bind(this);
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
    showInfoModal() {
        this.setState({
            showModal: true
        });
    }
    hideInfoModal() {
        this.setState({
            showModal: false
        });
    }
    render() {
        return (
            <Panel>
                <Panel.Body>
                    <Image width="300" src={this.state.preview_url} />
                    <hr />
                    <div className="pull-right">
                        <a href="#" onClick={() => this.showInfoModal()}>How did I get this image?</a>
                    </div>
                    <InfoModal show={this.state.showModal} showInfoModal={this.showInfoModal} hideInfoModal={this.hideInfoModal} trait_summaries={this.props.trait_summaries} />
                </Panel.Body>
            </Panel>
        )
    }
}

class InfoModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.hideInfoModal();
    }

    handleShow() {
        this.props.showInfoModal();
    }

  render() {
    let self = this;
    const formatted_trait_summaries = Object.keys(this.props.trait_summaries).map((trait, index) => {
        return (
            <li key={index}>
                <strong>{changeCase.titleCase(trait)}</strong>:
                &nbsp;
                {self.props.trait_summaries[trait]}
            </li>
        );
    });
    return (
      <div>
        <Modal show={this.props.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>How did I get this image?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {"Your bitmoji avatar is based on the genome data you uploaded at "}<a href='https://genomelink.io/'>genomelink.io</a>{".  DNA data from your genome can be used to predict your physical traits, such as beard thickness, hair color, skin tone, etc.  Below, you'll find a complete list of the data extracted from your genome and used in this bitmoji."}
            </p>
            <ul>
                {formatted_trait_summaries}
            </ul>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overrides: {
                /*
                beard_tone: 'color',
                blush_tone: 'color',
                brow_tone: 'color',
                eyeshadow_tone: 'color',
                hair_tone: 'color',
                lipstick_tone: 'color',
                pupil_tone: 'color',
                skin_tone: 'color'
                */
            }
        }
    }
    render() {
        
        const traits_list = this.props.all_traits.map((trait, index) => {
            return index % 4 === 0 ? this.props.all_traits.slice(index, index + 4) : null;
        }).filter(x => x != null);
        const traits_grid = traits_list.map((result, index) => {
            return (
                <Row key={index} className="trait-row">
                    {result.map((trait, i) => 
                        <Col md={3}>
                            <TraitSelector 
                                key={i}
                                trait_name={trait.key}

                                incrementSetting={this.props.incrementSetting}
                                decrementSetting={this.props.decrementSetting} />
                        </Col>
                    )}
                </Row>
            );
        })
        return (
            
            <Panel>
                <Panel.Body>
                    <Grid>
                        {traits_grid}
                    </Grid>
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
            <div>
                {changeCase.titleCase(this.props.trait_name)}
                {selector}
            </div>
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

class Footer extends Component {
    render() {
        return (
            <div>
                <hr />
                &copy; 2018 | Special thanks to <a href="https://genomelink.io/">genomelink.io</a>, <a href="https://www.bitmoji.com/">Bitmoji</a>, <a href="https://github.com/matthewnau/libmoji">libmoji</a>, and <a href="http://www.freepik.com">Freepik</a> for the tools I needed to make this idea a reality.
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
            trait_summaries: [],

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
        let trait_summaries = [];
        for (let trait of all_traits) {
            trait_settings[trait.key] = 0,
            all_traits_hash[trait.key] = trait.options
        }
        this.setState({
            trait_settings: trait_settings,
            all_traits: all_traits,
            all_traits_hash: all_traits_hash,
            trait_summaries: trait_summaries
        });

        //Show modal
        this.checkAuth()
            .then(function(res) {

                if (!res.is_authed && !getParameterByName('code')) {
                    self.setState({ authorize_url: res.authorize_url, showModal: true })    
                } else if (getParameterByName('code')) {
                    let code = getParameterByName('code');
                    self.checkCode(code)
                        .then(function(res) {
                            if (res.is_authed) {
                                
                                let trait_settings = self.state.trait_settings;
                                for (let trait in res.results) {
                                    trait_settings[trait] = res.results[trait].score;
                                    trait_summaries[trait] = res.results[trait].text;
                                }
                                self.setState({
                                    showModal: false,
                                    trait_settings: trait_settings,
                                    trait_summaries: trait_summaries
                                });
                            }
                        });
                } else {
                    let trait_settings = self.state.trait_settings;
                    for (let trait in res.results) {
                        trait_settings[trait] = res.results[trait].score;
                        trait_summaries[trait] = res.results[trait].text;
                    }
                    self.setState({
                        showModal: false,
                        trait_settings: trait_settings,
                        trait_summaries: trait_summaries
                    });
                }
                
            })
            .catch(err => console.log(err));
    }
    incrementSetting(trait) {
        let new_trait_settings = this.state.trait_settings;
        if (new_trait_settings[trait] < this.state.all_traits_hash[trait].length - 1) {
            new_trait_settings[trait] += 1;
        } else {
            alert('There are no more options in that direction.');
        }
        this.setState({ trait_settings: new_trait_settings });
    }
    decrementSetting(trait) {
        let new_trait_settings = this.state.trait_settings;
        if (new_trait_settings[trait] > 0) {
            new_trait_settings[trait] -= 1;    
        } else {
            alert('There are no more options in that direction.');
        }
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
                                <PreviewPanel gender={this.state.gender} style={this.state.style} trait_settings={this.state.trait_settings} all_traits_hash={this.state.all_traits_hash} trait_summaries={this.state.trait_summaries} />
                            </Col>
                            <Col md={8}>
                                <ControlPanel gender={this.state.gender} style={this.state.style} all_traits={this.state.all_traits} decrementSetting={this.decrementSetting} incrementSetting={this.incrementSetting} />
                                <Footer />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default App;
