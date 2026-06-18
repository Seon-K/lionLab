import { listings } from './mockData'

export async function getListings() {
  return listings
}

export async function getListing(id) {
  return listings.find((listing) => listing.id === Number(id)) ?? listings[0]
}

export async function updateListing(id, data) {
  const listing = await getListing(id)
  return { ...listing, ...data }
}
