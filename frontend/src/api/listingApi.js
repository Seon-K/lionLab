import { get, post, patch, remove } from './client'
import { getBooks } from './bookApi'
import { getCourses } from './courseApi'
import { normalizeListing, toListingPayload } from './normalizers'
import { getListingOwnerName } from '../utils/listingOwnership'

function applyLocalSellerName(listing) {
  const sellerName = getListingOwnerName(listing?.id)
  return sellerName ? { ...listing, seller_name: sellerName } : listing
}

async function getLookupData() {
  const [books, courses] = await Promise.all([getBooks(), getCourses()])
  return { books, courses }
}

export async function getListings(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })

  const [listings, lookup] = await Promise.all([
    get(`/listings/${query.toString() ? `?${query.toString()}` : ''}`),
    getLookupData(),
  ])

  return listings.map((listing) => applyLocalSellerName(normalizeListing(listing, lookup.books, lookup.courses)))
}

export async function getListing(id) {
  const [listing, lookup] = await Promise.all([get(`/listings/${id}/`), getLookupData()])
  return applyLocalSellerName(normalizeListing(listing, lookup.books, lookup.courses))
}

export async function createListing(data) {
  const created = await post('/listings/', toListingPayload(data))
  const lookup = await getLookupData()
  return applyLocalSellerName(normalizeListing(created, lookup.books, lookup.courses))
}

export async function updateListing(id, data) {
  const updated = await patch(`/listings/${id}/`, toListingPayload(data))
  const lookup = await getLookupData()
  return applyLocalSellerName(normalizeListing(updated, lookup.books, lookup.courses))
}

export async function deleteListing(id) {
  return remove(`/listings/${id}/`)
}

