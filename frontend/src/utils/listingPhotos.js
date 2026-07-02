const STORAGE_KEY = 'campusbooks_listing_photos'

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeStore(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function readListingPhotos(listingId) {
  if (!listingId) return []
  return readStore()[String(listingId)] || []
}

export function saveListingPhotos(listingId, photos) {
  if (!listingId) return false

  const store = readStore()
  store[String(listingId)] = photos.slice(0, 3).map((photo, index) => ({
    id: photo.id || `${listingId}-${index}`,
    name: photo.name || `책 상태 사진 ${index + 1}`,
    src: photo.src,
  }))
  return writeStore(store)
}

export function removeListingPhotos(listingId) {
  if (!listingId) return

  const store = readStore()
  delete store[String(listingId)]
  writeStore(store)
}

export function getListingPhotos(listing) {
  const apiPhotos = listing?.photos || listing?.listing_photos || listing?.images || []
  const normalizedApiPhotos = apiPhotos
    .map((photo, index) => {
      const src = typeof photo === 'string' ? photo : photo?.src || photo?.image || photo?.url
      if (!src) return null
      return {
        id: photo?.id || `api-${index}`,
        name: photo?.name || `책 상태 사진 ${index + 1}`,
        src,
      }
    })
    .filter(Boolean)

  return normalizedApiPhotos.length > 0 ? normalizedApiPhotos : readListingPhotos(listing?.id)
}
