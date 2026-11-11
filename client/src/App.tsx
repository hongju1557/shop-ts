import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './layouts/Header'
import ProductList from './products/ProductList'
import ProductProvider from './context/ProductProvider'
import ProductDetail from './products/ProductDetail'
import AddProduct from './products/AddProduct'
import CartProvider from './context/CartProvider'
import Cart from './products/Cart'
import UserProvider from './context/UserProvider'
import SignUp from './users/SignUp'
import SignIn from './users/SignIn'
import AdminPage from './users/AdminPage'
import EditProduct from './products/EditProduct'
import AdminRoute from './users/AdminRoute'

function App() {

  return (
    // <UserProvider> - 로그인 상태를 전역으로 관리하므로 최상위에 위치함
    <UserProvider>
      <ProductProvider>
        {/* ProductProvider 내부의 컴포넌트는 children 이다.*/}
        <CartProvider>
          {/* ProductProvider를 참조하므로 내부에 위치한다. */}
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path='/' element={<ProductList />} />
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route element={<AdminRoute />}>
                  <Route path='/product/new' element={<AddProduct />} />
                  <Route path='/product/:id/edit' element={<EditProduct />} />
                  <Route path='/admin' element={<AdminPage />} />
                </Route>
                <Route path='/cart' element={<Cart />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<SignIn />} />
              </Routes>
            </main>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  )
}

export default App
