import axios from 'axios'
import * as types from '../types'
import rootURL from '../../../environment'

const apiNamespace = 'v2/'
const apiUrl = `${rootURL}${apiNamespace}`

export const urlChanged = (url) => {
  return {
    type: types.URL_CHANGED,
    payload: url,
  }
}

export const commentChanged = (comment) => {
  return {
    type: types.COMMENT_CHANGED,
    payload: comment,
  }
}

export const categoryChanged = (category) => {
  return {
    type: types.CATEGORY_CHANGED,
    payload: category,
  }
}

export const setArchiveMode = (curation, action) => {
  return {
    type: types.ARCHIVE_MODE_CHANGED,
    payload: { curation, action },
  }
}

export const archiveLink = ({ id, rating, action, token, tags }) => {
  return (dispatch) => {
    dispatch({ type: types.REQUESTED_LINKS })

    axios.post(`${apiUrl}links/archive`, {
      curation: { id, rating, action, tags },
      user: { token },
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: types.GET_LINKS,
            payload: res.data,
          })
        } else if (res.status === 401) {
          dispatch({ type: types.NOT_AUTHORIZED })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export const toastDisplayed = () => {
  return (dispatch) => {
    dispatch({ type: types.TOAST_DISPLAYED })
  }
}

export const addTags = (id, tags, token) => {
  return (dispatch) => {
    dispatch({ type: types.REQUESTED_LINKS })

    axios.post(`${apiUrl}links/update_tags`, {
      curation: { id, tags },
      user: { token },
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: types.GET_LINKS,
            payload: res.data,
          })
        } else if (res.status === 401) {
          dispatch({ type: types.NOT_AUTHORIZED })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }
}

export const shareLink = () => {
  return {
    type: types.SHARE_LINK,
  }
}

export const createLink = ({ url, comment, contacts, token, saveToMyLinks }) => {
  return (dispatch) => {
    dispatch({ type: types.REQUESTED_LINKS })

    axios.post(`${apiUrl}links/create`, {
      link: {
        url,
        comment,
        contacts,
        save_to_my_links: saveToMyLinks,
      },
      user: { token },
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: types.LINK_CURATED,
            payload: res.data,
          })
        } else if (res.status === 401) {
          dispatch({ type: types.NOT_AUTHORIZED })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export const organiseLinks = (links, status) => {
  const filteredLinks = links.filter((link) => {
    return link.status === status
  })
  return filteredLinks.sort((a, b) => {
    return new Date(b.date_added) - new Date(a.date_added)
  })
}

export const getLinks = (token) => {
  return (dispatch) => {
    dispatch({ type: types.REQUESTED_LINKS })

    axios.post(`${apiUrl}links/fetch`, { user: { token } })
      .then((res) => {
        if (res.status === 200) {
          const newLinks = organiseLinks(res.data, 'new')
          const archivedLinks = organiseLinks(res.data, 'archived')
          dispatch({
            type: types.GET_LINKS,
            payload: { newLinks, archivedLinks },
          })
        } else if (res.status === 204) {
          dispatch({ type: types.NO_LINKS })
        } else if (res.status === 401) {
          dispatch({ type: types.NOT_AUTHORIZED })
        }
      })
      .catch((err) => {
        console.log('error', err)
      })
  }
}
