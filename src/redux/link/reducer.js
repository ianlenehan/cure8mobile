import * as types from '../types'

const initialState = {
  newLinks: null,
  archivedLinks: null,
  loading: true,
  archiveMode: {},
  url: '',
  comment: '',
  category: '',
  authorized: true,
  linkCurated: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_LINKS:
      return {
        ...state,
        newLinks: action.payload.newLinks,
        archivedLinks: action.payload.archivedLinks,
        loading: false,
        authorized: true,
      }
    case types.LINK_CURATED:
      return {
        ...state,
        links: action.payload,
        loading: false,
        authorized: true,
        linkCurated: true,
      }
    case types.TOAST_DISPLAYED:
      return { ...state, linkCurated: null }
    case types.REQUESTED_LINKS:
      return { ...state, loading: true, authorized: true }
    case types.CREATE_LINK:
      return { ...state, links: action.payload, authorized: true }
    case types.NO_LINKS:
      return { ...state, links: [], loading: false, authorized: true }
    case types.URL_CHANGED:
      return { ...state, url: action.payload, authorized: true }
    case types.COMMENT_CHANGED:
      return { ...state, comment: action.payload, authorized: true }
    case types.CATEGORY_CHANGED:
      return { ...state, category: action.payload, authorized: true }
    case types.ARCHIVE_MODE_CHANGED:
      return { ...state, archiveMode: action.payload, authorized: true }
    case types.SHARE_LINK:
      return { ...state, authorized: true }
    case types.NOT_AUTHORIZED:
      return { ...state, authorized: false }
    default:
      return state
  }
}
