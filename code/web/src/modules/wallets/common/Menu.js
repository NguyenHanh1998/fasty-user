import React from 'react'

// UI Imports
import { Grid, GridCell } from '../../../ui/grid'
import { black, grey } from "../../../ui/common/colors"

// App Imports
import wallet from '../../../setup/routes/wallet'
import Menu from '../../common/header/Menu'
import MenuItem from '../../common/header/MenuItem'

const WalletMenu = () => (
  <Grid style={{ backgroundColor: grey }}>
    <GridCell style={{ padding: '2em', textAlign: 'center' }}>
      <Menu>
        <MenuItem to={wallet.walletList.path} type="fragment" style={{ color: black }}>My Wallet</MenuItem>

        <MenuItem to={wallet.history.path} type="fragment" style={{ color: black }}>Transaction History</MenuItem>
      </Menu>
    </GridCell>
  </Grid>
)

export default WalletMenu