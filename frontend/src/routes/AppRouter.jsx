import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/common/Layout'
import CoursePage from '../pages/CoursePage'
import HomePage from '../pages/HomePage'
import ListingCreatePage from '../pages/ListingCreatePage'
import ListingDetailPage from '../pages/ListingDetailPage'
import ListingEditPage from '../pages/ListingEditPage'
import ListingListPage from '../pages/ListingListPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<Navigate to="/listings" replace />} />
          <Route path="/books/search" element={<Navigate to="/listings" replace />} />
          <Route path="/listings" element={<ListingListPage />} />
          <Route path="/listings/new" element={<ListingCreatePage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/listings/:id/edit" element={<ListingEditPage />} />
          <Route path="/courses" element={<CoursePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRouter

