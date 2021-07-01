import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { black, grey, grey2, white } from '../../ui/common/colors';
import { Grid, GridCell } from '../../ui/grid';
import { H3, H4 } from '../../ui/typography';
import styles from '../../styles/screens/ImportScreen/ImportScreen'
import { Input } from '../../ui/input';
import { APP_URL } from '../../setup/config/env'
import Card from '../../ui/card/Card';
import Modal from '../../ui/modal/Modal';
import Button from '../../ui/button';
import Icon from '../../ui/icon';

import { messageShow, messageHide } from '../common/api/actions'
import { importWallet } from './api/actions'
import { withRouter } from 'react-router-dom';
import WalletCheck from '../auth/WalletCheck';

export class ImportWallet extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
        privateKey: '',
        isModal: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallet.error) {
      this.props.messageShow(nextProps.wallet.error);
    } else {
      this.props.messageHide()
    }
  }

  onSecretInputChanged = (event) => {
    let privateKey = event.target.value;

    this.setState({
      privateKey
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.messageShow('Importing wallet, please wait...')

    this.props.importWallet(this.state.privateKey)
      .then(response => {
        if(this.props.wallet.error && this.props.user.error.length > 0) {
          this.props.messageShow(this.props.wallet.error)

          window.setTimeout(() => {
            this.props.messageHide()
          }, 5000)
        } else {
          this.props.messageHide()
        }
      }).catch(err => {
        this.props.messageShow(this.props.wallet.error)

        window.setTimeout(() => {
          this.props.messageHide()
        }, 5000)
      })
  }

  onModalClose = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  renderModalChildren = () => {
    return (
      <div>
            <H4 style={{
            fontWeight: '700',
            marginBottom: '30px',
            color: black,
            fontSize: '20px',
            lineHeight: '1.4'
            }}>Please enter Private Key</H4>

            <form onSubmit={this.onSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(137px,1fr))',
                gridColumnGap: '20px',
                columnGap: '20px',
                gridRowGap: '20px',
                rowGap: '20px',
                marginBottom: '35px'
              }}>


                <Input 
                fullWidth={true} 
                name="privatekey"
                placeholder='Enter Private Key'
                type="text"
                onChange={this.onSecretInputChanged}
                value={this.state.privateKey}
                style={{
                  borderRadius: '10px',
                  display: 'flex',
                  backgroundColor: '#f9f9f9',
                  padding: '5px 10px',
                  alignItems: 'center',
                  height: '3em',
                  padding: '15px 10px',
                  fontWeight: '400',
                  border: 'none',
                  outline: 'none',
                  opacity: 1,
                  width: '100%',
                  paddingLeft: '15px',
                  fontSize: '15px',
                  color: '#969696',
                }}
                />

              </div>

              <div>
                <Button type="submit" theme="primary" disabled={this.props.wallet.isLoading}>
                  Import Wallet <Icon size={1.2} style={{ color: white }}>navigate_next</Icon>
                </Button>
              </div>
            </form>
          </div>
    )
  }

  render() {
    const { isLoading, details, error } = this.props.wallet

    return (
      <div>
        <Helmet>
          <title>Import Wallet</title>
        </Helmet>

        {/* Top title bar */}
        <Grid style={{ backgroundColor: grey }}>
          <GridCell style={{ padding: '2em', textAlign: 'center' }}>
            <H3 font="secondary">Import Wallet</H3>

            <p style={{ marginTop: '1em', color: grey2 }}>Import a new wallet with private key</p>
          </GridCell>
        </Grid>

        <Grid>
          <GridCell style={styles.content} >
            <Card style={styles.importItem} className="disabled">
              <div>
                <img src={`${APP_URL}/images/wallets/mnemonic.png`} style={{ maxWidth: '100%', marginBottom: '20px' }}/>
              </div>
              <div style={{ padding: '1em 1.2em' }}>
                <H4 style={styles.importItemTitle}>Mnemonic Phrase</H4>

                <p style={{ color: grey2, marginTop: '1em', fontSize: '15px', fontWeight: '500' }}>Rewrite Mnemonic phrase to access the wallet</p>
              </div>
            </Card>

            <Card style={styles.importItem} onClick={() => {this.setState({isModal: true})}} >
              <div>
                <img src={`${APP_URL}/images/wallets/private_key.png`} style={{ maxWidth: '100%', marginBottom: '20px' }}/>
              </div>
              <div style={{ padding: '1em 1.2em' }}>
                <H4 style={styles.importItemTitle}>Private Key</H4>

                <p style={{ color: grey2, marginTop: '1em' }}>Provide private key to access the wallet</p>
              </div>
            </Card>

            <Modal 
              visible={this.state.isModal} 
              children={this.renderModalChildren()} 
              title="Import by Private Key"
              onModalClose={this.onModalClose}/>
          </GridCell>
        </Grid>

        <WalletCheck />
      </div>
    )
  }
}

ImportWallet.propTypes = {
  wallet: PropTypes.object.isRequired,
  importWallet: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired
}

function walletState(state) {
  return {
    wallet: state.wallet
  }
}

export default connect(walletState, { importWallet, messageShow, messageHide })(withRouter(ImportWallet))