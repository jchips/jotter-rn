import React, { useState, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { QueryClient } from '@tanstack/react-query'
import Constants from 'expo-constants'
import { Buffer } from 'buffer'
import { setConfigs } from '../reducers/configReducer'
import { storeCurrUser, removeCurrUser } from '../util/persist'
import axios from 'axios'
import api from '../util/api'

const API_URL = Constants.expoConfig?.extra?.API_URL
const AuthContext = React.createContext()

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 min
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
  },
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)
  const dispatch = useDispatch()

  // Set up bearer auth for user
  useEffect(() => {
    api.setTokenGetter(() => token)
  }, [token, user])

  /**
   * Logs user in
   * Add token to localStorage
   * Creates a cookie to preserve user info until token expires
   * Sets/stores the user's configurations
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Object} - Response object from server
   */
  const login = async (email, password) => {
    const encodedLogin = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    )
    let res
    try {
      queryClient.clear()
      axios.defaults.headers.common['Authorization'] = `Basic ${encodedLogin}`
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      let requestUrl = `${API_URL}/jotter/login`
      res = await axios.post(requestUrl, { withCredentials: true })
      setUser(res.data.user)
      setToken(res.data.token)
      storeCurrUser(res.data.user)
      setIsLoggedIn(true)
      api.setTokenGetter(() => res.data.token)
      let uConfigs = await api.getConfigs()
      dispatch(setConfigs(uConfigs.data))
    } catch (err) {
      console.error(err)
      res = err
    }
    return res
  }

  // Logs user out
  // Clears cookie
  // Clears token from local storage
  const logout = async () => {
    try {
      queryClient.clear()
      let requestUrl = `${API_URL}/jotter/logout`
      await axios.post(requestUrl, {}, { withCredentials: true })
      setUser(null)
      setIsLoggedIn(false)
      setToken(null)
      removeCurrUser()
      delete axios.defaults.headers.common['Authorization']
    } catch (err) {
      console.error('Failed to log user out:', err)
    }
  }

  const value = {
    user,
    setUser,
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
