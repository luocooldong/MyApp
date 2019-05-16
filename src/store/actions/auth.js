import AsyncStorage from '@react-native-community/async-storage'

import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes'
import { uiStartLoading, uiStopLoading } from './index'
// import startMainTabs from "../../screens/MainTabs/startMainTabs";
// import App from "../../../App";

const API_KEY = 'AIzaSyDnyPlvfolHaUIUNkeGTv-mSDogMUtlWZ8'

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading())
    let url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
      API_KEY
    if (authMode === 'signup') {
      url =
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
        API_KEY
    }

    // return fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     email: authData.email,
    //     password: authData.password,
    //     returnSecureToken: true
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(authData.email === 'test@test.com' && authData.password === '156123'){
          resolve(JSON.stringify({
            displayName: '',
            email: 'test@test.com',
            expiresIn: '3600',
            idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyZjBiNDZjYjc1OTBjNzRmNTNhYzdhOWUwY2IxYzAzMjRlY2RkNzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXdlc29tZS1wbGFjZXMtNGVkZWEiLCJhdWQiOiJhd2Vzb21lLXBsYWNlcy00ZWRlYSIsImF1dGhfdGltZSI6MTU1ODA5NTM0MCwidXNlcl9pZCI6IklMb0ZsRHo1Q3BaMEhaanZ2VklCR0RteWQ1MzMiLCJzdWIiOiJJTG9GbER6NUNwWjBIWmp2dlZJQkdEbXlkNTMzIiwiaWF0IjoxNTU4MDk1MzQwLCJleHAiOjE1NTgwOTg5NDAsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QHRlc3QuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.FVj9afi_j69XztbHoE8cYJ0LCPwsmQ6FGD1Ez0RdAgq2f97qDVt3dL829GwJF3gYQD4mxQymPCkM4gv4leCoWXch2nYXUUUcqQ0EF_aaV9s7MFjrlb9SFOr4SFgh4-kogvxlAyPoLcKgIw8URb37frECWymGcUsNnN9G-RxxUzQ2VVzZDkkEU3rx244vbJ3Pbk4hizsTK-LA7_dpd3UE2QWy84__gDn0W-XYe2AmYXpigIJp9AZecQ5wj0pxfPxEc20tk4OAAKfJ_jTwtb1QK7cAUwzcoEnJ2tDNr2OKfyyBVTy1TVwqEB-knkSYvrMxhSZaYIYzWXmhLyYnx8Fvjg',
            kind: 'identitytoolkit#VerifyPasswordResponse',
            localId: 'ILoFlDz5CpZ0HZjvvVIBGDmyd533',
            refreshToken: 'AEu4IL0d3h-R3Jcz29dnM5JNKdPEB6FlUU5XIXJ3MbjkTEB9D6dv7LylLb3-pL0Dd1_ErdwvU-wc8N0rpkNzN0kXcGIUN6rDtzZEXDVntozQ-N3RrVL-fFh8VXUSUthiEMHRM5LXbcskRKZEWYGQIHNULH6k9sa6hLuBTDDSjq1-iDh1UowEdBDWHXrnwBSD15WSHsj_iLs10Y-IT0IW2OlQP4InCJsejQ',
            registered: true
          }))
        }else{
          reject()
        }
      }, 1000)
    })
      .catch(err => {
        alert('Authentication failed, please try again!')
        dispatch(uiStopLoading())
      })
      // .then(res => {
      //   debugger
      //   return res.json()
      // })
      .then(res => JSON.parse(res))
      .then(parsedRes => {
        dispatch(uiStopLoading())
        if (!parsedRes.idToken) {
          alert('Authentication failed, please try again!')
        } else {
          dispatch(
            authStoreToken(
              parsedRes.idToken,
              parsedRes.expiresIn,
              parsedRes.refreshToken
            )
          )
          console.clear()
          console.log('🍕fuck the world')
          // alert('you have logined in')
          // startMainTabs();
        }
      })
  }
}

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date()
    const expiryDate = now.getTime() + expiresIn * 1000
    dispatch(authSetToken(token, expiryDate))
    AsyncStorage.setItem('ap:auth:token', token)
    AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString())
    AsyncStorage.setItem('ap:auth:refreshToken', refreshToken)
  }
}

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiryDate
  }
}

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token
      const expiryDate = getState().auth.expiryDate
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken
        AsyncStorage.getItem('ap:auth:token')
          .catch(err => reject())
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage
            if (!tokenFromStorage) {
              reject()
              return
            }
            return AsyncStorage.getItem('ap:auth:expiryDate')
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate))
            const now = new Date()
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken))
              resolve(fetchedToken)
            } else {
              reject()
            }
          })
          .catch(err => reject())
      } else {
        resolve(token)
      }
    })
    return promise
      .catch(err => {
        return AsyncStorage.getItem('ap:auth:refreshToken')
          .then(refreshToken => {
            return fetch(
              'https://securetoken.googleapis.com/v1/token?key=' + API_KEY,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=refresh_token&refresh_token=' + refreshToken
              }
            )
          })
          .then(res => res.json())
          .then(parsedRes => {
            if (parsedRes.id_token) {
              console.log('Refresh token worked!')
              dispatch(
                authStoreToken(
                  parsedRes.id_token,
                  parsedRes.expires_in,
                  parsedRes.refresh_token
                )
              )
              return parsedRes.id_token
            } else {
              dispatch(authClearStorage())
            }
          })
      })
      .then(token => {
        if (!token) {
          throw new Error()
        } else {
          return token
        }
      })
  }
}

export const authAutoSignIn = () => {
  return dispatch => {
    return new Promise(function(resolve, reject){
      dispatch(authGetToken())
      .then(token => {
        resolve()
        // startMainTabs();
      })
      .catch(err => console.log('Failed to fetch token!'))
    })
  }
}

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('ap:auth:token')
    AsyncStorage.removeItem('ap:auth:expiryDate')
    return AsyncStorage.removeItem('ap:auth:refreshToken')
  }
}

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage()).then(() => {
      alert('you have logout')
      // App();
    })
    dispatch(authRemoveToken())
  }
}

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  }
}
