import { createAuth0Client } from "@auth0/auth0-spa-js"
import { user, isAuthenticated, popupOpen } from "./store"
import config from "./auth_config"

async function createClient() {
  let client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: "http://localhost:5173"
    }
  })
  return client
}

async function loginWithPopup(client) {
  popupOpen.set(true)
  try {
    await client.loginWithPopup()
    user.set(await client.getUser())
    isAuthenticated.set(true)
  } catch (err) {
    console.error(err)
  } finally {
    popupOpen.set(false)
  }
}

async function loginWithRedirect(client) {
  try {
    await client.loginWithRedirect()
    user.set(await client.getUser())
    isAuthenticated.set(true)
  } catch (err) {
    console.error(err)
  }
}

function logout(client) {
  return client.logout()
}

const auth = {
  createClient,
  loginWithPopup,
  loginWithRedirect,
  logout
}

export default auth