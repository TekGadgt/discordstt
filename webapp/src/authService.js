import createAuth0Client from "@auth0/auth0-spa-js"
import { user, isAuthenticated, popupOpen } from "./store"

async function createClient() {
  let client = await createAuth0Client({
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENTID
  })
  return client
}

async function loginWithPopup(client, options) {
  popupOpen.set(true)
  try {
    await client.loginWithPopup(options)
    user.set(await client.getUser())
    isAuthenticated.set(true)
  } catch (err) {
    console.error(err)
  } finally {
    popupOpen.set(false)
  }
}

function logout(client) {
  return client.logout()
}

const auth = {
  createClient,
  loginWithPopup,
  logout
}

export default auth