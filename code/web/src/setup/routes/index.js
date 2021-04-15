// App Imports
import { APP_URL_API } from '../config/env'
import admin from './admin'
import home from './home'
import user from './user'
import product from './product'
import crate from './crate'
import wallet from './wallet'

// Combined routes
export const routes = Object.assign(admin, home, user, product, crate, wallet)

// API Routes
export const routeApi = APP_URL_API

// Image
export const routeImage = APP_URL_API
