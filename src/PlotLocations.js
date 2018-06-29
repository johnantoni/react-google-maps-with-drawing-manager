import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Badge, Row, Col, Card, Container, CardHeader, CardFooter, CardBody, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { goTo, getAccount, tNS } from './../../helpers';
import { getAllLocationsHelper } from './../../recordHelpers';
import RenderMapEditor from '../sharedComponents/RenderMapEditor';
import Spinner from '../sharedComponents/Spinner';
import GetLocation from '../sharedComponents/GetLocation';

let order = 'desc';

class PlotLocations extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      loadReady: false
    };
    this.getAllLocationsHelper = getAllLocationsHelper.bind(this);
    this.getAccount = getAccount.bind(this);
    this.goTo = goTo.bind(this)
  }

  async componentDidMount() {
    await this.getAccount();
    const markers = await this.getAllLocationsHelper()

    this.setState({
      markers: markers
    }, function() {
      this.setState({
        loadReady: true
      })
    })
  }

  handleBtnClick = () => {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table .handleSort('desc', 'name');
      order = 'desc';
    }
  }

  colFormatter = (cell, row) => {
    let url = `/locations/edit/${cell}`

    return (
      <Link to={url}>
        <i className="fas fa-pencil-alt" aria-hidden="true" title="Show"></i>
        &nbsp;
        {tNS("Edit")}
      </Link>
    )
  }

  goBack = (e) => {
    e.preventDefault();
    this.goTo("/locations/all")
  }

  render() {
    if (this.state.loadReady) {
      let markers = this.state.markers
      let center = markers[0]

      return (
        <div>
          <Container>

            <Row>
              <Col lg={9} className="banner">
                <h4>Map Editor</h4>
                <div className="ribbon-left"></div>
                <div className="ribbon-right"></div>
              </Col>
              <Col lg={3} className="right-align">
                <a onClick={this.goBack} className="close"><i className="fas fa-times"></i></a>
              </Col>
            </Row>

            <br/>

            <Row>
              <Col lg={12}>
                <RenderMapEditor
                  markers={markers}
                  center={center}
                  />
              </Col>
            </Row>

            <br/>

            <Row>
              <Col lg={12}>
                <BootstrapTable ref='table' version='4' data={ markers } pagination>
                  <TableHeaderColumn ref='title' dataField='title' dataSort={ true } filter={ { type: 'TextFilter', delay: 1000 } }>{ tNS("Title")}</TableHeaderColumn>
                  <TableHeaderColumn dataField='_id' isKey={true} width='30%' dataFormat={this.colFormatter}>Action</TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>

        </Container>
        </div>
      )
    } else {
      return (<Spinner/>)
    }
  }
};

export default translate()(PlotLocations);
