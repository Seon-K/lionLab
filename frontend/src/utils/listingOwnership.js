const STORAGE_KEY = 'campusbooks_listing_owners'

function readOwners() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeOwners(owners) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(owners))
}

export function saveListingOwner(listingId, sellerName, password) {
  if (!listingId || !sellerName || !password) return

  const owners = readOwners()
  owners[String(listingId)] = {
    sellerName: sellerName.trim(),
    password: password.trim(),
  }
  writeOwners(owners)
}

export function hasListingOwner(listingId) {
  return Boolean(readOwners()[String(listingId)])
}

export function verifyListingOwner(listingId, sellerName, password) {
  const owner = readOwners()[String(listingId)]
  if (!owner) return false

  return owner.sellerName === sellerName.trim() && owner.password === password.trim()
}

export function removeListingOwner(listingId) {
  const owners = readOwners()
  delete owners[String(listingId)]
  writeOwners(owners)
}

export function getListingOwnerName(listingId) {
  const owner = readOwners()[String(listingId)]
  return owner?.sellerName ?? ''
}
