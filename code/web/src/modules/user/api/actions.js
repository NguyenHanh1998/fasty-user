// Imports
import axios from 'axios'
import { query, mutation } from 'gql-query-builder'
import cookie from 'js-cookie'

// App Imports
import { routeApi } from '../../../setup/routes'
// Actions Types
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'

import { SET_WALLET } from '../../wallets/api/actions'

// Actions

// Set a user after login or using localStorage token
export function setUser(token, user) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  return { type: SET_USER, user }
}

// Login a user using credentials
export function login(userCredentials, isLoading = true) {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      isLoading
    })

    return axios({
      method: 'post',
      url: `${routeApi}/login`,
      data: {
        email: userCredentials.email,
        password: userCredentials.password,
        isAdmin: false
      }
    })
      .then(response => {
        let error = ''

        if (response.data.errors && response.data.errors.length > 0) {
          error = response.data.errors[0].message
        } else if (response.data.data.token !== '') {
          const token = response.data.data.token
          const user = response.data.data.user
          const address = response.data.data.address

          dispatch(setUser(token, user))

          const wallet = { ethAddress: address }
          dispatch({
            type: SET_WALLET,
            wallet
          })

          setWalletLocalStorageAndCookie(wallet)

          loginSetUserLocalStorageAndCookie(token, user)
        }
        console.log(';;;;',error)

        dispatch({
          type: LOGIN_RESPONSE,
          error
        })
      })
      .catch(error => {
        if (error.response) {
          dispatch({
            type: LOGIN_RESPONSE,
            error: error.response.data.meta.message
          })
        } else {
          dispatch({
            type: LOGIN_RESPONSE,
            error: 'Please try again'
          })
        }
      })
  }
}

// Set user token and info in localStorage and cookie
export function loginSetUserLocalStorageAndCookie(token, user) {
  // Update token
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(user))

  // Set cookie for SSR
  cookie.set('auth', { token, user }, { path: '/' })
}

export function setWalletLocalStorageAndCookie(wallet) {
  window.localStorage.setItem('wallet', wallet)
  cookie.set('wallet',JSON.stringify(wallet), { path: '/' })
}

// Register a user
export function register(userDetails) {
  return dispatch => {
    return axios({
      method: 'post',
      url: `${routeApi}/register`,
      data: {
        email: userDetails.email,
        username: userDetails.name,
        password: userDetails.password
      }
    })
  }
}

// Log out user and remove token from localStorage
export function logout() {
  return dispatch => {
    logoutUnsetUserLocalStorageAndCookie()

    dispatch({
      type: LOGOUT
    })
  }
}

// Unset user token and info in localStorage and cookie
export function logoutUnsetUserLocalStorageAndCookie() {
  // Remove token
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')

  // Remove cookie
  cookie.remove('auth')
}

// Get user gender
export function getGenders() {
  return dispatch => {
    return axios.post(routeApi, query({
      operation: 'userGenders',
      fields: ['id', 'name']
    }))
  }
}
