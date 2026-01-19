import { Admin, Resource, CustomRoutes } from "react-admin";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CampaignIcon from "@mui/icons-material/Campaign";  
import { Layout } from "./Layout";
import { Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";

// Import components
import { CartList, CartShow } from "./component/Cart";
import { CategoryList, CategoryCreate, CategoryEdit } from "./component/Category";
import { ProductList, ProductCreate, ProductEdit } from "./component/Product";
import { OrderList, OrderShow } from "./component/Order";
//import { BannerList, BannerCreate, BannerEdit } from "./component/Banner";
import ProductImageUpdate from "./component/ProductImageUpdate";

export const App = () => {
  return (
    <Admin
      authProvider={authProvider}
      layout={Layout}
      dataProvider={dataProvider}
      dashboard={Dashboard}
    >
      <CustomRoutes>
        <Route path="/products/:id/update-image" element={<ProductImageUpdate />} />
      </CustomRoutes>

      {/* 🗂️ Resources */}
      <Resource
        name="categories"
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
        icon={CategoryIcon}
      />

      <Resource
        name="products"
        list={ProductList}
        create={ProductCreate}
        edit={ProductEdit}
        icon={Inventory2Icon}
      />

     <Resource
        name="carts"
        list={CartList}
        show={CartShow}
        icon={ShoppingCartIcon}
      />

      <Resource
        name="orders"
        list={OrderList}
        show={OrderShow}
        icon={ReceiptLongIcon}
      />

      {/* <Resource
        name="banners"
        list={BannerList}
        create={BannerCreate}
        edit={BannerEdit}
        icon={CampaignIcon}
      />  */}
    </Admin>
  );
};