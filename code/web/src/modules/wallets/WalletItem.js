import React, { PureComponent } from 'react';
import Card from '../../ui/card/Card';
import { black, grey2, white } from '../../ui/common/colors';
import { H4 } from '../../ui/typography';

export class WalletItem extends PureComponent {
  render() {
    return (
      <Card style={{ width: '25em', margin: '2.5em auto', backgroundColor: white }}>
        <img style={{ width: '100%' }}/>

        <div style={{ padding: '1em 1.2em' }}>
          <H4 font="secondary" style={{ color: black }}>Wallet Name</H4>

          <p style={{ color: grey2, marginTop: '1em' }}>Price</p>
        </div>
      </Card>
    )
  }
}

export default WalletItem